using Importer.Checker;
using Importer.Logger;
using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceCheck<T> where T : Item
    {
        public required IReadOnlyCollection<IItemsChecker<T>> Checkers { get; init; } = [];

        public virtual ResourceCkecker<T> CreateChecker(string resourceName, ILogger logger)
        {
            return new ResourceCkecker<T>(resourceName, this, logger);
        }
    }
}
