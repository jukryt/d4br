namespace Importer.Custom.Temper
{
    internal class TemperRuInternalNameParser : TemperInternalNameParser
    {
        public override string GetTemperType(string? internalName)
        {
            var temperType = ParseTemperType(internalName);
            return temperType switch
            {
                TemperType.Weapon => "Оружие",
                TemperType.Offensive => "Атака",
                TemperType.Defensive => "Защита",
                TemperType.Utility => "Поддержка",
                TemperType.Mobility => "Подвижность",
                TemperType.Resource => "Ресурсы",
                _ => string.Empty,
            };
        }
    }
}
