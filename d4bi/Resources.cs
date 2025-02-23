﻿using Importer.Model;

namespace Importer
{
    internal static class Resources
    {
        public static IEnumerable<IResourceInfo> GetResources()
        {
            return [
                // English
                new ResourceInfo<Item>
                {
                    Name = "aspect en",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/aspects",
                                Script = "() => g_listviews.aspects.data.map(i=>({id: i.id, name: i.name}))",
                            }
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "en",
                        FileName = "aspect.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "glyph en",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/paragon-glyphs",
                                Script = "() => g_listviews['paragon-glyphs'].data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "en",
                        FileName = "glyph.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "leg_node en",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/paragon-nodes/quality:4",
                                Script = "() => g_listviews['paragon-nodes'].data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "en",
                        FileName = "leg_node.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "rune en",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/items/type:446841",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/items/type:446842",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "en",
                        FileName = "rune.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "skill en",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/skills",
                                Script = "() => g_listviews.skills.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "en",
                        FileName = "skill.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "temper en",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/items/temper-manual",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "en",
                        FileName = "temper.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "unq_item en",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/items/quality:8:6",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "en",
                        FileName = "unq_item.json",
                    },
                },
                // Russian
                new ResourceInfo<Item>
                {
                    Name = "aspect ru",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/aspects",
                                Script = "() => g_listviews.aspects.data.map(i=>({id: i.id, name: i.name}))",
                            }
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "ru",
                        FileName = "aspect.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "glyph ru",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/paragon-glyphs",
                                Script = "() => g_listviews['paragon-glyphs'].data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "ru",
                        FileName = "glyph.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "leg_node ru",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/paragon-nodes/quality:4",
                                Script = "() => g_listviews['paragon-nodes'].data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "ru",
                        FileName = "leg_node.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "rune ru",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/items/type:446841",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/items/type:446842",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "ru",
                        FileName = "rune.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "skill ru",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/skills",
                                Script = "() => g_listviews.skills.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "ru",
                        FileName = "skill.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "temper ru",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/items/temper-manual",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "ru",
                        FileName = "temper.json",
                    },
                },
                new ResourceInfo<Item>
                {
                    Name = "unq_item ru",
                    Source = new ResourceSource<Item>{
                        SourceInfos =
                        [
                            new() {
                                Url = "https://www.wowhead.com/diablo-4/ru/items/quality:8:6",
                                Script = "() => g_listviews.items.data.map(i=>({id: i.id, name: i.name}))",
                            },
                        ],
                    },
                    Target = new ResourceTarget<Item> {
                        Folder = "ru",
                        FileName = "unq_item.json",
                    },
                },
            ];
        }
    }
}
