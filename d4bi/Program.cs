using Importer.Model;
using Importer.Puppeteer;
using Importer.Report;

namespace Importer
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            var appConfig = await AppConfig.LoadAsync();

            using (var reportManager = new ReportManager())
                await ExecuteAsync(appConfig, reportManager);
        }

        private static async Task ExecuteAsync(AppConfig appConfig, ReportManager reportManager)
        {
            using var browser = await PuppeteerBrowser.RunAsync(maxPageCount: 5, requestTimeout: appConfig.BrowserRequestTimeout);

            var resources = Resources.GetResources()
                .SelectMany(c => c.Infos.Select(i => new Resource(i, c.Folder)));

            var tasks = resources.Select(r => ExecuteAsync(r, browser, appConfig, reportManager));
            await Task.WhenAll(tasks);
        }

        private static async Task ExecuteAsync(Resource resource, PuppeteerBrowser browser, AppConfig appConfig, ReportManager reportManager)
        {
            var resourceWorkFolderPath = Path.Combine(appConfig.WorkFolder, resource.Folder);
            var processor = resource.Info.CreateProcessor(resourceWorkFolderPath, reportManager);
            await processor.ProcessAsync(browser);
        }

        private sealed class Resource
        {
            public Resource(IResourceInfo info, string folder)
            {
                Info = info;
                Folder = folder;
            }

            public IResourceInfo Info { get; }
            public string Folder { get; }
        }
    }
}
