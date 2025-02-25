using Importer.Model;

namespace Importer.Fixer
{
    internal interface IItemsFixer<T> where T : Item
    {
        public Task FixItemsAsync(List<T> items);
    }
}
