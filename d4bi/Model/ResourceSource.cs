using Importer.Processor;

namespace Importer.Model
{
    internal class ResourceSource<T> where T : Item
    {
        public required List<SourceInfo> SourceInfos { get; init; }

        public ResourceReader<T> CreateReader()
        {
            return new ResourceReader<T>(this);
        }
    }

    internal class SourceInfo
    {
        public required string Url { get; init; }
        public required string Script { get; init; }
    }
}
