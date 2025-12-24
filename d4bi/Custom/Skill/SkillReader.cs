using Importer.Processor;
using Importer.Puppeteer;
using Importer.Report;
using PuppeteerSharp;

namespace Importer.Custom.Skill
{
    internal class SkillReader : ResourceReader<SkillItem>
    {
        private readonly SkillSource _source;

        public SkillReader(SkillSource source, ProgressReporter progressReporter) : base(source, progressReporter)
        {
            _source = source;
        }

        public override async Task<List<SkillItem>> ReadAsync(PuppeteerBrowser browser)
        {
            var items = await base.ReadAsync(browser);
            var activeSkills = items.Where(i => i.IsActive).ToList();

            ProgressReporter.IncrementMaxValue(activeSkills.Count);
            ProgressReporter.UpdateMessage("Wait...");

            await FillSkillsAsync(activeSkills, browser);
            return items;
        }

        private async Task FillSkillsAsync(IReadOnlyCollection<SkillItem> items, PuppeteerBrowser browser)
        {
            var tasks = items.Select(i => FillSkillAsync(i, browser));
            await Task.WhenAll(tasks);
        }

        private async Task FillSkillAsync(SkillItem item, PuppeteerBrowser browser)
        {
            using (var page = await browser.NewPageAsync())
            {
                ProgressReporter.ReportNext($"Read '{item.Name}'");

                var skillUrl = _source.DetailsUrlTemplate.Replace("[id]", item.Id.ToString());
                await page.GoToAsync(skillUrl, waitUntil: WaitUntilNavigation.DOMContentLoaded);

                var modNames = await page.EvaluateFunctionAsync<List<string>>(_source.ModNamesScript);
                item.Mods = modNames
                    .Where(n => !string.IsNullOrEmpty(n))
                    .Select((n, i) => new SkillMod(i + 1, n))
                    .ToList();
            }
        }
    }
}
