using Importer.Fixer;
using Importer.Processor;
using Importer.Report;

namespace Importer.Model
{
    internal class ResourceFix<T> where T : Item
    {
        public required IReadOnlyCollection<IItemsFixer<T>> Fixers { get; init; } = [];

        public virtual ResourceFixer<T> CreateFixer(string resourceName, ProgressReporter progressReporter, IMessageReporter reporter)
        {
            return new ResourceFixer<T>(resourceName, this, progressReporter, reporter);
        }
    }
}
