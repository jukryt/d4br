using Importer.Processor;
using Importer.Report;

namespace Importer.Model
{
    internal interface IResourceInfo
    {
        string Name { get; }

        IResourceProcessor CreateProcessor(string workFolder, ReportManager reportManager);
    }

    internal class ResourceInfo<T> : IResourceInfo where T : Item
    {
        public required string Name { get; init; }
        public required ResourceSource<T> Source { get; init; }
        public ResourceFix<T>? Fix { get; init; }
        public ResourceCheck<T>? Check { get; init; }
        public required ResourceTarget<T> Target { get; init; }

        public virtual IResourceProcessor CreateProcessor(string workFolder, ReportManager reportManager)
        {
            return new ResourceProcessor<T>(this, workFolder, reportManager);
        }
    }
}
