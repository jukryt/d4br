using Importer.Model;
using Importer.Report;

namespace Importer.Checker
{
    internal class CheckUnique<T> : IItemsChecker<T> where T : Item
    {
        public required IEqualComparer<T> Comparer { get; init; }

        public void CheckItems(IReadOnlyList<T> items, IMessageReporter reporter)
        {
            var duplicates = new HashSet<long>();

            for (int i = 0; i < items.Count; i++)
            {
                for (int j = i + 1; j < items.Count; j++)
                {
                    if (Comparer.Equals(items[i], items[j]))
                    {
                        duplicates.Add(items[i].Id);
                        duplicates.Add(items[j].Id);
                    }
                }
            }

            foreach (var id in duplicates)
                reporter.WriteMessage($"Id: {id} - duplicate", nameof(CheckUnique<T>));
        }
    }
}
