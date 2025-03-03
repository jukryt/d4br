using Importer.Logger;
using Importer.Model;

namespace Importer.Checker
{
    internal class CheckEmptyName<T> : IItemsChecker<T> where T : Item
    {
        public void CheckItems(IReadOnlyList<T> items, ILogger logger)
        {
            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Name))
                    logger.WriteMessage($"Id: {item.Id} - {nameof(item.Name)} is empty", nameof(CheckEmptyName<T>));
            }
        }
    }
}
