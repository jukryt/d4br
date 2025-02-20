// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      0.14.0
// @description  Перевод для d4builds
// @author       jukryt
// @match        https://d4builds.gg/*
// @match        https://maxroll.gg/d4/*
// @match        https://mobalytics.gg/diablo-4/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d4builds.gg
// @homepageURL  https://github.com/jukryt/d4br
// @updateURL    https://raw.githubusercontent.com/jukryt/d4br/main/d4br.js
// @downloadURL  https://raw.githubusercontent.com/jukryt/d4br/main/d4br.js
// @supportURL   https://github.com/jukryt/d4br/issues
// @grant        GM_getResourceText

// @resource     aspect_en    https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/en/aspect.json
// @resource     glyph_en     https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/en/glyph.json
// @resource     unq_item_en  https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/en/unq_item.json
// @resource     leg_node_en  https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/en/leg_node.json
// @resource     rune_en      https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/en/rune.json
// @resource     skill_en     https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/en/skill.json
// @resource     temper_en    https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/en/temper.json

// @resource     aspect_ru    https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/ru/aspect.json
// @resource     glyph_ru     https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/ru/glyph.json
// @resource     unq_item_ru  https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/ru/unq_item.json
// @resource     leg_node_ru  https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/ru/leg_node.json
// @resource     rune_ru      https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/ru/rune.json
// @resource     skill_ru     https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/ru/skill.json
// @resource     temper_ru    https://raw.githubusercontent.com/jukryt/d4br/584d232f12982dc3040a58aaa2b1cd3bdddd9a04/ru/temper.json

// ==/UserScript==

function D4Data() {
    return new class D4Data {
        createEnglish() {
            return new D4Data.English();
        }

        createRussian() {
            return new D4Data.Russian();
        }

        static English = class English {
            constructor() {
                this.aspects = D4Data.getResource("aspect_en").items;
                this.glyphs = D4Data.getResource("glyph_en").items;
                this.unqItems = D4Data.getResource("unq_item_en").items;
                this.legNodes = D4Data.getResource("leg_node_en").items;
                this.runes = D4Data.getResource("rune_en").items;
                this.skills = D4Data.getResource("skill_en").items;
                this.tempers = D4Data.getResource("temper_en").items;
            }
        }

        static Russian = class Russian {
            constructor() {
                this.aspects = D4Data.getResource("aspect_ru").items;
                this.glyphs = D4Data.getResource("glyph_ru").items;
                this.unqItems = D4Data.getResource("unq_item_ru").items;
                this.legNodes = D4Data.getResource("leg_node_ru").items;
                this.runes = D4Data.getResource("rune_ru").items;
                this.skills = D4Data.getResource("skill_ru").items;
                this.tempers = D4Data.getResource("temper_ru").items;
            }
        }

        static getResource(resourceName) {
            const text = GM_getResourceText(resourceName);
            if (!text) {
                return null;
            }

            return JSON.parse(text);
        }
    }
}

class D4BuildsProcessor {
    constructor() {
        const d4Data = new D4Data();
        this.en = d4Data.createEnglish();
        this.ru = d4Data.createRussian();
    }

