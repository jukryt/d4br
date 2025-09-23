using Importer.Processor;
using Importer.Puppeteer;
using Importer.Report;
using PuppeteerSharp;
using System.Text.RegularExpressions;

namespace Importer.Custom.Temper
{
    internal class TemperReader : ResourceReader<TemperItem>
    {
        public const string ValueMacros = " X ";

        private readonly TemperSource _source;

        public TemperReader(TemperSource source, ProgressReporter progressReporter) : base(source, progressReporter)
        {
            _source = source;
        }

        public override async Task<List<TemperItem>> ReadAsync(PuppeteerBrowser browser)
        {
            var items = await base.ReadAsync(browser);

            ProgressReporter.IncrementMaxValue(items.Count);
            ProgressReporter.UpdateMessage("Wait...");

            await FillTemperItemsAsync(items, browser);
            return items;
        }

        private async Task FillTemperItemsAsync(IReadOnlyCollection<TemperItem> items, PuppeteerBrowser browser)
        {
            var tasks = items.Select(i => FillTemperItemAsync(i, browser));
            await Task.WhenAll(tasks);
        }

        private async Task FillTemperItemAsync(TemperItem item, PuppeteerBrowser browser)
        {
            using (var page = await browser.NewPageAsync())
            {
                ProgressReporter.ReportNext($"Read '{item.Name}'");

                var temperUrl = _source.DetailsUrlTemplate.Replace("[id]", item.Id.ToString());
                await page.GoToAsync(temperUrl, waitUntil: WaitUntilNavigation.DOMContentLoaded);

                var properties = await GetPropertiesAsync(page);
                item.InternalType = properties.Type;
                item.Details = properties.Details;
            }
        }

        private async Task<TemperProperties> GetPropertiesAsync(IPage page)
        {
            var propertyes = await page.EvaluateFunctionAsync<List<string>>(_source.PropertiesScript);
            var details = await GetDetalesAsync(page);

            var internalName = propertyes.FirstOrDefault(p => p.Contains(".itm"));
            var temperType = GetTemperType(internalName);

            return new TemperProperties
            {
                Type = temperType,
                Details = details,
            };
        }

        private async Task<List<TemperDetail>> GetDetalesAsync(IPage page)
        {
            var details = await page.EvaluateFunctionAsync<List<string>>(_source.DetailsScript);

            return details.Select((v, i) =>
            {
                var name = Regex.Replace(v, @" ?\+? ?\[[^\]]+\]%? ?", ValueMacros);
                return new TemperDetail(i + 1, name);
            }).ToList();
        }

        private TemperType GetTemperType(string? internalName)
        {
            if (string.IsNullOrEmpty(internalName))
                return TemperType.None;

            if (internalName.Contains("\u200BWeapon_"))
                return TemperType.Weapon;

            if (internalName.Contains("\u200BOffensive_"))
                return TemperType.Offensive;

            if (internalName.Contains("\u200BDefensive_"))
                return TemperType.Defensive;

            if (internalName.Contains("\u200BUtility_"))
                return TemperType.Utility;

            if (internalName.Contains("\u200BMobility_"))
                return TemperType.Mobility;

            if (internalName.Contains("\u200BResource_"))
                return TemperType.Resource;

            return TemperType.None;
        }

        private sealed class TemperProperties
        {
            public required TemperType Type { get; init; }
            public required List<TemperDetail> Details { get; init; }
        }
    }
}
