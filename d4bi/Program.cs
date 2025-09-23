using Importer.Model;
using Importer.Processor;
using Importer.Puppeteer;
using Importer.Report;

namespace Importer
{
    internal class Program
    {
        private static async Task Main()
        {
            var appConfig = await AppConfig.LoadAsync();

            await ExecuteAsync(appConfig);
        }

        private static async Task ExecuteAsync(AppConfig appConfig)
        {
            using var browser = await PuppeteerBrowser.RunAsync(appConfig.MaxBrowserPageCount, appConfig.BrowserRequestTimeout);
            using var reportManager = new ReportManager();

            var runner = new ProcessorRunner(browser, appConfig.MaxProcessorCount);

            var tasks = Enumerable.Empty<Task>();
            foreach (var resourceCollection in Resources.GetResources())
            {
                var resourceTasks = resourceCollection.Infos
                    .Select(i => ExecuteAsync(i, resourceCollection.Folder, runner, appConfig, reportManager));

                tasks = tasks.Union(resourceTasks);
            }

            await Task.WhenAll(tasks);
        }

        private static async Task ExecuteAsync(IResourceInfo info, string folder, ProcessorRunner runner, AppConfig appConfig, ReportManager reportManager)
        {
            var resourceWorkFolderPath = Path.Combine(appConfig.WorkFolder, folder);
            var processor = info.CreateProcessor(resourceWorkFolderPath, reportManager);
            await runner.ExecuteAsync(processor);
        }
    }
}
