using Importer.Model;
using Importer.Processor;

namespace Importer.Custom.Temper
{
    internal class TemperSource : ResourceSource<TemperItem>
    {
        public override ResourceReader<TemperItem> CreateReader()
        {
            return new TemperReader(this);
        }

        public required string DetailsUrlTemplate { get; init; }
        public required string PropertesScript { get; init; }
        public required string ValuesScript { get; init; }
    }
}
