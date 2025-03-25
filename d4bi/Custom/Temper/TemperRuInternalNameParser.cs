namespace Importer.Custom.Temper
{
    internal class TemperRuInternalNameParser : ITemperInternalNameParser
    {
        public string GetTemperType(string? internalName)
        {
            if (string.IsNullOrEmpty(internalName))
                return string.Empty;

            if (internalName.Contains("Weapon"))
                return "Оружие";

            if (internalName.Contains("Offensive"))
                return "Атака";

            if (internalName.Contains("Defensive"))
                return "Защита";

            if (internalName.Contains("Utility"))
                return "Поддержка";

            if (internalName.Contains("Mobility"))
                return "Подвижность";

            if (internalName.Contains("Resource"))
                return "Ресурсы";

            return string.Empty;
        }
    }
}
