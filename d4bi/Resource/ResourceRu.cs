using Importer.Checker;
using Importer.Custom.Glyph;
using Importer.Custom.Rune;
using Importer.Custom.Skill;
using Importer.Custom.Temper;
using Importer.Custom.Temper.Ru;
using Importer.Custom.UnqItem;
using Importer.Fixer;
using Importer.Model;

namespace Importer.Resource
{
    internal static class ResourceRu
    {
        public static ResourceCollection GetResources()
        {
            return new ResourceCollection
            {
                Folder = "ru",
                Infos =
                    [
                        new ResourceInfo<ClassItem>
                        {
                            Name = "aspect ru",
                            Source = new ResourceSource<ClassItem>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/aspects",
                                        Script = "() => g_listviews.aspects.data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ').filter(c => c !== 'Все')}))",
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
                            Name = "glyph ru",
                            Source = new ResourceSource<ClassItem>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/paragon-glyphs",
                                        Script = "() => g_listviews['paragon-glyphs'].data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ')}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<ClassItem>
                            {
                                Fixers =
                                [
                                    new GlyphFilter(true),
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
                            Name = "leg_node ru",
                            Source = new ResourceSource<ClassItem>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/paragon-nodes/quality:4",
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
                            Name = "rune ru",
                            Source = new ResourceSource<Item>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/type:446841",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/type:446842",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<Item>
                            {
                                Fixers =
                                [
                                    new RuneFilter(true),
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
                            Name = "skill ru",
                            Source = new SkillSource
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/skills",
                                        Script = "() => g_listviews.skills.data.map(i => ({id: i.id, name: i.name, isActive: i.active, classes: [i.playerClassName]}))",
                                    },
                                ],
                                DetailsUrlTemplate = "https://www.wowhead.com/diablo-4/ru/skill/[id]",
                                ModNamesScript = "() => [...document.querySelectorAll('div.wowhead-tooltip[data-type=\"d4-skill\"][data-mod] div.whtt-name')].map(e => e.innerText)",
                            },
                            Fix = new ResourceFix<SkillItem>
                            {
                                Fixers =
                                [
                                    new SkillFilter(true),
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
                            Name = "temper ru",
                            Source = new TemperSource
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/temper-manual/quality:5",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames}))",
                                    },
                                ],
                                DetailsUrlTemplate = "https://www.wowhead.com/diablo-4/ru/item/[id]",
                                PropertiesScript = "() => [...document.querySelectorAll('#infobox-contents-0 div')].map(e => e.innerText)",
                                DetailsScript = "() => [...document.querySelectorAll('div.whtt-damage-details li[data-type=\"empty-bullet\"]')].map(e => e.innerText)",
                            },
                            Fix = new ResourceFix<TemperItem>
                            {
                                Fixers =
                                [
                                    new TemperFilter(true),
                                    new FixRemoveEmptyName<TemperItem>(),
                                    new FixRemoveEmptyClass<TemperItem>(),
                                    new FixName<TemperItem>(),
                                    new TemperFixData(),
                                    new TemperRuFillType(),
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
                            Name = "unq_item ru",
                            Source = new ResourceSource<Item>
                            {
                                SourceInfos =
                                [
                                    new SourceInfo
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/quality:8:6",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new ResourceFix<Item>
                            {
                                Fixers =
                                [
                                    new UnqItemFilter(true),
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
