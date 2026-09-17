using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.UnqItem.En
{
    internal class UnqEnItemExtension : IItemsFixer<Item>
    {
        private static readonly IReadOnlyDictionary<long, string> ExtensionItems = new Dictionary<long, string>()
        {
            [33000001] = "Leoric's Crown",
            [33000002] = "Stone of Jordan",
            [33000003] = "Squirt's Blouse",
            [33000004] = "Nemesis Bracers",
            [33000005] = "The Furnace",
            [33000006] = "In-Geom",
            [33000007] = "Arioc's Needle",
        };

        public Task FixItemsAsync(List<Item> items, IMessageReporter reporter)
        {
            foreach (var extensionItem in ExtensionItems)
                items.Add(new Item { Id = extensionItem.Key, Name = extensionItem.Value });

            return Task.CompletedTask;
        }
    }
}
