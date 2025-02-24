using Importer.Logger;
using Importer.Model;
using Importer.Puppeteer;

namespace Importer.Processor
{
    internal interface IResourceProcessor
    {
        Task ProcessAsync(PuppeteerBrowser browser);
    }

    internal class ResourceProcessor<T> : IResourceProcessor where T : Item
    {
        private readonly ResourceInfo<T> _info;
        private readonly ILogger _logger;

        public ResourceProcessor(ResourceInfo<T> info, ILogger logger)
        {
            _info = info;
            _logger = logger;
        }

        public async Task ProcessAsync(PuppeteerBrowser browser)
        {
            var reader = CreateReader(_info.Source);
            var fixer = CreateFixer(_info.Fix);
            var writer = CreateWriter(_info.Target);

            var items = await reader.ReadAsync(browser);

            if (fixer != null)
                await fixer.FixItemsAsync(items);

            await writer.WriteAsync(items.OrderBy(i => i.Id));

            _logger.WriteMessage(_info.Name);
        }

        public ResourceReader<T> CreateReader(ResourceSource<T> source)
        {
            return new ResourceReader<T>(source);
        }

        private ResourceFixer<T>? CreateFixer(ResourceFix<T>? fix)
        {
            if (fix == null)
                return null;

            return new ResourceFixer<T>(fix);
        }

        public ResourceWriter<T> CreateWriter(ResourceTarget<T> target)
        {
            return new ResourceWriter<T>(target, Static.WorkFolder);
        }
    }
}
