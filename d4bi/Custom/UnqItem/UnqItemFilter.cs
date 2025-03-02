using Importer.Fixer;
using Importer.Model;

namespace Importer.Custom.UnqItem
{
    internal class UnqItemFilter : IItemsFixer<Item>
    {
        private readonly long[] _ignoreItems =
            [
            1858740, 2166775, 1913227, 2088144, 2164973, 2166772, 2152972, 2162475, 1894225, 1895757,
            2106123, 2164894, 1895652, 1963756, 2088142, 2125639, 1945835, 2088150, 2125596, 1895747,
            1963748, 2088133, 2125631, 1895838, 2123445, 2123439
            ];
        
        public Task FixItemsAsync(List<Item> items)
        {
            foreach (var item in items.ToList())
            {
                if (_ignoreItems.Contains(item.Id))
                {
                    items.Remove(item);
                    continue;
                }

                if (item.Name?.Contains("[PH]") ?? false)
                {
                    items.Remove(item);
                    continue;
                }
            }

            return Task.CompletedTask;
        }
    }
}
