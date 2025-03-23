namespace Importer.Custom.Temper
{
    internal class TemperInternalNameParserEn : ITemperInternalNameParser
    {
        public string GetTemperType(string? internalName)
        {
            if (string.IsNullOrEmpty(internalName))
                return string.Empty;

            if (internalName.Contains("Weapon"))
                return "Weapons";

            if (internalName.Contains("Offensive"))
                return "Offensive";

            if (internalName.Contains("Defensive"))
                return "Defensive";

            if (internalName.Contains("Utility"))
                return "Utility";

            if (internalName.Contains("Mobility"))
                return "Mobility";

            if (internalName.Contains("Resource"))
                return "Resource";

            return string.Empty;
        }
    }
}
