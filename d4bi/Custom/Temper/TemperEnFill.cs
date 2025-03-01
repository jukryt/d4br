using Importer.Fixer;
using Importer.Serializer;
using System.Text.RegularExpressions;

namespace Importer.Custom.Temper
{
    internal class TemperEnFill : IItemsFixer<TemperEnItem>
    {
        public required string ManualsUrl { get; init; }

        public Task FixItemsAsync(List<TemperEnItem> items)
        {
            return FillStatsAsync(items);
        }

        private async Task FillStatsAsync(List<TemperEnItem> items)
        {
            var manuals = await GetManualsAsync();

            foreach (var manual in manuals)
            {
                if (manual.Name == "Ultimate Efficiency")
                    manual.Name = "Ultimate Efficiency - Rogue";
            }

            var tempers = manuals.ToDictionary(m => m.Name, m => new TemperInfo(m.Class, m.Type, m.Stats));

            foreach (var temperInfo in tempers.Values)
            {
                for (var i = 0; i < temperInfo.Values.Count; i++)
                {
                    var sourceValue = temperInfo.Values[i];
                    temperInfo.Values[i] = Regex.Replace(sourceValue, @"\[[^\]]+\]", "///")
                        .Replace("%", "\\%")
                        .Replace("+", "\\+")
                        .Replace("-", "\\-")
                        .Replace(".", "\\.")
                        .Replace(" X ", " \\+? ?[0-9\\.,\\-% \\[\\]]+ ") // for js regex
                        .Replace("///", "\\+? ?[0-9\\.,\\-% \\[\\]]+") // for js regex
                        .Replace("\n", " ")
                        .Replace("*", "\\*")
                        .Replace(":", "\\:")
                        .Replace("(", "\\(")
                        .Replace(")", "\\)");
                }
            }

            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Name))
                    continue;

                var name = item.Name;

                if (tempers.TryGetValue(item.Name, out var temperInfo))
                {
                    item.Class = temperInfo.CharClass;
                    item.Type = temperInfo.TemperType;
                    item.Values = [.. temperInfo.Values];
                }
            }
        }

        private async Task<List<ManualObject.TemperingStat>> GetManualsAsync()
        {
            using var client = new HttpClient();
            var json = await client.GetStringAsync(ManualsUrl);
            return JsonSerializer.Deserialize<ManualObject.Root>(json)
                .Result.PageContext.TemperingStats;
        }

        private sealed class TemperInfo(string charСlass, string temperType, IEnumerable<string> values)
        {
            public string CharClass { get; set; } = charСlass;
            public string TemperType { get; set; } = temperType;
            public List<string> Values { get; set; } = [.. values];
        }

        private sealed class ManualObject
        {
            public sealed class Root
            {
                public required Result Result { get; set; }
            }

            public sealed class Result
            {
                public required PageContext PageContext { get; set; }
            }

            public sealed class PageContext
            {
                public required List<TemperingStat> TemperingStats { get; set; }
            }

            public sealed class TemperingStat
            {
                public required string Name { get; set; }
                public required string Class { get; set; }
                public required string Type { get; set; }
                public required List<string> Stats { get; set; }
            }
        }
    }
}
