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
            var fixer = _info.Fix?.CreateFixer();
            var writer = _info.Target.CreateWriter(Static.WorkFolder);

            var items = await reader.ReadAsync(browser);
            await (fixer?.FixItemsAsync(items) ?? Task.CompletedTask);
            await writer.WriteAsync(items.OrderBy(i => i.Id));

            _logger.WriteMessage(_info.Name);
        }
    }
}
