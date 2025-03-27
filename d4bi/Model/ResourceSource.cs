using Importer.Processor;
using Importer.Report;

namespace Importer.Model
{
    internal class ResourceSource<T> where T : Item
    {
        public required List<SourceInfo> SourceInfos { get; init; }

        public virtual ResourceReader<T> CreateReader(ProgressReporter progressReporter)
        {
            return new ResourceReader<T>(this, progressReporter);
        }
    }

    internal class SourceInfo
    {
        public required string Url { get; init; }
        public required string Script { get; init; }
    }
}
