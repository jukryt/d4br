using Importer.Extension;
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

            var cancellationTokenSource = new CancellationTokenSource();
            await ExecuteAsync(Static.Logger, cancellationTokenSource.Token);
        }

        private static async Task ExecuteAsync(ILogger logger, CancellationToken cancellationToken)
        {
            using var browser = new PuppeteerBrowser();
            await browser.RunAsync(cancellationToken);

            var semaphore = new SemaphoreSlim(5, 5);

            logger.WriteMessage("Begin");

            var resources = Resources.GetResources()
                .SelectMany(c => c.Infos.Select(i => new Resource(i, c.Folder)));

            var tasks = new List<Task>();
            foreach (var resource in resources)
                tasks.Add(ExecuteAsync(resource, browser, semaphore, logger, cancellationToken));

            await Task.WhenAll(tasks);
            logger.WriteMessage("Complete");
        }

        private static async Task ExecuteAsync(Resource resource, PuppeteerBrowser browser, SemaphoreSlim semaphore, ILogger logger, CancellationToken cancellationToken)
        {
            using (await semaphore.WaitAndReleaseAsync(cancellationToken))
            {
                var processor = resource.Info.CreateProcessor(resource.Folder, logger);
                await processor.ProcessAsync(browser);
            }
        }

        private static void UnhandledExceptionTrapper(object sender, UnhandledExceptionEventArgs args)
        {
            var source = $"{nameof(Program)}.{nameof(UnhandledExceptionTrapper)}";
            var exception = (Exception)args.ExceptionObject;
            Static.Logger.WriteException(exception, source);
        }

        public sealed class Resource
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
