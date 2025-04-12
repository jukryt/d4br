using Importer.Checker;
using Importer.Report;

namespace Importer.Custom.Temper
{
    internal class TemperCheckProperties : IItemsChecker<TemperItem>
    {
        public void CheckItems(IReadOnlyList<TemperItem> items, IMessageReporter reporter)
        {
            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Type) ||
                    item.Values.Count == 0 ||
                    item.Values.Any(v => v.Names == null) ||
                    item.Values.Any(v => v.Names.Count == 0) ||
                    item.Values.Any(v => v.Names.Any(n => n.Contains('\n'))))
                    reporter.WriteMessage($"Id: {item.Id} - invalid", nameof(TemperCheckProperties));
            }
        }
    }
}
