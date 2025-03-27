using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.Temper
{
    internal class TemperFilter<T> : IItemsFixer<T> where T : Item
    {
        private static readonly HashSet<long> IgnoreItems = new()
        {
            1862212, // Barbarian Protection (Legacy)
        };

        public Task FixItemsAsync(List<T> items, IMessageReporter reporter)
        {
            RemoveIgnoreItems(items, reporter);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<T> items, IMessageReporter reporter)
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
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(TemperFilter<T>));
            }
        }
    }
}
