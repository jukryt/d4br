using Importer.Fixer;
using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceFix<T> where T : Item
    {
        public required IReadOnlyCollection<IItemsFixer<T>> Fixers { get; init; } = [];

        public virtual ResourceFixer<T> CreateFixer()
        {
            return new ResourceFixer<T>(this);
        }
    }
}
