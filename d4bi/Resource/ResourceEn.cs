using Importer.Checker;
using Importer.Custom.Glyph;
using Importer.Custom.Rune;
using Importer.Custom.Skill;
using Importer.Custom.Temper;
using Importer.Custom.UnqItem;
using Importer.Fixer;
using Importer.Model;

namespace Importer.Resource
{
    internal static class ResourceEn
    {
        public static ResourceCollection GetResources()
        {
            return new()
            {
                Folder = "en",
                Infos =
                    [
                        new ResourceInfo<Item>
                        {
                            Name = "aspect en",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/aspects",
                                        Script = "() => g_listviews.aspects.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new FixRemoveEmptyName<Item>(),
                                    new FixName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckUnique<Item>()
                                    {
                                        Comparer = new ItemEqualComparer<Item>(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "aspect.json",
                            },
                        },
                        new ResourceInfo<ClassItem>
                        {
                            Name = "glyph en",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/paragon-glyphs",
                                        Script = "() => g_listviews['paragon-glyphs'].data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ')}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new GlyphFilter(false),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                    new FixName<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer<ClassItem>(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "glyph.json",
                            },
                        },
                        new ResourceInfo<ClassItem>
                        {
                            Name = "leg_node en",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/paragon-nodes/quality:4",
                                        Script = "() => g_listviews['paragon-nodes'].data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ')}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                    new FixName<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer<ClassItem>(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "leg_node.json",
                            },
                        },
                        new ResourceInfo<Item>
                        {
                            Name = "rune en",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/type:446841",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/type:446842",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new RuneFilter(false),
                                    new FixRemoveEmptyName<Item>(),
                                    new FixName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckUnique<Item>()
                                    {
                                        Comparer = new ItemEqualComparer<Item>(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "rune.json",
                            },
                        },
                        new ResourceInfo<ClassItem>
                        {
                            Name = "skill en",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/skills",
                                        Script = "() => g_listviews.skills.data.map(i => ({id: i.id, name: i.name, classes: [i.playerClassName]}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new SkillFilter(false),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                    new FixName<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer<ClassItem>(),
                                    },
                                ],
                            },
                            Target = new()
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
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/temper-manual/quality:5",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames}))",
                                    },
                                ],
                                DetailsUrlTemplate = "https://www.wowhead.com/diablo-4/item/[id]",
                                PropertiesScript = "() => [...document.querySelectorAll('#infobox-contents-0 div')].map(e => e.innerText)",
                                DetailsScript = "() => [...document.querySelectorAll('div.whtt-damage-details li[data-type=\"empty-bullet\"]')].map(e => e.innerText)",
                            },
                            Fix = new()
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
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckUnique<TemperItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer<TemperItem>(),
                                    },
                                    new TemperCheckProperties(),
                                ],
                            },
                            Target = new()
                            {
                                FileName = "temper.json",
                            },
                        },
                        new ResourceInfo<Item>
                        {
                            Name = "unq_item en",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/quality:8:6",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new UnqItemFilter(false),
                                    new FixRemoveEmptyName<Item>(),
                                    new FixName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckUnique<Item>()
                                    {
                                        Comparer = new ItemEqualComparer<Item>(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "unq_item.json",
                            },
                        },
                    ],
            };
        }
    }
}
