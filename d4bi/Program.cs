using Importer.Logger;
using Importer.Model;
using Importer.Puppeteer;

namespace Importer
{
    internal class Program
    {
        static async Task Main(string[] args)
        {
            var appConfig = await AppConfig.LoadAsync();
            Static.Init(appConfig);
            AppDomain.CurrentDomain.UnhandledException += UnhandledExceptionTrapper;

            await ExecuteAsync(Static.Logger);
        }

        private static async Task ExecuteAsync(ILogger logger)
        {
            using var browser = await PuppeteerBrowser.RunAsync(maxPageCount: 5);

            logger.WriteMessage("Begin");

            var resources = Resources.GetResources()
                .SelectMany(c => c.Infos.Select(i => new Resource(i, c.Folder)));

            var tasks = resources.Select(r => ExecuteAsync(r, browser, logger));
            await Task.WhenAll(tasks);

            logger.WriteMessage("Complete");
        }

        private static async Task ExecuteAsync(Resource resource, PuppeteerBrowser browser, ILogger logger)
        {
            var processor = resource.Info.CreateProcessor(resource.Folder, logger);
            await processor.ProcessAsync(browser);
        }

        private static void UnhandledExceptionTrapper(object sender, UnhandledExceptionEventArgs args)
        {
            var source = $"{nameof(Program)}.{nameof(UnhandledExceptionTrapper)}";
            var exception = (Exception)args.ExceptionObject;
            Static.Logger.WriteException(exception, source);
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
