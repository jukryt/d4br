using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.Aspect
{
    internal class AspectFilter : IItemsFixer<ClassItem>
    {
        private static readonly IReadOnlyDictionary<long, string> IgnoreItems = new Dictionary<long, string>()
        {
            [578894] = "Trickster's Aspect",
            [1186574] = "Blast-Trapper's Aspect",
            [1208172] = "High Velocity Aspect",
            [1218948] = "Aspect of Explosive Verve",
            [1338011] = "Aspect (REDESIGN) of Metamorphic Stone",
            [1761328] = "Aspect of Poisonous Clouds",
            [1971366] = "Aspect of Iron Rain",
            [2164685] = "Aspect of Apogeic Furor",
            [2461692] = "Aspect of Dominance",
            [2464860] = "Aspect of the Disciple",
        };

        private readonly bool _ignoreName;

        public AspectFilter(bool ignoreName)
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
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(AspectFilter));
            }
        }
    }
}
