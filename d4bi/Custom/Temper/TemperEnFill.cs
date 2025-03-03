using Importer.Fixer;
using Importer.Logger;
using Importer.Serializer;
using System.Text.RegularExpressions;

namespace Importer.Custom.Temper
{
    internal class TemperEnFill : IItemsFixer<TemperEnItem>
    {
        private readonly Dictionary<string, string> _renameTempers = new()
        {
            ["Ultimate Efficiency"] = "Ultimate Efficiency - Rogue",
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
        };

        public required string ManualsUrl { get; init; }

        public Task FixItemsAsync(List<TemperEnItem> items, ILogger logger)
        {
            return FillStatsAsync(items, logger);
        }

        private async Task FillStatsAsync(List<TemperEnItem> items, ILogger logger)
        {
            var manuals = await GetManualsAsync();

            FixTemperName(manuals, logger);

            var tempers = manuals.ToDictionary(m => m.Name, m => new TemperInfo(m.Class, m.Type, m.Stats));

            FixTemperValues(tempers.Values, logger);

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

        private void FixTemperName(IEnumerable<ManualObject.TemperingStat> manuals, ILogger logger)
        {
            if (!_renameTempers.Any())
                return;

            var renameCount = 0;
            foreach (var manual in manuals)
            {
                if (_renameTempers.TryGetValue(manual.Name, out var newName))
                {
                    manual.Name = newName;
                    renameCount++;
                }
            }

            if (_renameTempers.Count != renameCount)
                logger.WriteMessage("RenameTempers not match", nameof(TemperEnFill));
        }

        private void FixTemperValues(IEnumerable<TemperInfo> temperInfos, ILogger logger)
        {
            var fixTemperValuesCount = 0;

            foreach (var temperInfo in temperInfos)
            {
                for (var i = 0; i < temperInfo.Values.Count; i++)
                {
                    var sourceValue = temperInfo.Values[i];

                    if (_fixTemperValues.TryGetValue(sourceValue, out var invalidValueAction))
                    {
                        sourceValue = invalidValueAction(temperInfo.Values, sourceValue);
                        fixTemperValuesCount++;
                    }

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

            if (_fixTemperValues.Count != fixTemperValuesCount)
                logger.WriteMessage("FixTemperValues not match", nameof(TemperEnFill));
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
