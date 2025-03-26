using Importer.Fixer;
using Importer.Logger;
using Importer.Model;

namespace Importer.Custom.UnqItem
{
    internal class UnqItemFilter : IItemsFixer<Item>
    {
        private static readonly HashSet<long> IgnoreItems = new()
        {
            1858740, 2166775, 1913227, 2088144, 2164973, 2166772, 2152972, 2162475, 1894225, 1895757,
            2106123, 2164894, 1895652, 1963756, 2088142, 2125639, 1945835, 2088150, 2125596, 1895747,
            1963748, 2088133, 2125631, 1895838, 2123445, 2123439, 1905791, 1821169, 1910903, 1871286,
            1636423, 2059808, 2081143, 2081193, 2122767, 2179936, 1638633, 1756426, 1936802, 1941215,
            1952218, 2081122, 2120722, 2120724, 2122764, 2122775, 1873020, 1905115, 1905117, 1928915,
            1948065, 1948096, 1955503, 2081129, 2081159, 2120727, 2120729, 2120731, 2122769, 2122773,
            2123442, 2123447, 2123449, 2179930, 2179934, 2179938, 2179958, 2185042, 2185044, 2185046,
            2185048, 2185050, 1749652, 1928896, 1928903, 1928911, 1928913, 2099578,
        };

        public Task FixItemsAsync(List<Item> items, ILogger logger)
        {
            RemoveIgnoreItems(items, logger);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<Item> items, ILogger logger)
        {
            var ignoreItems = new HashSet<long>();

            foreach (var item in items.ToList())
            {
                if (IgnoreItems.Contains(item.Id))
                {
                    items.Remove(item);
                    ignoreItems.Add(item.Id);
                }
            }

            if (IgnoreItems.Count != ignoreItems.Count)
            {
                var exceptItems = IgnoreItems.Except(ignoreItems);
                var exceptItemsString = string.Join(", ", exceptItems);
                logger.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(UnqItemFilter));
            }
        }
    }
}
