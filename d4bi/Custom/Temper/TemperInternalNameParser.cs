namespace Importer.Custom.Temper
{
    internal abstract class TemperInternalNameParser : ITemperInternalNameParser
    {
        public abstract string GetTemperType(string? internalName);

        protected TemperType ParseTemperType(string? internalName)
        {
            if (string.IsNullOrEmpty(internalName))
                return TemperType.None;

            if (internalName.Contains("\u200BWeapon_"))
                return TemperType.Weapon;

            if (internalName.Contains("\u200BOffensive_"))
                return TemperType.Offensive;

            if (internalName.Contains("\u200BDefensive_"))
                return TemperType.Defensive;

            if (internalName.Contains("\u200BUtility_"))
                return TemperType.Utility;

            if (internalName.Contains("\u200BMobility_"))
                return TemperType.Mobility;

            if (internalName.Contains("\u200BResource_"))
                return TemperType.Resource;

            return TemperType.None;
        }

        protected enum TemperType
        {
            None,
            Weapon,
            Offensive,
            Defensive,
            Utility,
            Mobility,
            Resource,
        }
    }
}
