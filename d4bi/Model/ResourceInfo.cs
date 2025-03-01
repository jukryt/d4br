using Importer.Logger;
using Importer.Processor;

namespace Importer.Model
{
    internal interface IResourceInfo
    {
        string Name { get; }
        IResourceProcessor CreateProcessor(string folder, ILogger logger);
    }

    internal class ResourceInfo<T> : IResourceInfo where T : Item
    {
        public required string Name { get; init; }
        public required ResourceSource<T> Source { get; init; }
        public ResourceFix<T>? Fix { get; init; }
        public required ResourceTarget<T> Target { get; init; }

        public virtual IResourceProcessor CreateProcessor(string folder, ILogger logger)
        {
            return new ResourceProcessor<T>(this, folder, logger);
        }
    }
}
