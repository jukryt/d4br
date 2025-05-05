using Importer.Fixer;
using Importer.Model;
using Importer.Report;

namespace Importer.Custom.UnqItem
{
    internal class UnqItemFilter : IItemsFixer<Item>
    {
        private static readonly IReadOnlyDictionary<long, string> IgnoreItems = new Dictionary<long, string>()
        {
            [1952218] = "New Item [PH]",
            [2152974] = "Resplendent Coven Crate",
            [2120652] = "Heart of War",
            [2123366] = "[ph_Hope's Respite]",
            [498567] = "Boost Pants",
            [2235946] = "Greater Lair Cache",
            [2118062] = "Mythic Unique Cache",
            [2059808] = "[PH] Ichorous Salvation",
            [2043695] = "Shard of Verathiel / The Third Blade",
            [1905791] = "[PH]Godslayer Crown",
            [2235931] = "Resplendent Cache ",
            [1865358] = "Resplendent Spark",
            [2125049] = "Tribute of Ascendance (United)",
            [2090362] = "Tribute of Ascendance (Resolute)",
            [1858740] = "Yen's Blessing",

            // g_listviews.items.data.slice(170).map(i => `[${i.id}] = "${i.name}",`).join("\n")
            [1928911] = "Pants Unique Necro 98",
            [2043693] = "The Mortacrux / The Umbracrux",
            [1905117] = "[PH] Barb uniq 99 pants",
            [1910903] = "[PH] Unique 99 Gloves",
            [2120656] = "Guise of War",
            [2166775] = "Resplendent Coven Crate",
            [1719158] = "[WIP] Eye of the Depths",
            [1928896] = "Chest Unique Necro 98",
            [2120658] = "Strides of War",
            [498460] = "Boost Helm",
            [498557] = "Boost Scythe",
            [1928903] = "glove Unique Necro 98",
            [1928913] = "Boots Unique Necro 98",
            [2043706] = "Vox Omnium / The Basilisk",
            [2044978] = "Bucrani's Grip",
            [1041475] = "Boost Staff",
            [1963851] = "(PH) Template Unique",
            [498549] = "Boost Dagger",
            [1749652] = "Boots Unique Rogue 97",
            [1913227] = "Traces of the Maiden",
            [1913276] = "Traces of the Maiden",
            [2059805] = "PH Barb Boots",
            [2099578] = "Chest Unique Generic 125",
            [2120650] = "Harriers of War",
            [2120654] = "Fists of War",
            [2123356] = "[ph_Hope's Respite]",
            [2123360] = "[ph_Hope's Respite]",
            [2123362] = "[ph_Hope's Respite]",
            [2123368] = "[ph_Hope's Respite]",
            [2123439] = "[PH] Chest Unique Druid 98",
            [946976] = "Eternal Journey Chapter 3 Cache",
            [2152972] = "Unique Coven Crate",
            [1638633] = "[PH] Thorn Pulse",
            [2235944] = "Lair Cache",
            [1894213] = "Highest Honors of the Iron Wolves",
            [2132211] = "Doom Orb",
            [1717304] = "Bloodforged Sigil",
            [2108306] = "PTR Cache - Mythic Uniques",
            [2190690] = "[PH] Pants Unique Druid 97",
            [1723622] = "Tuning Stone: Evernight",
            [1827378] = " Hateshard Core",
            [2132228] = "The Cycle",
            [1723635] = "Tuning Stone: Genesis",
            [946245] = "Eternal Journey Chapter 2 Cache",
            [1894225] = "Highest Honors of the Iron Wolves",
            [1961692] = "Greater Triune Arms Cache",
            [1963756] = "Champion's Equipment Cache",
            [2123442] = "[PH] Gloves Unique Druid 98",
            [2164973] = "Unique Coven Crate",
            [2173056] = "Mythic Treasure Bag",
            [2173075] = "Treasure Bag of Ascendance",
            [2174880] = "Greater Midwinter Purse ",
            [504685] = "Something Super Cool",
            [622324] = "Icy Rib",
            [625960] = "Rusty Heirloom Dagger",
            [946986] = "Eternal Journey Chapter 6 Cache",
            [946990] = "Eternal Journey Chapter 8 Cache",
            [946992] = "Eternal Journey Chapter 9 Cache",
            [1028192] = "Chapter 1 Reward Cache",
            [1821169] = "[PH] Blue Glaive",
            [1829684] = "Cleansing Prayer",
            [1870166] = "Skatsimi Tome",
            [1871286] = "[PH] Chest Key",
            [1873020] = "[PH] BSK Upgrade",
            [1936802] = "[PH]",
            [1945835] = "Destroyer's Equipment Cache",
            [2108304] = "PTR Cache - Class Uniques",
            [2123447] = "[PH] Boots Unique Druid 98",
            [2123449] = "[PH] Pants Unique Druid 98",
            [2179938] = "[PH]",
            [2185048] = "[PH]",
            [1040946] = "Chapter 2 Reward Cache",
            [1821197] = "Snake Glaive",
            [2120722] = "[PH]",
            [2190692] = "[PH]",
            [1895398] = "Glimmering Herb Supply",
            [1895545] = "Iron Wolves' Heroic Spoils",
            [1895652] = "Iron Wolves' Heroic Spoils",
            [1895757] = "Cages of Hubris",
            [1905115] = "[PH] Unique Barb Gloves 99",
            [1945833] = "Champion's Equipment Cache",
            [1960166] = "Triune Strongbox of Endurant Faith",
            [2108291] = "PTR Cache - Generic Uniques",
            [2123445] = "[PH] Helm Unique Druid 98",
            [2164894] = "Greater Gift from the Ancestors",
            [2166772] = "Unique Coven Crate",
            [2185044] = "[PH]",
            [2190685] = "[PH]",
            [946982] = "Eternal Journey Chapter 4 Cache",
            [946984] = "Eternal Journey Chapter 5 Cache",
            [946988] = "Eternal Journey Chapter 7 Cache",
            [1636423] = "[PH] Distance Crit",
            [1859723] = "Iron Horn",
            [1895747] = "Glimmering Herb Supply",
            [1895761] = "Cages of Hubris",
            [1895831] = "Iron Wolves' Final Harvest",
            [1895838] = "Iron Wolves' Final Harvest",
            [1928915] = "[PH] Unique Necro 98",
            [1941215] = "[PH] Unique Helm 95",
            [1948065] = "[PH] Grab Bag Variant Helm1",
            [1948096] = "[PH] Unique Sorc Helm 99",
            [1955503] = "[PH] ",
            [1963748] = "Slayer's Equipment Cache",
            [1963764] = "Destroyer's Equipment Cache",
            [2088150] = "Destroyer's Equipment Cache",
            [2103028] = "Severed Hand of the Zakarum",
            [2106123] = "Severed Hand of the Zakarum",
            [2128605] = "Piranhado",
            [2132230] = "Vengeful Spirit",
            [2179153] = "Fedric's Masterpiece",
            [2179958] = "[PH]",
            [2185046] = "[PH]",
            [2190688] = "[PH]",
            [2224834] = "Fedric's Gift",
            [1756426] = "[PH]",
            [1945830] = "Slayer's Equipment Cache",
            [2088133] = "Slayer's Equipment Cache",
            [2088142] = "Champion's Equipment Cache",
            [2088144] = "Destroyer's Cache",
            [2120724] = "[PH]",
            [2120727] = "[PH]",
            [2120729] = "[PH]",
            [2120731] = "[PH]",
            [2122764] = "[PH] The Chandler",
            [2122767] = "[PH] The Chandler",
            [2122769] = "[PH] The Chandler",
            [2122773] = "[PH] The Chandler",
            [2122775] = "[PH] The Chandler",
            [2125596] = "Destroyer's Equipment Cache",
            [2125631] = "Slayer's Equipment Cache",
            [2125639] = "Champion's Equipment Cache",
            [2125641] = "Destroyer's Cache",
            [2162475] = "Unique Coven Crate",
            [2166765] = "Unique Coven Crate",
            [2179930] = "[PH]",
            [2179934] = "[PH]",
            [2179936] = "[PH]",
            [2185042] = "[PH]",
            [2185050] = "[PH]",
            [2196161] = "Greater Gift from the Ancestors",
        };

        private readonly bool _ignoreName;

        public UnqItemFilter(bool ignoreName)
        {
            _ignoreName = ignoreName;
        }

        public Task FixItemsAsync(List<Item> items, IMessageReporter reporter)
        {
            RemoveIgnoreItems(items, reporter);

            return Task.CompletedTask;
        }

        private void RemoveIgnoreItems(List<Item> items, IMessageReporter reporter)
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
                reporter.WriteMessage($"{nameof(RemoveIgnoreItems)} not match ({exceptItemsString})", nameof(UnqItemFilter));
            }
        }
    }
}
