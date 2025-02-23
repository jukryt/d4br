using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceTarget<T> where T : Item
    {
        public required string ResultFolder { get; init; }
        public required string ResultFileName { get; init; }

        public ResourceWriter<T> CreateWriter()
        {
            return new ResourceWriter<T>(this, Static.WorkFolder);
        }
    }
}
