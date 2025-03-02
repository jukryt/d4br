using Importer.Logger;
using Importer.Model;

namespace Importer.Checker
{
    internal class CheckEmptyName : IItemsChecker<Item>
    {
        public void CheckItems(IReadOnlyList<Item> items, ILogger logger)
        {
            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Name))
                    logger.WriteMessage($"Id: {item.Id} - {nameof(item.Name)} is empty", nameof(CheckEmptyName));
            }
        }
    }
}
