using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.Charm
{
    internal class CharmFilter : IItemsFixer<ClassItem>
    {
        private static readonly IReadOnlyDictionary<long, string> IgnoreItems = new Dictionary<long, string>()
        {
            [2257839] = "Charm",
            [2304176] = "Phoba of Slaughter",
            [2315174] = "Phoba of Dark Pact",
            [2315812] = "Phoba of Survival",
            [2316685] = "Phoba of Mastery",
            [2316750] = "Phoba of Practiced Technique",
            [2393546] = "Temerity",
            [2448152] = "Fer of Slaughter",
            [2448154] = "Mlor of Slaughter",
            [2448178] = "Fer of Dark Pact",
            [2448182] = "Fer of Survival",
            [2448189] = "Fer of Mastery",
            [2448191] = "Fer of Practiced Technique",
        };

        private readonly bool _ignoreName;

        public CharmFilter(bool ignoreName)
        {
            _ignoreName = ignoreName;
        }

        public Task FixItemsAsync(List<ClassItem> items, IMessageReporter reporter)
        {
            RemoveIgnoreItems(items, reporter);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<ClassItem> items, IMessageReporter reporter)
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
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(CharmFilter));
            }
        }
    }
}
