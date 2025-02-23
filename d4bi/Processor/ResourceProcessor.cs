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
            var reader = _info.Source.CreateReader();
            var writer = _info.Target.CreateWriter();

            var items = await reader.ReadAsync(browser);
            await writer.WriteAsync(items.OrderBy(i => i.Id));
            _logger.WriteMessage(_info.Name);
        }
    }
}
