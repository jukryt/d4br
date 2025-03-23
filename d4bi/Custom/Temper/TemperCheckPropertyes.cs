using Importer.Checker;
using Importer.Logger;

namespace Importer.Custom.Temper
{
    internal class TemperCheckPropertyes : IItemsChecker<TemperItem>
    {
        public void CheckItems(IReadOnlyList<TemperItem> items, ILogger logger)
        {
            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Type) ||
                    item.Values.Count == 0 ||
                    item.Values.Any(v => v.Contains('\n')))
                    logger.WriteMessage($"Id: {item.Id} - invalid", nameof(TemperCheckPropertyes));
            }
        }
    }
}
