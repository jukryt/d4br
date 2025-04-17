using Importer.Model;
using Importer.Report;

namespace Importer.Checker
{
    internal interface IItemsChecker<T> where T : Item
    {
        public void CheckItems(IReadOnlyList<T> items, IMessageReporter reporter);
    }
}
