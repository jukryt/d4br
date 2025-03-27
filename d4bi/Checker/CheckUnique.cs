using Importer.Model;
using Importer.Report;

namespace Importer.Checker
{
    internal class CheckUnique<T> : IItemsChecker<T> where T : Item
    {
        public required IEqualComparer<T> Comparer { get; init; }

        public void CheckItems(IReadOnlyList<T> items, IMessageReporter reporter)
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
                reporter.WriteMessage($"Id: {item.Id} - duplicate", nameof(CheckUnique<T>));
        }
    }
}
