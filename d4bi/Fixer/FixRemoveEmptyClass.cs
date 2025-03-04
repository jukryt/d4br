using Importer.Logger;
using Importer.Model;

namespace Importer.Fixer
{
    internal class FixRemoveEmptyClass<T> : IItemsFixer<T> where T : ClassItem
    {
        public Task FixItemsAsync(List<T> items, ILogger logger)
        {
            foreach (var item in items.ToList())
            {
                item.Classes = [.. item.Classes.Where(c => !string.IsNullOrEmpty(c))];

                if (item.Classes.Length == 0)
                    items.Remove(item);
            }

            return Task.CompletedTask;
        }
    }
}
