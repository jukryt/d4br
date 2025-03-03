using Importer.Fixer;
using Importer.Logger;
using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceFix<T> where T : Item
    {
        public required IReadOnlyCollection<IItemsFixer<T>> Fixers { get; init; } = [];

        public virtual ResourceFixer<T> CreateFixer(string resourceName, ILogger logger)
        {
            return new ResourceFixer<T>(resourceName, this, logger);
        }
    }
}
