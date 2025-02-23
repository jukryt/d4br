﻿using Importer.Logger;
using Importer.Processor;

namespace Importer.Model
{
    internal interface IResourceInfo
    {
        IResourceProcessor CreateProcessor(ILogger logger);
    }

    internal class ResourceInfo<T> : IResourceInfo where T : Item
    {
        public required string Name { get; init; }
        public required ResourceSource<T> Source { get; init; }
        public required ResourceTarget<T> Target { get; init; }

        public IResourceProcessor CreateProcessor(ILogger logger)
        {
            return new ResourceProcessor<T>(this, logger);
        }
    }
}
