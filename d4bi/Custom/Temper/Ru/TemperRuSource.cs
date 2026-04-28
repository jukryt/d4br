using Importer.Processor;
using Importer.Report;

namespace Importer.Custom.Temper.Ru
{
    internal class TemperRuSource : TemperSource
    {
        public override ResourceReader<TemperItem> CreateReader(ProgressReporter progressReporter)
        {
            return new TemperRuReader(this, progressReporter);
        }
    }
}
