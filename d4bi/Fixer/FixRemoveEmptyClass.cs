using Importer.Model;
using Importer.Report;

namespace Importer.Fixer
{
    internal class FixRemoveEmptyClass<T> : IItemsFixer<T> where T : ClassItem
    {
        public Task FixItemsAsync(List<T> items, IMessageReporter reporter)
        {
            foreach (var item in items.ToList())
            {
                item.Classes = [.. item.Classes.Where(c => !string.IsNullOrEmpty(c))];
            }

            return Task.CompletedTask;
        }
    }
}
