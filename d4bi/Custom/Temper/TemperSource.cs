using Importer.Model;

namespace Importer.Custom.Temper
{
    internal abstract class TemperSource : ResourceSource<TemperItem>
    {
        public required string DetailsUrlTemplate { get; init; }
        public required string DescriptionScript { get; init; }
        public required string DetailsScript { get; init; }
    }
}
