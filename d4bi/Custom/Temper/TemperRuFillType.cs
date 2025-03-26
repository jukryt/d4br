using Importer.Fixer;
using Importer.Logger;

namespace Importer.Custom.Temper
{
    internal class TemperRuFillType : IItemsFixer<TemperItem>
    {
        public Task FixItemsAsync(List<TemperItem> items, ILogger logger)
        {
            foreach (var item in items)
                item.Type = ConvertTemperType(item.InternalType);

            return Task.CompletedTask;
        }

        private string ConvertTemperType(TemperType temperType)
        {
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
