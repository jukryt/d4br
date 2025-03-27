using Importer.Checker;
using Importer.Processor;
using Importer.Report;

namespace Importer.Model
{
    internal class ResourceCheck<T> where T : Item
    {
        public required IReadOnlyCollection<IItemsChecker<T>> Checkers { get; init; } = [];

        public virtual ResourceChecker<T> CreateChecker(string resourceName, IMessageReporter reporter)
        {
            return new ResourceChecker<T>(resourceName, this, reporter);
        }
    }
}
