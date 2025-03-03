using Importer.Checker;
using Importer.Logger;

namespace Importer.Custom.Temper
{
    internal class TemperEnCheckPropertyes : IItemsChecker<TemperEnItem>
    {
        public void CheckItems(IReadOnlyList<TemperEnItem> items, ILogger logger)
        {
            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Class) ||
                    string.IsNullOrEmpty(item.Type) ||
                    item.Values.Count == 0)
                    logger.WriteMessage($"Id: {item.Id} - invalid", nameof(TemperEnCheckPropertyes));
            }
        }
    }
}
