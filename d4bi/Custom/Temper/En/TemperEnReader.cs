using Importer.Report;

namespace Importer.Custom.Temper.En
{
    internal class TemperEnReader : TemperReader
    {
        public TemperEnReader(TemperSource source, ProgressReporter progressReporter) : base(source, progressReporter)
        {
        }

        protected override TemperType GetTemperType(string? description)
        {
            if (string.IsNullOrEmpty(description))
                return TemperType.None;

            if (description.Equals("Affixes can be applied to Weapons.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Weapon;

            if (description.Equals("Affixes can be applied to Weapons, Gloves, Rings, and Amulets.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Offensive;

            if (description.Equals("Affixes can be applied to Helms, Chest Armor, Pants, Shields, and Amulets.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Defensive;

            if (description.Equals("Affixes can be applied to Helms, Chest Armor, Gloves, Pants, Boots, Shields, and Amulets.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Utility;

            if (description.Equals("Affixes can be applied to Boots and Amulets.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Mobility;

            if (description.Equals("Affixes can be applied to Rings and Amulets.", StringComparison.OrdinalIgnoreCase))
                return TemperType.Resource;

            return TemperType.None;
        }
    }
}
