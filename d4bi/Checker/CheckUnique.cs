using Importer.Logger;
using Importer.Model;

namespace Importer.Checker
{
    internal class CheckUnique<T> : IItemsChecker<T> where T : Item
    {
        public required IEqualComparer<T> Comparer { get; init; }

        public void CheckItems(IReadOnlyList<T> items, ILogger logger)
        {
            var duplicates = new HashSet<T>();

            for (int i = 0; i < items.Count; i++)
            {
                for (int j = i + 1; j < items.Count; j++)
                {
                    if (Comparer.Equals(items[i], items[j]))
                        duplicates.Add(items[j]);
                }
            }

            foreach (var item in duplicates)
                logger.WriteMessage($"Id: {item.Id} - duplicate", nameof(CheckUnique<T>));
        }
    }
}
