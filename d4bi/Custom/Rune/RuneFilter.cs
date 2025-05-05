using Importer.Custom.UnqItem;
using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.Rune
{
    internal class RuneFilter : IItemsFixer<Item>
    {
        private static readonly IReadOnlyDictionary<long, string> IgnoreItems = new Dictionary<long, string>()
        {
            [2100070] = "Random Legendary Rune",
            [2099971] = "Random Rare or Legendary Rune",
            [2062544] = "Random Rune",
            [2041397] = "TEST 1 Hz rune",
            [2050494] = "TEST 0.1 Hz rune",
        };

        private readonly bool _ignoreName;

        public RuneFilter(bool ignoreName)
        {
            _ignoreName = ignoreName;
        }

        public Task FixItemsAsync(List<Item> items, IMessageReporter reporter)
        {
            RemoveIgnoreItems(items, reporter);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<Item> items, IMessageReporter reporter)
        {
            var ignoreItems = new HashSet<long>();

            foreach (var item in items.ToList())
            {
                if (IgnoreItems.TryGetValue(item.Id, out var name) &&
                    (_ignoreName || name.Equals(item.Name)))
                {
                    items.Remove(item);
                    ignoreItems.Add(item.Id);
                }
            }

            if (IgnoreItems.Count != ignoreItems.Count)
            {
                var exceptItems = IgnoreItems.Keys.Except(ignoreItems);
                var exceptItemsString = string.Join(", ", exceptItems);
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(UnqItemFilter));
            }
        }
    }
}
