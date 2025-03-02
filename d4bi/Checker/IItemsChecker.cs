using Importer.Logger;
using Importer.Model;

namespace Importer.Checker
{
    internal interface IItemsChecker<in T> where T : Item
    {
        public void CheckItems(IReadOnlyCollection<T> items, ILogger logger);
    }
}
