using Importer.Fixer;
using Importer.Report;

namespace Importer.Custom.Temper
{
    internal class TemperFixData : IItemsFixer<TemperItem>
    {
        private static readonly Dictionary<long, Func<TemperItem, bool>> TemperFixers = new()
        {
            [1873425] = (temper) =>
                UpdateType(temper, TemperType.Resource, TemperType.Utility),

            [1885023] = (temper) =>
                UpdateType(temper, TemperType.Offensive, TemperType.Weapon),
        };

        private static bool UpdateType(TemperItem item, TemperType oldType, TemperType newType)
        {
            if (item.InternalType != oldType)
                return false;

            item.InternalType = newType;
            return true;
        }

        public Task FixItemsAsync(List<TemperItem> items, IMessageReporter reporter)
        {
            foreach (var item in items)
            {
                if (TemperFixers.TryGetValue(item.Id, out var temperFix))
                {
                    if (!temperFix(item))
                        reporter.WriteMessage($"Fix not completed ({item.Id})", nameof(TemperFixData));
                }
            }

            return Task.CompletedTask;
        }
    }
}
