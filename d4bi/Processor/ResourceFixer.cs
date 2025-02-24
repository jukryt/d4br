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
            await ApplyFixActionsAsync(items, _fix.ItemActions);
        }

        private async Task ApplyFixActionsAsync(IEnumerable<T> items, IEnumerable<IFixItemAction<T>> fixActions)
        {
            foreach (var fixAction in fixActions)
            {
                foreach (var item in items)
                    await fixAction.FixItemAsync(item);
            }
        }
    }
}
