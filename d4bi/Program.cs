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
            await ExecuteAsync(appConfig, browser, reportManager);
        }

        private static async Task ExecuteAsync(AppConfig appConfig, PuppeteerBrowser browser, ReportManager reportManager)
        {
            var filter = Array.Empty<string>();
            //var filter = new[] {
            //    "aspect en", "glyph en", "leg_node en", "rune en", "unq_item en", "elixir en",
            //    "aspect ru", "glyph ru", "leg_node ru", "rune ru", "unq_item ru", "elixir ru" };
            //var filter = new[] { "skill en" };
            //var filter = new[] { "temper en" };
            //var filter = new[] { "skill ru" };
            //var filter = new[] { "temper ru" };

            var runner = new ProcessorRunner(browser, appConfig.MaxProcessorCount);

            var tasks = Enumerable.Empty<Task>();
            foreach (var resourceCollection in Resources.GetResources())
            {
                var resourceTasks = resourceCollection.Infos.Where(x => !filter.Any() || filter.Contains(x.Name))
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
