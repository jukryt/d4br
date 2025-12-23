using Importer.Checker;
using Importer.Custom.Glyph;
using Importer.Custom.Rune;
using Importer.Custom.Skill;
using Importer.Custom.Temper;
using Importer.Custom.Temper.En;
using Importer.Custom.UnqItem;
using Importer.Fixer;
using Importer.Model;

namespace Importer.Resource
{
    internal static class ResourceEn
    {
        public static ResourceCollection GetResources()
        {
            return new ResourceCollection
            {
                Folder = "en",
                Infos =
                    [
                        new ResourceInfo<ClassItem>
                        {
                            Name = "aspect en",
                            Source = new ResourceSource<ClassItem>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/aspects",
                                        Script = "() => g_listviews.aspects.data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ').filter(c => c !== 'All')}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<ClassItem>
                            {
                                Fixers =
                                [
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                    new FixName<ClassItem>(),
                                ],
                            },
                            Check = new ResourceCheck<ClassItem>
                            {
                                Checkers =
                                [
                                    new CheckUnique<ClassItem>
                                    {
                                        Comparer = new ClassItemEqualComparer<ClassItem>(),
                                    },
                                ],
                            },
                            Target = new ResourceTarget<ClassItem>
                            {
                                FileName = "aspect.json",
                            },
                        },
                        new ResourceInfo<ClassItem>
                        {
                            Name = "glyph en",
                            Source = new ResourceSource<ClassItem>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/paragon-glyphs",
                                        Script = "() => g_listviews['paragon-glyphs'].data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ')}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<ClassItem>
                            {
                                Fixers =
                                [
                                    new GlyphFilter(false),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                    new FixName<ClassItem>(),
                                ],
                            },
                            Target = new ResourceTarget<ClassItem>
                            {
                                FileName = "glyph.json",
                            },
                        },
                        new ResourceInfo<ClassItem>
                        {
                            Name = "leg_node en",
                            Source = new ResourceSource<ClassItem>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/paragon-nodes/quality:4",
                                        Script = "() => g_listviews['paragon-nodes'].data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ')}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<ClassItem>
                            {
                                Fixers =
                                [
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                    new FixName<ClassItem>(),
                                ],
                            },
                            Check = new ResourceCheck<ClassItem>
                            {
                                Checkers =
                                [
                                    new CheckUnique<ClassItem>
                                    {
                                        Comparer = new ClassItemEqualComparer<ClassItem>(),
                                    },
                                ],
                            },
                            Target = new ResourceTarget<ClassItem>
                            {
                                FileName = "leg_node.json",
                            },
                        },
                        new ResourceInfo<Item>
                        {
                            Name = "rune en",
                            Source = new ResourceSource<Item>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/type:446841",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/type:446842",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<Item>
                            {
                                Fixers =
                                [
                                    new RuneFilter(false),
                                    new FixRemoveEmptyName<Item>(),
                                    new FixName<Item>(),
                                ],
                            },
                            Check = new ResourceCheck<Item>
                            {
                                Checkers =
                                [
                                    new CheckUnique<Item>
                                    {
                                        Comparer = new ItemEqualComparer<Item>(),
                                    },
                                ],
                            },
                            Target = new ResourceTarget<Item>
                            {
                                FileName = "rune.json",
                            },
                        },
                        new ResourceInfo<SkillItem>
                        {
                            Name = "skill en",
                            Source = new SkillSource
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/skills",
                                        Script = "() => g_listviews.skills.data.map(i => ({id: i.id, name: i.name, isActive: i.active, classes: [i.playerClassName]}))",
                                    },
                                ],
                                DetailsUrlTemplate = "https://www.wowhead.com/diablo-4/skill/[id]",
                                ModNamesScript = "() => [...document.querySelectorAll('div.wowhead-tooltip[data-type=\"d4-skill\"][data-mod] div.whtt-name')].map(e => e.innerText)",
                            },
                            Fix = new ResourceFix<SkillItem>
                            {
                                Fixers =
                                [
                                    new SkillFilter(false),
                                    new FixRemoveEmptyName<SkillItem>(),
                                    new FixRemoveEmptyClass<SkillItem>(),
                                    new FixName<SkillItem>(),
                                    new FixSkillModsName(),
                                ],
                            },
                            Check = new ResourceCheck<SkillItem>
                            {
                                Checkers =
                                [
                                    new CheckUnique<SkillItem>
                                    {
                                        Comparer = new ClassItemEqualComparer<SkillItem>(),
                                    },
                                    new SkillCheckProperties(),
                                ],
                            },
                            Target = new ResourceTarget<SkillItem>
                            {
                                FileName = "skill.json",
                            },
                        },
                        new ResourceInfo<TemperItem>
                        {
                            Name = "temper en",
                            Source = new TemperSource()
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/temper-manual/quality:5",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames}))",
                                    },
                                ],
                                DetailsUrlTemplate = "https://www.wowhead.com/diablo-4/item/[id]",
                                PropertiesScript = "() => [...document.querySelectorAll('#infobox-contents-0 div')].map(e => e.innerText)",
                                DetailsScript = "() => [...document.querySelectorAll('div.whtt-damage-details li[data-type=\"empty-bullet\"]')].map(e => e.innerText)",
                            },
                            Fix = new ResourceFix<TemperItem>
                            {
                                Fixers =
                                [
                                    new TemperFilter(false),
                                    new FixRemoveEmptyName<TemperItem>(),
                                    new FixRemoveEmptyClass<TemperItem>(),
                                    new FixName<TemperItem>(),
                                    new TemperFixData(),
                                    new TemperEnFixData(),
                                    new TemperEnFillType(),
                                ],
                            },
                            Check = new ResourceCheck<TemperItem>
                            {
                                Checkers =
                                [
                                    new CheckUnique<TemperItem>
                                    {
                                        Comparer = new ClassItemEqualComparer<TemperItem>(),
                                    },
                                    new TemperCheckProperties(),
                                ],
                            },
                            Target = new ResourceTarget<TemperItem>
                            {
                                FileName = "temper.json",
                            },
                        },
                        new ResourceInfo<Item>
                        {
                            Name = "unq_item en",
                            Source = new ResourceSource<Item>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/quality:8:6",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<Item>
                            {
                                Fixers =
                                [
                                    new UnqItemFilter(false),
                                    new UniqueNameFilter<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                    new FixName<Item>(),
                                ],
                            },
                            Check = new ResourceCheck<Item>
                            {
                                Checkers =
                                [
                                    new CheckUnique<Item>
                                    {
                                        Comparer = new ItemEqualComparer<Item>(),
                                    },
                                ],
                            },
                            Target = new ResourceTarget<Item>
                            {
                                FileName = "unq_item.json",
                            },
                        },
                    ],
            };
        }
    }
}
