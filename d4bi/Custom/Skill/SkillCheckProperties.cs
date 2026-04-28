using Importer.Checker;
using Importer.Report;

namespace Importer.Custom.Skill
{
    internal class SkillCheckProperties : IItemsChecker<SkillItem>
    {
        public void CheckItems(IReadOnlyList<SkillItem> items, IMessageReporter reporter)
        {
            foreach (var item in items)
            {
                if (string.IsNullOrEmpty(item.Name) ||
                    (!item.IsActive && item.Mods.Any()) ||
                    (item.IsActive && (!item.Mods.Any() || item.Mods.Any(v => string.IsNullOrEmpty(v.Name) || v.Name.Contains('\n')))))
                    reporter.WriteMessage($"Id: {item.Id} - invalid", nameof(SkillCheckProperties));
            }
        }
    }
}
