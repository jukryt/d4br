namespace Importer.Model
{
    internal class ResourceCollection
    {
        public required string Folder { get; init; }
        public required IReadOnlyCollection<IResourceInfo> Infos { get; init; }
    }
}
