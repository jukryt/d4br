using Importer.Fixer;
using Importer.Report;

namespace Importer.Custom.Temper
{
    internal class TemperFilter : IItemsFixer<TemperItem>
    {
        private static readonly IReadOnlyDictionary<long, string> IgnoreItems = new Dictionary<long, string>()
        {
            [1862212] = "Barbarian Protection (Legacy)",
        };

        private readonly bool _ignoreName;

        public TemperFilter(bool ignoreName)
        {
            _ignoreName = ignoreName;
        }

        public Task FixItemsAsync(List<TemperItem> items, IMessageReporter reporter)
        {
            RemoveIgnoreItems(items, reporter);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<TemperItem> items, IMessageReporter reporter)
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
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(TemperFilter));
            }
        }
    }
}
