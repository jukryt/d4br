using Importer.Processor;
using Importer.Report;

namespace Importer.Custom.Temper.En
{
    internal class TemperEnSource : TemperSource
    {
        public override ResourceReader<TemperItem> CreateReader(ProgressReporter progressReporter)
        {
            return new TemperEnReader(this, progressReporter);
        }
    }
}
