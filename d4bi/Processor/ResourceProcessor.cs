using Importer.Model;
using Importer.Puppeteer;
using Importer.Report;

namespace Importer.Processor
{
    internal interface IResourceProcessor
    {
        Task ProcessAsync(PuppeteerBrowser browser);
    }

    internal class ResourceProcessor<T> : IResourceProcessor where T : Item
    {
        private readonly ResourceInfo<T> _info;
        private readonly string _workFolder;
        private readonly ReportManager _reportManager;

        public ResourceProcessor(ResourceInfo<T> info, string workFolder, ReportManager reportManager)
        {
            _info = info;
            _workFolder = workFolder;
            _reportManager = reportManager;
        }

        public async Task ProcessAsync(PuppeteerBrowser browser)
        {
            using var progressReporter = _reportManager.CreateProgressReporter(_info.Name);
            var messageReporter = _reportManager.CreateMessageReporter();

            var reader = _info.Source.CreateReader(progressReporter);
            var fixer = _info.Fix?.CreateFixer(_info.Name, messageReporter);
            var checker = _info.Check?.CreateChecker(_info.Name, messageReporter);
            var writer = _info.Target.CreateWriter(_workFolder);

            var items = await reader.ReadAsync(browser);
            await (fixer?.FixItemsAsync(items) ?? Task.CompletedTask);
            checker?.CheckItems(items);
            await writer.WriteAsync(items.OrderBy(i => i.Id));

            progressReporter.Complete();
        }
    }
}
