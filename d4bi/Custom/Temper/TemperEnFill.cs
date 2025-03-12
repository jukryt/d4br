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
            ["Summoning Finesse"] = (temper) =>
            {
                temper.Name = "Minion Finesse";
            },
            ["Berserking Augments"] = (temper) =>
            {
                temper.Name = "Berserking Innovation";
            },
            ["Summoning Augments"] = (temper) =>
            {
                temper.Name = "Minion Augments";
            },
        };

        private readonly Dictionary<string, Func<List<string>, string, string>> _fixTemperValues = new()
        {
            ["Lucky Hit: Up to a 40% Chance to Deal [900-2400] Poison\nDamage"] = (values, value) =>
            {
                return value.Replace('\n', ' ');
            },
            ["[88-115%] Basic Skill Damage"] = (values, value) =>
            {
                values.Add("[88-115%] Basic Damage");
                return value;
            },
            ["[46.5-60%] Core Skill Damage"] = (values, value) =>
            {
                values.Add("[46.5-60%] Core Damage");
                return value;
            },
            ["[88-115%] Ultimate Skill Damage"] = (values, value) =>
            {
                values.Add("[88-115%] Ultimate Damage");
                return value;
            },
            ["[2-3] Razor Wing Charges"] = (values, value) =>
            {
                values.Add("[2-3] Razor Wings Charges");
                return value;
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
            ApplyChanges(items, tempers);
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
                    var targetValue = sourceValue;

                    if (_fixTemperValues.TryGetValue(sourceValue, out var valueAction))
                    {
                        targetValue = valueAction(temper.Values, sourceValue);
                        fixTemperValues.Add(sourceValue);
                    }

                    temper.Values[i] = Regex.Replace(targetValue, @"\+? ?\[[^\]]+\]", "XXX")
                        .Replace("%", "\\%")
                        .Replace("+", "\\+")
                        .Replace("-", "\\-")
                        .Replace(".", "\\.")
                        .Replace(" X ", " XXX ")
                        .Replace("XXX", @" ?\+? ?[X0-9\.,\-% \[\]]+") // for js regex
                        .Replace("*", "\\*")
                        .Replace(":", "\\:")
                        .Replace("(", "\\(")
                        .Replace(")", "\\)");
                }
            }

            if (_fixTemperValues.Count != fixTemperValues.Count)
                logger.WriteMessage($"{nameof(FixTemperValues)} count not match", nameof(TemperEnFill));
        }

        private void ApplyChanges(List<TemperEnItem> items, IEnumerable<TemperInfo> tempers)
        {
            var temperDictionary = tempers.ToDictionary(t => t.Name, t => t);

            foreach (var item in items.ToList())
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
