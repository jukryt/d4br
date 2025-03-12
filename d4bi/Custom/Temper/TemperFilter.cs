using Importer.Fixer;
using Importer.Logger;
using Importer.Model;

namespace Importer.Custom.Temper
{
    internal class TemperFilter<T> : IItemsFixer<T> where T : Item
    {
        private readonly HashSet<long> _ignoreItems = new()
        {
            1862212, // Barbarian Protection (Legacy)
        };

        public Task FixItemsAsync(List<T> items, ILogger logger)
        {
            IgnoreItems(items, logger);

            return Task.CompletedTask;
        }

        private void IgnoreItems(List<T> items, ILogger logger)
        {
            var ignoreItems = new HashSet<long>();

            foreach (var item in items.ToList())
            {
                if (_ignoreItems.Contains(item.Id))
                {
                    items.Remove(item);
                    ignoreItems.Add(item.Id);
                }
            }

            if (_ignoreItems.Count != ignoreItems.Count)
            {
                var exceptItems = _ignoreItems.Except(ignoreItems);
                var exceptItemsString = string.Join(", ", exceptItems);
                logger.WriteMessage($"{nameof(IgnoreItems)} not match ({exceptItemsString})", nameof(TemperFilter<T>));
            }
        }
    }
}
