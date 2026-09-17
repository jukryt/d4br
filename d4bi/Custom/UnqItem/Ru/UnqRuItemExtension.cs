using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.UnqItem.Ru
{
    internal class UnqRuItemExtension : IItemsFixer<Item>
    {
        private static readonly IReadOnlyDictionary<long, string> ExtensionItems = new Dictionary<long, string>()
        {
            [33000001] = "Корона Леорика",
            [33000002] = "Иорданов камень",
            [33000003] = "Рубаха Попрыгушки",
            [33000004] = "Наручи возмездия",
            [33000005] = "Горнило",
            [33000006] = "Ин-Гиом",
            [33000007] = "Игла Ариока",
        };

        public Task FixItemsAsync(List<Item> items, IMessageReporter reporter)
        {
            foreach (var extensionItem in ExtensionItems)
                items.Add(new Item { Id = extensionItem.Key, Name = extensionItem.Value });

            return Task.CompletedTask;
        }
    }
}
