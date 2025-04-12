using Importer.Fixer;
using Importer.Report;

namespace Importer.Custom.Temper
{
    internal class TemperEnFixData : IItemsFixer<TemperItem>
    {
        private static readonly Dictionary<long, Func<TemperItem, bool>> TemperFixers = new()
        {
            [1868200] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Summon Damage", $"{TemperReader.ValueRegex}Summoning Damage") &
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Skeleton Mage Damage", $"{TemperReader.ValueRegex}Skeletal Mages Damage") &
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Golem Damage", $"{TemperReader.ValueRegex}Golems Damage"),

            [1873425] = (temper) =>
                AddAlternativeValue(temper, $"Shadow Imbue Lasts For{TemperReader.ValueRegex}Cast", $"Shadow Imbue Lasts For{TemperReader.ValueRegex}Casts") &
                AddAlternativeValue(temper, $"Poison Imbue Lasts For{TemperReader.ValueRegex}Cast", $"Poison Imbue Lasts For{TemperReader.ValueRegex}Casts") &
                AddAlternativeValue(temper, $"Cold Imbue Lasts For{TemperReader.ValueRegex}Cast", $"Cold Imbue Lasts For{TemperReader.ValueRegex}Casts"),

            [1873434] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Damage to Enemies Affected by Trap Skills", $"{TemperReader.ValueRegex}Damage to Trapped Enemies"),

            [1885045] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Chance for Shred to Deal Double Damage", $"{TemperReader.ValueRegex}Chance for Shred to Hit Twice"),

            [1926048] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Damage to Enemies Affected by Curse Skills", $"{TemperReader.ValueRegex}Damage to Cursed Enemies"),

            [1926187] = (temper) =>
                AddAlternativeValue(temper, $"Blood Orbs Restore{TemperReader.ValueRegex}Essence", $"Blood Orbs Restores{TemperReader.ValueRegex}Essence") &
                AddAlternativeValue(temper, $"Casting Macabre Skills Restores{TemperReader.ValueRegex}Primary Resource", $"Casting Macabrre Skills Restores{TemperReader.ValueRegex}Primary Resource"),

            [1926288] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}to Spiked Armor", $"{TemperReader.ValueRegex}Spiked Armor"),

            [1989572] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Ice Blades Lucky Hit Chance", $"{TemperReader.ValueRegex}Ice Blade Lucky Hit Chance"),

            [1998716] = (temper) =>
                AddAlternativeValue(temper, $"Casted Hydras Have{TemperReader.ValueRegex}Head", $"Casted Hydras Have{TemperReader.ValueRegex}Heads"),

            [2007697] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Damage Reduction for Your Summons", $"{TemperReader.ValueRegex}Damage Reduction for Your Minons") &
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Chance For Minion Attacks to Fortify You for 3% Maximum Life", $"{TemperReader.ValueRegex}Chance for your Minion Attacks to Fortify you for 3% Maximum Life"),

            [2007850] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Damage per Dark Shroud Shadow", $"{TemperReader.ValueRegex}Damage per Dark Shroud"),

            [2058798] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Razor Wings Charges", $"{TemperReader.ValueRegex}Razor Wing Charges"),

            [2087588] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Chance for Dance of Knives to Deal Double Damage", $"{TemperReader.ValueRegex}Chance for Dance of Knives Projectiles to Deal Double Damage"),

            [2089978] = (temper) =>
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Basic Damage", $"{TemperReader.ValueRegex}Basic Skill Damage") &
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Core Damage", $"{TemperReader.ValueRegex}Core Skill Damage") &
                AddAlternativeValue(temper, $"{TemperReader.ValueRegex}Ultimate Damage", $"{TemperReader.ValueRegex}Ultimate Skill Damage"),
        };

        private static bool AddAlternativeValue(TemperItem item, string originValueName, string addedValueName)
        {
            var value = item.Values.SingleOrDefault(v => v.Names.Contains(originValueName));
            if (value == null)
                return false;

            value.Names.Add(addedValueName);
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
