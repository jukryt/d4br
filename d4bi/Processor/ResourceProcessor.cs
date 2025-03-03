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
        private readonly string _folder;
        private readonly ILogger _logger;

        public ResourceProcessor(ResourceInfo<T> info, string folder, ILogger logger)
        {
            _info = info;
            _folder = folder;
            _logger = logger;
        }

        public async Task ProcessAsync(PuppeteerBrowser browser)
        {
            var workFolder = Path.Combine(Static.WorkFolder, _folder);

            var reader = _info.Source.CreateReader();
            var fixer = _info.Fix?.CreateFixer();
            var checker = _info.Check?.CreateChecker(_info.Name, _logger);
            var writer = _info.Target.CreateWriter(workFolder);

            var items = await reader.ReadAsync(browser);
            await (fixer?.FixItemsAsync(items) ?? Task.CompletedTask);
            checker?.CheckItems(items);
            await writer.WriteAsync(items.OrderBy(i => i.Id));

            _logger.WriteMessage($"{_info.Name}. Complete", nameof(ResourceProcessor<T>));
        }
    }
}