    mutationObserverCallback(processor, mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "attributes") {
                if (mutation.attributeName === "style" &&
                    mutation.target.id.startsWith("tippy-")) {
                    const tippy = mutation.target;
                    processor.fixPopupStyleBug(tippy);
                }
            } else if (mutation.type === "childList") {
                if (mutation.target.localName === "body") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.id.startsWith("tippy-")) {
                            // aspect and temper
                            if (newNode.querySelector("div.codex__tooltip")) {
                                const gearNameNode = newNode.querySelector("div.codex__tooltip__name");
                                if (gearNameNode) {
                                    processor.aspectNameProcess(gearNameNode);
                                }
                                const tempersNode = newNode.querySelector("div.codex__tooltip__stats--tempering");
                                if (tempersNode) {
                                    const temperNameNodes = tempersNode.querySelectorAll("div.codex__tooltip__stat");
                                    for (const temperNameNode of temperNameNodes) {
                                        processor.temperNameProcess(temperNameNode);
                                    }
                                }
                            }
                            // unq item
                            else if (newNode.querySelector("div.unique__tooltip")) {
                                const unqItemNameNode = newNode.querySelector("h2.unique__tooltip__name");
                                if (unqItemNameNode) {
                                    processor.unqItemNameProcess(unqItemNameNode);
                                }
                            }
                            // skill
                            else if (newNode.querySelector("div.skill__tooltip")) {
                                const skillNameNode = newNode.querySelector("div.skill__tooltip__name");
                                if (skillNameNode) {
                                    processor.skillNameProcess(skillNameNode);
                                }
                            }
                            // glyph
                            else if (newNode.querySelector("div.paragon__tile__tooltip__rarity.rare")) {
                                const paragonTitleNode = newNode.querySelector("div.paragon__tile__tooltip__title");
                                if (paragonTitleNode) {
                                    processor.glyphNameProcess(paragonTitleNode);
                                }
                            }
                            // leg node
                            else if (newNode.querySelector("div.paragon__tile__tooltip__rarity.legendary")) {
                                const paragonTitleNode = newNode.querySelector("div.paragon__tile__tooltip__title");
                                if (paragonTitleNode) {
                                    processor.legNodeNameProcess(paragonTitleNode);
                                }
                            }
                            // gem
                            else if (newNode.querySelector("div.gem__tooltip")) {
                                const gemTitleNode = newNode.querySelector("div.gem__tooltip__name");
                                if (gemTitleNode) {
                                    processor.gemNameProcess(gemTitleNode);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fixPopupStyleBug(node) {
        return this.transformTranslateProcess(node) ||
               this.transformTranslate3dProcess(node)
    }

    transformTranslateProcess(node) {
        const transformValue = node.style.getPropertyValue("transform");
        if (!transformValue) {
            return false
        }

        const transformMatch = transformValue.match(/translate\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/);
        if (!transformMatch) {
            return false;
        }

        const clientRect = node.getBoundingClientRect();
        const elementTop = clientRect.top;
        if (elementTop >= 0) {
            return true;
        }

        let transformX = +transformMatch[1];
        let transformY = +transformMatch[3];

        transformY = -elementTop + transformY;
        const newTransformValue = `translate(${transformX}px, ${transformY}px)`;
        node.style.setProperty("transform", newTransformValue);

        return true;
    }

    transformTranslate3dProcess(node) {
        const transformValue = node.style.getPropertyValue("transform");
        if (!transformValue) {
            return false
        }

        const transformMatch = transformValue.match(/translate3d\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/);
        if (!transformMatch) {
            return false;
        }

        const clientRect = node.getBoundingClientRect();
        const elementTop = clientRect.top;
        if (elementTop >= 0) {
            return true;
        }

        let transformX = +transformMatch[1];
        let transformY = +transformMatch[3];
        let transformZ = +transformMatch[5];

        transformY = -elementTop + transformY;
        const newTransformValue = `translate3d(${transformX}px, ${transformY}px, ${transformZ}px)`;
        node.style.setProperty("transform", newTransformValue);

        return true;
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", this.en.aspects, this.ru.aspects, false);
    }

    temperNameProcess(node) {
        const oldValue = node.innerText;
        if (!oldValue) {
            return false;
        }

        const temperMatch = oldValue.match(/.+\((.+) - (.+)\)/);
        if (!temperMatch) {
            return false;
        }

        const temperName = temperMatch[1];
        const enItem = this.en.tempers.find(i => i.name === temperName);
        if (!enItem) {
            return false;
        }

        const ruItem = this.ru.tempers.find(i => i.id === enItem.id);
        if (!ruItem) {
            return false;
        }

        return this.setNewValue(node, "d4br_temper_name", ruItem.name, false);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_name", this.en.unqItems, this.ru.unqItems, false);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", this.en.skills, this.ru.skills, false);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", this.en.glyphs, this.ru.glyphs, false);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", this.en.legNodes, this.ru.legNodes, false);
    }

    gemNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", this.en.runes, this.ru.runes, false);
    }

