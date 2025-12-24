using Importer.Fixer;
using Importer.Report;

namespace Importer.Custom.Skill
{
    internal class FixSkillModsName : IItemsFixer<SkillItem>
    {
        public Task FixItemsAsync(List<SkillItem> items, IMessageReporter reporter)
        {
            foreach (var item in items)
            {
                foreach (var mod in item.Mods)
                {
                    mod.Name = mod.Name
                        ?.Replace('\u00A0', ' ') // non-breaking space
                        ?.Replace('\u2014', '-') // Em Dash
                        ?.Replace("  ", " ")     // double space
                        ?.Trim();
                }
            }

            return Task.CompletedTask;
        }
    }
}
