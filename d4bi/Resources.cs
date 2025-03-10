﻿using Importer.Checker;
using Importer.Custom.Temper;
using Importer.Custom.UnqItem;
using Importer.Fixer;
using Importer.Model;

namespace Importer
{
    internal static class Resources
    {
        public static IEnumerable<ResourceCollection> GetResources()
        {
            return [
                new()
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
                                    new FixName<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<Item>(),
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
                                    new FixName<ClassItem>(),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<ClassItem>(),
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer(),
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
                                    new FixName<ClassItem>(),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<ClassItem>(),
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer(),
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
                                    new FixName<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<Item>(),
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
                                    new FixName<ClassItem>(),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<ClassItem>(),
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "skill.json",
                            },
                        },
                        new ResourceInfo<TemperEnItem>
                        {
                            Name = "temper en",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/items/temper-manual/quality:5",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new TemperFilter<TemperEnItem>(),
                                    new FixName<TemperEnItem>(),
                                    new FixRemoveEmptyName<TemperEnItem>(),
                                    new TemperEnFill
                                    {
                                        ManualsUrl = "https://d4builds.gg/page-data/database/tempering-manuals/page-data.json",
                                    },
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<TemperEnItem>(),
                                    new TemperEnCheckPropertyes(),
                                    new CheckUnique<TemperEnItem>()
                                    {
                                        Comparer = new ItemEqualComparer<TemperEnItem>(),
                                    },
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
                                    new UnqItemFilter(),
                                    new FixName<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<Item>(),
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
                },
                new()
                {
                    Folder = "ru",
                    Infos =
                    [
                        new ResourceInfo<Item>
                        {
                            Name = "aspect ru",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/aspects",
                                        Script = "() => g_listviews.aspects.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new FixName<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<Item>(),
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
                            Name = "glyph ru",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/paragon-glyphs",
                                        Script = "() => g_listviews['paragon-glyphs'].data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ')}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new FixName<ClassItem>(),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<ClassItem>(),
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer(),
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
                            Name = "leg_node ru",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/paragon-nodes/quality:4",
                                        Script = "() => g_listviews['paragon-nodes'].data.map(i => ({id: i.id, name: i.name, classes: i.playerClassNames.split(', ')}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new FixName<ClassItem>(),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<ClassItem>(),
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer(),
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
                            Name = "rune ru",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/type:446841",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/type:446842",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new FixName<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<Item>(),
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
                            Name = "skill ru",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/skills",
                                        Script = "() => g_listviews.skills.data.map(i => ({id: i.id, name: i.name, classes: [i.playerClassName]}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new FixName<ClassItem>(),
                                    new FixRemoveEmptyName<ClassItem>(),
                                    new FixRemoveEmptyClass<ClassItem>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<ClassItem>(),
                                    new CheckUnique<ClassItem>()
                                    {
                                        Comparer = new ClassItemEqualComparer(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "skill.json",
                            },
                        },
                        new ResourceInfo<Item>
                        {
                            Name = "temper ru",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/temper-manual/quality:5",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new TemperFilter<Item>(),
                                    new FixName<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<Item>(),
                                    new CheckUnique<Item>()
                                    {
                                        Comparer = new ItemEqualComparer<Item>(),
                                    },
                                ],
                            },
                            Target = new()
                            {
                                FileName = "temper.json",
                            },
                        },
                        new ResourceInfo<Item>
                                {
                            Name = "unq_item ru",
                            Source = new()
                            {
                                SourceInfos =
                                [
                                    new()
                                    {
                                        Url = "https://www.wowhead.com/diablo-4/ru/items/quality:8:6",
                                        Script = "() => g_listviews.items.data.map(i => ({id: i.id, name: i.name}))",
                                    },
                                ],
                            },
                            Fix = new()
                            {
                                Fixers =
                                [
                                    new UnqItemFilter(),
                                    new FixName<Item>(),
                                    new FixRemoveEmptyName<Item>(),
                                ],
                            },
                            Check = new()
                            {
                                Checkers =
                                [
                                    new CheckEmptyName<Item>(),
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
                },
            ];
        }
    }
}
