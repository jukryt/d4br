namespace Importer.Custom.Temper
{
    internal class TemperEnInternalNameParser : TemperInternalNameParser
    {
        public override string GetTemperType(string? internalName)
        {
            var temperType = ParseTemperType(internalName);
            return temperType switch
            {
                TemperType.Weapon => "Weapons",
                TemperType.Offensive => "Offensive",
                TemperType.Defensive => "Defensive",
                TemperType.Utility => "Utility",
                TemperType.Mobility => "Mobility",
                TemperType.Resource => "Resource",
                _ => string.Empty,
            };
        }
    }
}
