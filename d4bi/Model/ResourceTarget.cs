using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceTarget<T> where T : Item
    {
        public required string Folder { get; init; }
        public required string FileName { get; init; }

        public ResourceWriter<T> CreateWriter()
        {
            return new ResourceWriter<T>(this, Static.WorkFolder);
        }
    }
}
