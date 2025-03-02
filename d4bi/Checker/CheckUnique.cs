using Importer.Logger;
using Importer.Model;

namespace Importer.Checker
{
    internal class CheckUnique<T> : IItemsChecker<T> where T : Item
    {
        public required IEqualityComparer<T> Comparer { get; init; }

        public void CheckItems(IReadOnlyCollection<T> items, ILogger logger)
        {
            var set = new HashSet<T>(items.Count, Comparer);
            foreach (var item in items)
            {
                if(!set.Add(item))
                    logger.WriteMessage($"Id: {item.Id} - duplicate", nameof(CheckUnique<T>));
            }
        }
    }
}
