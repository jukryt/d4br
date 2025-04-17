using Importer.Fixer;
using Importer.Report;

namespace Importer.Custom.Temper
{
    internal class TemperEnFixData : IItemsFixer<TemperItem>
    {
        private static readonly Dictionary<long, Func<TemperItem, bool>> TemperFixers = new()
        {
            [1868200] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Summon Damage", $"{TemperReader.ValueMacros}Summoning Damage") &
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Skeleton Mage Damage", $"{TemperReader.ValueMacros}Skeletal Mages Damage") &
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Golem Damage", $"{TemperReader.ValueMacros}Golems Damage"),

            [1873425] = (temper) =>
                AddAlternativeDetailName(temper, $"Shadow Imbue Lasts For{TemperReader.ValueMacros}Cast", $"Shadow Imbue Lasts For{TemperReader.ValueMacros}Casts") &
                AddAlternativeDetailName(temper, $"Poison Imbue Lasts For{TemperReader.ValueMacros}Cast", $"Poison Imbue Lasts For{TemperReader.ValueMacros}Casts") &
                AddAlternativeDetailName(temper, $"Cold Imbue Lasts For{TemperReader.ValueMacros}Cast", $"Cold Imbue Lasts For{TemperReader.ValueMacros}Casts"),

            [1873434] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Damage to Enemies Affected by Trap Skills", $"{TemperReader.ValueMacros}Damage to Trapped Enemies"),

            [1885045] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Chance for Shred to Deal Double Damage", $"{TemperReader.ValueMacros}Chance for Shred to Hit Twice"),

            [1926048] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Damage to Enemies Affected by Curse Skills", $"{TemperReader.ValueMacros}Damage to Cursed Enemies"),

            [1926187] = (temper) =>
                AddAlternativeDetailName(temper, $"Blood Orbs Restore{TemperReader.ValueMacros}Essence", $"Blood Orbs Restores{TemperReader.ValueMacros}Essence") &
                AddAlternativeDetailName(temper, $"Casting Macabre Skills Restores{TemperReader.ValueMacros}Primary Resource", $"Casting Macabrre Skills Restores{TemperReader.ValueMacros}Primary Resource"),

            [1926288] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}to Spiked Armor", $"{TemperReader.ValueMacros}Spiked Armor"),

            [1989572] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Ice Blades Lucky Hit Chance", $"{TemperReader.ValueMacros}Ice Blade Lucky Hit Chance"),

            [1998716] = (temper) =>
                AddAlternativeDetailName(temper, $"Casted Hydras Have{TemperReader.ValueMacros}Head", $"Casted Hydras Have{TemperReader.ValueMacros}Heads"),

            [2007697] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Damage Reduction for Your Summons", $"{TemperReader.ValueMacros}Damage Reduction for Your Minons") &
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Chance For Minion Attacks to Fortify You for 3% Maximum Life", $"{TemperReader.ValueMacros}Chance for your Minion Attacks to Fortify you for 3% Maximum Life"),

            [2007850] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Damage per Dark Shroud Shadow", $"{TemperReader.ValueMacros}Damage per Dark Shroud"),

            [2058740] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Storm Feather Potency", $"{TemperReader.ValueMacros}Spirit Feather Potency"),

            [2058798] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Razor Wings Charges", $"{TemperReader.ValueMacros}Razor Wing Charges"),

            [2087588] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Chance for Dance of Knives to Deal Double Damage", $"{TemperReader.ValueMacros}Chance for Dance of Knives Projectiles to Deal Double Damage"),

            [2089978] = (temper) =>
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Basic Damage", $"{TemperReader.ValueMacros}Basic Skill Damage") &
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Core Damage", $"{TemperReader.ValueMacros}Core Skill Damage") &
                AddAlternativeDetailName(temper, $"{TemperReader.ValueMacros}Ultimate Damage", $"{TemperReader.ValueMacros}Ultimate Skill Damage"),
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
