using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceTarget<T> where T : Item
    {
        public required string FileName { get; init; }

        public virtual ResourceWriter<T> CreateWriter(string workFolder)
        {
            return new ResourceWriter<T>(this, workFolder);
        }
    }
}
