using Importer.Model;
using Importer.Puppeteer;
using Importer.Report;
using PuppeteerSharp;

namespace Importer.Processor
{
    internal class ResourceReader<T> where T : Item
    {
        private readonly ResourceSource<T> _source;
        protected readonly ProgressReporter ProgressReporter;

        public ResourceReader(ResourceSource<T> source, ProgressReporter progressReporter)
        {
            _source = source;
            ProgressReporter = progressReporter;
        }

        public virtual async Task<List<T>> ReadAsync(PuppeteerBrowser browser)
        {
            ProgressReporter.UpdateMessage("Wait...");

            using (var page = await browser.NewPageAsync())
            {
                ProgressReporter.IncrementMaxValue(_source.SourceInfos.Count);

                var items = new List<T>();
                foreach (var sourceInfo in _source.SourceInfos)
                    items.AddRange(await ReadAsync(page, sourceInfo));

                return items;
            }
        }

        private async Task<IEnumerable<T>> ReadAsync(IPage page, SourceInfo sourceInfo)
        {
            ProgressReporter.ReportNext("Read Source");

            await page.GoToAsync(sourceInfo.Url, waitUntil: WaitUntilNavigation.DOMContentLoaded);
            var items = await page.EvaluateFunctionAsync<List<T>>(sourceInfo.Script);
            return items;
        }
    }
}
