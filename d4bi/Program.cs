using Importer.Model;
using Importer.Puppeteer;
using Importer.Report;

namespace Importer
{
    internal class Program
    {
        private static readonly ReportManager ReportManager = ReportManager.Instance;

        static async Task Main(string[] args)
        {
            AppDomain.CurrentDomain.UnhandledException += UnhandledExceptionTrapper;

            var appConfig = await AppConfig.LoadAsync();
            await ExecuteAsync(appConfig);
        }

        private static async Task ExecuteAsync(AppConfig appConfig)
        {
            using var browser = await PuppeteerBrowser.RunAsync(maxPageCount: 5, requestTimeout: appConfig.BrowserRequestTimeout);

            var resources = Resources.GetResources()
                .SelectMany(c => c.Infos.Select(i => new Resource(i, c.Folder)));

            var tasks = resources.Select(r => ExecuteAsync(r, browser, appConfig));
            await Task.WhenAll(tasks);
        }

        private static async Task ExecuteAsync(Resource resource, PuppeteerBrowser browser, AppConfig appConfig)
        {
            var resourceWorkFolderPath = Path.Combine(appConfig.WorkFolder, resource.Folder);
            var processor = resource.Info.CreateProcessor(resourceWorkFolderPath, ReportManager);
            await processor.ProcessAsync(browser);
        }

        private static void UnhandledExceptionTrapper(object sender, UnhandledExceptionEventArgs args)
        {
            var source = $"{nameof(Program)}.{nameof(UnhandledExceptionTrapper)}";
            var exception = (Exception)args.ExceptionObject;
            ReportManager.CreateMessageReporter().WriteException(exception, source);
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
