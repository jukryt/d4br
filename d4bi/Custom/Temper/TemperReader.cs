﻿using Importer.Extension;
using Importer.Processor;
using Importer.Puppeteer;
using PuppeteerSharp;
using System.Text.RegularExpressions;

namespace Importer.Custom.Temper
{
    internal class TemperReader : ResourceReader<TemperItem>
    {
        private readonly TemperSource _source;

        public TemperReader(TemperSource source) : base(source)
        {
            _source = source;
        }

        public override async Task<List<TemperItem>> ReadAsync(PuppeteerBrowser browser)
        {
            var items = await base.ReadAsync(browser);
            await FillTemperItems(items, browser);
            return items;
        }

        private async Task FillTemperItems(IEnumerable<TemperItem> items, PuppeteerBrowser browser)
        {
            var semaphore = new SemaphoreSlim(3, 3);

            var tasks = new List<Task>();
            foreach (var item in items)
                tasks.Add(FillTemperItem(item, browser, semaphore));

            await Task.WhenAll(tasks);
        }

        private async Task FillTemperItem(TemperItem item, PuppeteerBrowser browser, SemaphoreSlim semaphore)
        {
            using (await semaphore.WaitAndReleaseAsync())
            {
                using (var temperPage = await browser.NewPageAsync())
                {
                    var temperUrl = _source.DetailsUrlTemplate.Replace("[id]", item.Id.ToString());
                    await temperPage.GoToAsync(temperUrl, waitUntil: WaitUntilNavigation.DOMContentLoaded);

                    await FillPropertes(item, temperPage);
                    await FillValuesAsync(item, temperPage);
                }
            }
        }

        private async Task FillPropertes(TemperItem item, IPage page)
        {
            var propertyes = await page.EvaluateFunctionAsync<List<string>>(_source.PropertesScript);

            var internalName = propertyes.FirstOrDefault(p => p.Contains(".itm"));
            item.Type = _source.InternalNameParser.GetTemperType(internalName);
        }

        private async Task FillValuesAsync(TemperItem item, IPage page)
        {
            var values = await page.EvaluateFunctionAsync<List<string>>(_source.ValuesScript);

            item.Values = values.Select(v =>
            {
                return Regex.Replace(v, @"\+? ?\[[^\]]+\]%?", "XXX")
                        .Replace("+", "\\+")
                        .Replace("-", "\\-")
                        .Replace(".", "\\.")
                        .Replace("*", "\\*")
                        .Replace(":", "\\:")
                        .Replace("(", "\\(")
                        .Replace(")", "\\)")
                        .Replace(" X ", " XXX ")
                        .Replace("XXX", @" ?\+? ?[X0-9\.,\-% \[\]]+"); // for js regex
            }).ToList();
        }
    }
}
