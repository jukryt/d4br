using Importer.Logger;
using Importer.Model;

namespace Importer.Checker
{
    internal interface IItemsChecker<T> where T : Item
    {
        public void CheckItems(IReadOnlyList<T> items, ILogger logger);
    }
}