    nodeProcess(node, className, oldItems, newItems, addOldValue) {
        if (!node.childNodes) {
            return false;
        }

        const oldValue = node.childNodes[0].data;
        if (!oldValue) {
            return false;
        }

        const oldItem = oldItems.find(i => i.name === oldValue);
        if (!oldItem) {
            return false;
        }

        const newItem = newItems.find(i => i.id === oldItem.id);
        if (!newItem) {
            return false;
        }

        return this.setNewValue(node, className, newItem.name, addOldValue);
    }

    setNewValue(node, className, newValue, addOldValue) {
        if (!newValue) {
            return false;
        }

        let htmlValue = this.buildHtmlValue(className, newValue);
        if (addOldValue) {
            htmlValue += node.innerHTML;
        }

        node.innerHTML = htmlValue;
        return true;
    }

    buildHtmlValue(className, value) {
        return `<div class="d4br_show ${className}" style="color:gray; font-size:15px;">${value}</div>`;
    }
}

class D4MaxrollProcessor {
    constructor() {
        const d4Data = new D4Data();
        this.en = d4Data.createEnglish();
        this.ru = d4Data.createRussian();
    }

    mutationObserverCallback(processor, mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                if (mutation.target.id === "uitools-tooltip-root") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.className === "uitools-tooltip-frame ui-tooltip-active") {
                            // legendary: aspect, leg node, glyph, rune
                            if (newNode.querySelector("div.d4t-tip-legendary")) {
                                const titleNodes = newNode.querySelectorAll("div.d4t-title");
                                const subTitleNode = newNode.querySelector("div.d4t-sub-title");
                                for (const titleNode of titleNodes) {
                                    if (processor.legNodeNameProcess(titleNode) ||
                                        processor.glyphNameProcess(titleNode) ||
                                        processor.runeNameProcess(titleNode) ||
                                        processor.aspectNameProcess(titleNode, subTitleNode)) {
                                        break;
                                    }
                                }
                            }
                            // rare: glyph, rune
                            else if (newNode.querySelector("div.d4t-tip-rare")) {
                                const titleNodes = newNode.querySelectorAll("div.d4t-title");
                                for (const titleNode of titleNodes) {
                                    if (processor.glyphNameProcess(titleNode) ||
                                        processor.runeNameProcess(titleNode)) {
                                        break;
                                    }
                                }
                            }
                            // magic: rune
                            else if (newNode.querySelector("div.d4t-tip-magic")) {
                                const titleNodes = newNode.querySelectorAll("div.d4t-title");
                                for (const titleNode of titleNodes) {
                                    if (processor.runeNameProcess(titleNode)) {
                                        break;
                                    }
                                }
                            }
                            // unq item
                            else if (newNode.querySelector("div.d4t-tip-unique")) {
                                const titleNode = newNode.querySelector("div.d4t-title");
                                if (titleNode) {
                                    processor.unqItemNameProcess(titleNode);
                                }
                            }
                            // mythic item
                            else if (newNode.querySelector("div.d4t-tip-mythic")) {
                                const titleNode = newNode.querySelector("div.d4t-title");
                                if (titleNode) {
                                    processor.unqItemNameProcess(titleNode);
                                }
                            }
                            // skill
                            else if (newNode.querySelector("div.d4t-tip-skill")) {
                                const skillTitleNode = newNode.querySelector("div.d4t-title");
                                if (skillTitleNode) {
                                    processor.skillNameProcess(skillTitleNode);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    aspectNameProcess(titleNode, subTitleNode) {
        if (!titleNode || !subTitleNode) {
            return false;
        }

        const className = "d4br_aspect_name";
        const subTitleValue = subTitleNode.innerText;
        // aspect node
        if (subTitleValue === "Legendary Aspect") {
            return this.nodeProcess(titleNode, className, this.en.aspects, this.ru.aspects, true);
        }
        // item node
        else {
            const oldTitleValue = titleNode.innerText;
            const self = this;

            const enItems = this.en.aspects.filter((i) => { return self.aspectNameFilter(i, oldTitleValue); });
            if (enItems.length != 1) {
                return false;
            }

            const enItem = enItems[0];
            const ruItem = this.ru.aspects.find(i => i.id === enItem.id);

            return this.setNewValue(titleNode, className, ruItem.name, true);
        }
    }

    aspectNameFilter(item, oldTitleValue) {
        const aspectIndex = item.name.indexOf("Aspect");
        // [Aspect of ...] => [Item_Name of Aspect_Name]
        if (aspectIndex === 0) {
            const aspectName = item.name.substring(6);
            if (oldTitleValue.endsWith(aspectName)) {
                return true;
            }
        }
        // [... Aspect] => [Aspect_Name Item_Name]
        else {
            const aspectName = item.name.substring(0, aspectIndex);
            if (oldTitleValue.startsWith(aspectName)) {
                return true;
            }
        }

        return false;
    }

    unqItemNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_unq_name", this.en.unqItems, this.ru.unqItems, true);
    }

    skillNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_skill_name", this.en.skills, this.ru.skills, true);
    }

    legNodeNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_leg_node_name", this.en.legNodes, this.ru.legNodes, true);
    }

    glyphNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_glyph_name", this.en.glyphs, this.ru.glyphs, true);
    }

    runeNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_rune_name", this.en.runes, this.ru.runes, true);
    }

    nodeProcess(node, className, oldItems, newItems, addOldValue) {
        const oldValue = node.innerText;
        if (!oldValue) {
            return false;
        }

        const oldItem = oldItems.find(i => i.name === oldValue);
        if (!oldItem) {
            return false;
        }

        const newItem = newItems.find(i => i.id === oldItem.id);
        if (!newItem) {
            return false;
        }

        return this.setNewValue(node, className, newItem.name, addOldValue);
    }

    setNewValue(node, className, newValue, addOldValue) {
        if (!newValue) {
            return false;
        }

        let htmlValue = this.buildHtmlValue(className, newValue);
        if (addOldValue) {
            htmlValue += node.innerHTML;
        }

        node.innerHTML = htmlValue;
        return true;
    }

    buildHtmlValue(className, value) {
        return `<div class="d4br_show ${className}" style="color:darkgray; font-size:18px;">${value}</div>`;
    }
}

class D4MobalyticsProcessor {
    constructor() {
        const d4Data = new D4Data();
        this.en = d4Data.createEnglish();
        this.ru = d4Data.createRussian();
    }

    mutationObserverCallback(processor, mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                if (mutation.target.id.startsWith("tippy-")) {
                    const tippyNode = mutation.target;
                    // aspect and temper
                    if (tippyNode.querySelector("div.m-1tii5t")) {
                        const aspectNameNode = tippyNode.querySelector("p.m-foqf9j");
                        if (aspectNameNode) {
                            processor.aspectNameProcess(aspectNameNode);
                        }
                        const temperNameNodes = tippyNode.querySelectorAll("span.m-1yjh4k8");
                        for (const temperNameNode of temperNameNodes) {
                            processor.temperNameProcess(temperNameNode);
                        }
                    }
                    // unq item
                    else if (tippyNode.querySelector("div.m-mqkczm")) {
                        const unqItemNameNode = tippyNode.querySelector("h4.m-yb0jxq");
                        if (unqItemNameNode) {
                            processor.unqItemNameProcess(unqItemNameNode);
                        }
                    }
                    // skill
                    else if (tippyNode.querySelector("div.m-1saunj6")) {
                        const skillNameNode = tippyNode.querySelector("p.m-foqf9j");
                        if (skillNameNode) {
                            processor.skillNameProcess(skillNameNode);
                        }
                    }
                    // glyph
                    else if (tippyNode.querySelector("div.m-yak0pv")) {
                        const glyphNameNode = tippyNode.querySelector("p.m-pv4zw0");
                        if (glyphNameNode) {
                            processor.glyphNameProcess(glyphNameNode);
                        }
                    }
                    // leg node
                    else if (tippyNode.querySelector("div.m-1fwtoiz")) {
                        const legNameNode = tippyNode.querySelector("p.m-1vrrnd3");
                        if (legNameNode) {
                            processor.legNodeNameProcess(legNameNode);
                        }
                    }
                    // rune
                    else if (tippyNode.querySelector("div.m-1m5senx")) {
                        const runeNameNode = tippyNode.querySelector("p.m-54521m");
                        if (runeNameNode) {
                            processor.runeNameProcess(runeNameNode);
                        }
                    }
                }
            }
        }
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", this.en.aspects, this.ru.aspects, true);
    }

    temperNameProcess(node) {
        const oldValue = node.innerText;
        if (!oldValue) {
            return false;
        }

        let enItem = this.en.tempers.find(i => i.name === oldValue);

        if (!enItem) {
            const temperNameMatch = oldValue.match(/(.+) - (.+)/);
            if (temperNameMatch) {
                const temperName = `${temperNameMatch[1]}-${temperNameMatch[2]}`;
                enItem = this.en.tempers.find(i => i.name === temperName);
            }
        }

        if (!enItem) {
            return false;
        }

        const ruItem = this.ru.tempers.find(i => i.id === enItem.id);
        if (!ruItem) {
            return false;
        }

        return this.setNewValue(node, "d4br_temper_name", ruItem.name, true);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_name", this.en.unqItems, this.ru.unqItems, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", this.en.skills, this.ru.skills, true);
    }

    glyphNameProcess(node) {
        const oldValue = node.innerText;
        if (!oldValue) {
            return false;
        }

        const glyphMatch = oldValue.match(/([a-zA-Z ]+) \(Lvl \d+\)/);
        if (!glyphMatch) {
            return false;
        }

        const glyphName = glyphMatch[1];
        const enItem = this.en.glyphs.find(i => i.name === glyphName);
        if (!enItem) {
            return false;
        }

        const ruItem = this.ru.glyphs.find(i => i.id === enItem.id);
        if (!ruItem) {
            return false;
        }

        return this.setNewValue(node, "d4br_glyph_name", ruItem.name, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", this.en.legNodes, this.ru.legNodes, true);
    }

    runeNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", this.en.runes, this.ru.runes, true);
    }

    nodeProcess(node, className, oldItems, newItems, addOldValue) {
        const oldValue = node.innerText;
        if (!oldValue) {
            return false;
        }

        const oldItem = oldItems.find(i => i.name === oldValue);
        if (!oldItem) {
            return false;
        }

        const newItem = newItems.find(i => i.id === oldItem.id);
        if (!newItem) {
            return false;
        }

        return this.setNewValue(node, className, newItem.name, addOldValue);
    }

    setNewValue(node, className, newValue, addOldValue) {
        if (!newValue) {
            return false;
        }

        let htmlValue = this.buildHtmlValue(className, newValue);
        if (addOldValue) {
            htmlValue += node.innerHTML;
        }

        node.innerHTML = htmlValue;
        return true;
    }

    buildHtmlValue(className, value) {
        return `<div class="d4br_show ${className}" style="color:darkgray; font-size:15px;">${value}</div>`;
    }
}

(function() {
    'use strict';

    AddStyle("@keyframes d4br_show_anim { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }");
    AddStyle(".d4br_show { animation: .7s d4br_show_anim ease; }");

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    const processor = CreateProcessor();
    const observer = new MutationObserver((mutations, observer) => {
        processor.mutationObserverCallback(processor, mutations);
    });
    observer.observe(document, { subtree: true, childList: true, attributes: true });

    setInterval(() => {
        const mutations = observer.takeRecords();
        if (mutations.length > 0) {
            processor.mutationObserverCallback(processor, mutations);
        }
    }, 1000);
})();

function CreateProcessor() {
    const host = window.location.host;
    switch (host) {
        case "d4builds.gg" :
            return new D4BuildsProcessor();
        case "maxroll.gg" :
            return new D4MaxrollProcessor();
        case "mobalytics.gg" :
            return new D4MobalyticsProcessor();
    }
}

function AddStyle(css) {
    const name = "d4br_style";
    const style = document.getElementById(name) || (function() {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = name;
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
