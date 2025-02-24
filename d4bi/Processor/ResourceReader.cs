using Importer.Model;
using Importer.Puppeteer;
using PuppeteerSharp;

namespace Importer.Processor
{
    internal class ResourceReader<T> where T : Item
    {
        private readonly ResourceSource<T> _source;

        public ResourceReader(ResourceSource<T> source)
        {
            _source = source;
        }

        public async Task<List<T>> ReadAsync(PuppeteerBrowser browser)
        {
            using (var page = await browser.NewPageAsync())
            {
                var items = new List<T>();
                foreach (var sourceInfo in _source.SourceInfos)
                    items.AddRange(await ReadAsync(page, sourceInfo));

                return items;
            }
        }

        private async Task<IEnumerable<T>> ReadAsync(IPage page, SourceInfo sourceInfo)
        {
            await page.GoToAsync(sourceInfo.Url, waitUntil: WaitUntilNavigation.DOMContentLoaded);
            var items =  await page.EvaluateFunctionAsync<List<T>>(sourceInfo.Script);
            return items;
        }
    }
}
