using Importer.Fixer;
using Importer.Report;

namespace Importer.Custom.Temper.En
{
    internal class TemperEnFixData : IItemsFixer<TemperItem>
    {
        private static readonly Dictionary<long, Func<TemperItem, bool>> TemperFixers = new()
        {
            [1868200] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Summon Damage", $"{TemperReader.ValueMacros}Summoning Damage"),

            [1926048] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Summon Damage", $"{TemperReader.ValueMacros}Summoning Damage"),

            [1926187] = (temper) =>
                AddAlternativeDetailName(temper, $"Casting Macabre Skills Restores{TemperReader.ValueMacros}Primary Resource", $"Casting Macabrre Skills Restores{TemperReader.ValueMacros}Primary Resource"),

            [1989572] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Ice Blades Lucky Hit Chance", $"{TemperReader.ValueMacros}Ice Blade Lucky Hit Chance"),

            [2007697] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Damage Reduction for Your Summons", $"{TemperReader.ValueMacros}Damage Reduction for Your Minons") &
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Chance For Minion Attacks to Fortify You for 3% Maximum Life", $"{TemperReader.ValueMacros}Chance for your Minion Attacks to Fortify you for 3% Maximum Life"),
        };

        private static bool AddAlternativeDetailName(TemperItem item, string originName, string addedName)
        {
            var detail = item.Details.SingleOrDefault(v => v.Names.Contains(originName));
            if (detail == null)
                return false;

            detail.Names.Add(addedName);
            return true;
        }

        public Task FixItemsAsync(List<TemperItem> items, IMessageReporter reporter)
        {
            foreach (var item in items)
            {
                if (TemperFixers.TryGetValue(item.Id, out var temperFix))
                {
                    if (!temperFix(item))
                        reporter.WriteMessage($"Fix not completed ({item.Id})", nameof(TemperEnFixData));
                }
            }

            return Task.CompletedTask;
        }
    }
}
