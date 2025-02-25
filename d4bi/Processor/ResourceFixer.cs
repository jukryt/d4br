using Importer.Model;

namespace Importer.Processor
{
    internal class ResourceFixer<T> where T : Item
    {
        private readonly ResourceFix<T> _fix;

        public ResourceFixer(ResourceFix<T> fix)
        {
            _fix = fix;
        }

        public async Task FixItemsAsync(List<T> items)
        {
            foreach (var fixer in _fix.Fixers)
                await fixer.FixItemsAsync(items);
        }
    }
}
