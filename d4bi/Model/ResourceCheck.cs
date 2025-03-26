using Importer.Checker;
using Importer.Logger;
using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceCheck<T> where T : Item
    {
        public required IReadOnlyCollection<IItemsChecker<T>> Checkers { get; init; } = [];

        public virtual ResourceChecker<T> CreateChecker(string resourceName, ILogger logger)
        {
            return new ResourceChecker<T>(resourceName, this, logger);
        }
    }
}
