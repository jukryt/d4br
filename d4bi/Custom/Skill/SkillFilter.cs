using Importer.Fixer;
using Importer.Report;

namespace Importer.Custom.Skill
{
    internal class SkillFilter : IItemsFixer<SkillItem>
    {
        private static readonly IReadOnlyDictionary<long, string> IgnoreItems = new Dictionary<long, string>()
        {
            [1196884] = "Attack",
            [1201192] = "Attack",
            [1201846] = "Attack",
            [1204385] = "Attack",
            [1205333] = "Attack",
            [1294159] = "Provoke",
            [1389926] = "Bastion",
            [1401573] = "Shield Charge",
            [1404603] = "Ground Slam",
            [1408295] = "Whirlwind",
            [1439338] = "Bloodthirst",
            [1450903] = "Crater",
            [1452355] = "Shield Throw",
            [1475284] = "Cleave",
            [1475286] = "Shockwave",
            [1475288] = "Earth Breaker",
            [1493968] = "Chain of Souls",
            [1494843] = "Storm of Fire",
            [1521907] = "Haunt",
            [1522203] = "Field of Languish",
            [1525668] = "Flame Surge",
            [1525670] = "Wave of Flame",
            [1580735] = "Wire Trap",
            [1580738] = "Cover Fire",
            [1580744] = "Trip Mines",
            [1580746] = "Molotov",
            [1580748] = "Snipe",
            [1580751] = "Explosive Charge",
            [1619032] = "Attack",
            [1619677] = "Ancient Harpoons",
            [2236714] = "Attack",
            [2343774] = "Attack",
            [2424438] = "Command Abodian",
            [2456540] = "Command Ae'grom",
            [2469892] = "Command Valloch",
            [2471034] = "Command Laalish",
        };

        private readonly bool _ignoreName;

        public SkillFilter(bool ignoreName)
        {
            _ignoreName = ignoreName;
        }

        public Task FixItemsAsync(List<SkillItem> items, IMessageReporter reporter)
        {
            RemoveIgnoreItems(items, reporter);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<SkillItem> items, IMessageReporter reporter)
        {
            var ignoreItems = new HashSet<long>();

            foreach (var item in items.ToList())
            {
                if (IgnoreItems.TryGetValue(item.Id, out var name) &&
                    (_ignoreName || name.Equals(item.Name)))
                {
                    items.Remove(item);
                    ignoreItems.Add(item.Id);
                }
            }

            if (IgnoreItems.Count != ignoreItems.Count)
            {
                var exceptItems = IgnoreItems.Keys.Except(ignoreItems);
                var exceptItemsString = string.Join(", ", exceptItems);
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(SkillFilter));
            }
        }
    }
}
