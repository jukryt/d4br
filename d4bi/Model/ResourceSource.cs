namespace Importer.Model
{
    internal class ResourceSource<T> where T : Item
    {
        public required List<SourceInfo> SourceInfos { get; init; }
    }

    internal class SourceInfo
    {
        public required string Url { get; init; }
        public required string Script { get; init; }
    }
}
