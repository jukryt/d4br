using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.Elixir
{
    internal class ElixirFilter : IItemsFixer<Item>
    {
        private static readonly IReadOnlyDictionary<long, string> IgnoreItems = new Dictionary<long, string>()
        {
            [2072996] = " Seething Opal of Equipment",
            [2072959] = " Seething Opal of Gold",
            [2073000] = " Seething Opal of Materials",
            [2072998] = " Seething Opal of Socketables",
            [2073002] = " Seething Opal of Torment",
            [1804973] = "[PH]Elixir of Hollow-slaying",
            [1593068] = "Charred Demon Heart",
            [413331] = "Elixir of Fortitude",
            [701382] = "Elixir of Resourcefulness",
            [1060621] = "Iron Barb Elixir",
            [1066604]= "Elixir of Cold Resistance",
            [1066694] = "Elixir of Fire Resistance",
            [1066706] = "Elixir of Lightning Resistance",
            [1066720] = "Elixir of Poison Resistance",
            [1066730] = "Precision Elixir",
            [1067052] = "Elixir of Shadow Resistance",
            [1882910] = "Profane Mindcage",
            [2368336] = "[PH] Mad Honey",
        };

        private readonly bool _ignoreName;

        public ElixirFilter(bool ignoreName)
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
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(ElixirFilter));
            }
        }
    }
}
