using Importer.Fixer;
using Importer.Logger;
using Importer.Serializer;
using System.Text.RegularExpressions;

namespace Importer.Custom.Temper
{
    internal class TemperEnFill : IItemsFixer<TemperEnItem>
    {
        private readonly Dictionary<string, Action<TemperInfo>> _fixTemperHeads = new()
        {
            ["Ultimate Efficiency"] = (temper) =>
            {
                temper.Name = "Ultimate Efficiency - Rogue";
            },
        };

        private readonly Dictionary<string, Func<List<string>, string, string>> _fixTemperValues = new()
        {
            ["[13.5-22.5%] Shadow Clone Cooldown Reduction\nCasting Ultimate Skills Restores [36 - 45] Primary Resource"] = (values, value) =>
            {
                var splitValues = value.Split('\n');

                foreach (var splitValue in splitValues.Skip(1))
                    values.Add(splitValue);

                return splitValues[0];
            },
            ["Casting Macabrre Skills Restores [15-21] Primary Resource"] = (values, value) =>
            {
                values.Add(value.Replace("Macabrre", "Macabre"));
                return value;
            },
        };

        public required string ManualsUrl { get; init; }

        public Task FixItemsAsync(List<TemperEnItem> items, ILogger logger)
        {
            return FillStatsAsync(items, logger);
        }

        private async Task FillStatsAsync(List<TemperEnItem> items, ILogger logger)
        {
            var manuals = await GetManualsAsync();

            var tempers = manuals.Select(m => new TemperInfo(m.Name, m.Class, m.Type, m.Stats)).ToList();

            FixTemperHeads(tempers, logger);
            FixTemperValues(tempers, logger);

            var temperDictionary = tempers.ToDictionary(t => t.Name, t => t);

            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Name))
                    continue;

                var name = item.Name;

                if (temperDictionary.TryGetValue(item.Name, out var temperInfo))
                {
                    item.Class = temperInfo.CharClass;
                    item.Type = temperInfo.TemperType;
                    item.Values = [.. temperInfo.Values];
                }
            }
        }

        private void FixTemperHeads(IEnumerable<TemperInfo> tempers, ILogger logger)
        {
            if (!_fixTemperHeads.Any())
                return;

            var fixTemperHeads = new HashSet<string>();
            foreach (var temper in tempers)
            {
                if (_fixTemperHeads.TryGetValue(temper.Name, out var headAction))
                {
                    var name = temper.Name;
                    headAction(temper);
                    fixTemperHeads.Add(name);
                }
            }

            if (_fixTemperHeads.Count != fixTemperHeads.Count)
                logger.WriteMessage($"{nameof(FixTemperHeads)} count not match", nameof(TemperEnFill));
        }

        private void FixTemperValues(IEnumerable<TemperInfo> tempers, ILogger logger)
        {
            var fixTemperValues = new HashSet<string>();

            foreach (var temper in tempers)
            {
                for (var i = 0; i < temper.Values.Count; i++)
                {
                    var sourceValue = temper.Values[i];

                    if (_fixTemperValues.TryGetValue(sourceValue, out var valueAction))
                    {
                        sourceValue = valueAction(temper.Values, sourceValue);
                        fixTemperValues.Add(sourceValue);
                    }

                    temper.Values[i] = Regex.Replace(sourceValue, @"\[[^\]]+\]", "///")
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

            if (_fixTemperValues.Count != fixTemperValues.Count)
                logger.WriteMessage($"{nameof(FixTemperValues)} count not match", nameof(TemperEnFill));
        }

        private async Task<List<ManualObject.TemperingStat>> GetManualsAsync()
        {
            using var client = new HttpClient();
            var json = await client.GetStringAsync(ManualsUrl);
            return JsonSerializer.Deserialize<ManualObject.Root>(json)
                .Result.PageContext.TemperingStats;
        }

        private sealed class TemperInfo(string name, string charСlass, string temperType, IEnumerable<string> values)
        {
            public string Name { get; set; } = name;
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
