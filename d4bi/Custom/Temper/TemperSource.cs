using Importer.Model;
using Importer.Processor;
using Importer.Report;

namespace Importer.Custom.Temper
{
    internal class TemperSource : ResourceSource<TemperItem>
    {
        public override ResourceReader<TemperItem> CreateReader(ProgressReporter progressReporter)
        {
            return new TemperReader(this, progressReporter);
        }

        public required string DetailsUrlTemplate { get; init; }
        public required string PropertiesScript { get; init; }
        public required string ValuesScript { get; init; }
    }
}
