using Importer.Model;
using Importer.Report;

namespace Importer.Fixer
{
    internal class UniqueNameFilter<T> : IItemsFixer<T> where T : Item
    {
        private readonly HashSet<string> _itemNames = [];

        public Task FixItemsAsync(List<T> items, IMessageReporter reporter)
        {
            foreach (var item in items.ToList())
            {
                if(string.IsNullOrEmpty(item.Name))
                    continue;

                if (!_itemNames.Add(item.Name))
                    items.Remove(item);
            }

            return Task.CompletedTask;
        }
    }
}
