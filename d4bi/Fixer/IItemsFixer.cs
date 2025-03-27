using Importer.Model;
using Importer.Report;

namespace Importer.Fixer
{
    internal interface IItemsFixer<T> where T : Item
    {
        public Task FixItemsAsync(List<T> items, IMessageReporter reporter);
    }
}
