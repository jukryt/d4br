using Importer.Fixer;
using Importer.Logger;

namespace Importer.Custom.Temper
{
    internal class TemperEnFillType : IItemsFixer<TemperItem>
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
