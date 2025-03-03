using Importer.Fixer;
using Importer.Model;

namespace Importer.Custom.Temper
{
    internal class TemperFilter<T> : IItemsFixer<T> where T : Item
    {
        private readonly long[] _ignoreItems =
            [
            1862212, 1880220, 1861356, 1868200,
            ];

        public Task FixItemsAsync(List<T> items)
        {
            foreach (var item in items.ToList())
            {
                if (_ignoreItems.Contains(item.Id))
                    items.Remove(item);
            }

            return Task.CompletedTask;
        }
    }
}
