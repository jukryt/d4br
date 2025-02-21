// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      0.15.0
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

// @resource     aspect_en    https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/en/aspect.json
// @resource     glyph_en     https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/en/glyph.json
// @resource     unq_item_en  https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/en/unq_item.json
// @resource     leg_node_en  https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/en/leg_node.json
// @resource     rune_en      https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/en/rune.json
// @resource     skill_en     https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/en/skill.json
// @resource     temper_en    https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/en/temper.json

// @resource     aspect_ru    https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/ru/aspect.json
// @resource     glyph_ru     https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/ru/glyph.json
// @resource     unq_item_ru  https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/ru/unq_item.json
// @resource     leg_node_ru  https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/ru/leg_node.json
// @resource     rune_ru      https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/ru/rune.json
// @resource     skill_ru     https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/ru/skill.json
// @resource     temper_ru    https://raw.githubusercontent.com/jukryt/d4br/01294eaaaf0c6587866d85cea0add1fbf226e1c5/ru/temper.json

// ==/UserScript==

class ExternalResource {
    static getJsonResource(name) {
        const text = GM_getResourceText(name);
        if (!text) {
            return null;
        }
        return JSON.parse(text);
    }
}

class Language {
    static aspects = "aspects";
    static glyphs = "glyphs";
    static unqItems = "unqItems";
    static legNodes = "legNodes";
    static runes = "runes";
    static skills = "skills";
    static tempers = "tempers";

    getResource(name) {
        return this[name];
    }
}

class EnglishLanguage extends Language {
    constructor() {
        super();

        this.aspects = ExternalResource.getJsonResource("aspect_en").items;
        this.glyphs = ExternalResource.getJsonResource("glyph_en").items;
        this.unqItems = ExternalResource.getJsonResource("unq_item_en").items;
        this.legNodes = ExternalResource.getJsonResource("leg_node_en").items;
        this.runes = ExternalResource.getJsonResource("rune_en").items;
        this.skills = ExternalResource.getJsonResource("skill_en").items;
        this.tempers = ExternalResource.getJsonResource("temper_en").items;
    }
}

class RussianLanguage extends Language {
    constructor() {
        super();

        this.aspects = ExternalResource.getJsonResource("aspect_ru").items;
        this.glyphs = ExternalResource.getJsonResource("glyph_ru").items;
        this.unqItems = ExternalResource.getJsonResource("unq_item_ru").items;
        this.legNodes = ExternalResource.getJsonResource("leg_node_ru").items;
        this.runes = ExternalResource.getJsonResource("rune_ru").items;
        this.skills = ExternalResource.getJsonResource("skill_ru").items;
        this.tempers = ExternalResource.getJsonResource("temper_ru").items;
    }
}

class D4BuildsProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
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
        return this.nodeProcess(node, "d4br_aspect_name", Language.aspects, false);
    }

    temperNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const temperMatch = sourceValue.match(/.+\((.+) - (.+)\)/);
        if (!temperMatch) {
            return false;
        }

        const temperName = temperMatch[1];

        const sourceItem = this.sourceLanguage.tempers.find(i => i.name === temperName);
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.tempers.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, "d4br_temper_name", targetItem.name, false);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems, false);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", Language.skills, false);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", Language.glyphs, false);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes, false);
    }

    gemNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes, false);
    }

    nodeProcess(node, className, resourceName, addSourceValue) {
        if (!node.childNodes) {
            return false;
        }

        const sourceValue = node.childNodes[0].data;
        if (!sourceValue) {
            return false;
        }

        const sourceItem = this.sourceLanguage.getResource(resourceName).find(i => i.name === sourceValue);
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.getResource(resourceName).find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, className, targetItem.name, addSourceValue);
    }

    setTargetValue(node, className, targetValue, addSourceValue) {
        if (!targetValue) {
            return false;
        }

        let htmlValue = this.buildHtmlValue(className, targetValue);
        if (addSourceValue) {
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
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
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
            return this.nodeProcess(titleNode, className, Language.aspects, true);
        }
        // item node
        else {
            const titleValue = titleNode.innerText;
            const self = this;

            const sourceItem = this.sourceLanguage.aspects.find(i => { return self.aspectNameFilter(i, titleValue); });
            if (!sourceItem) {
                return false;
            }

            const targetItem = this.targetLanguage.aspects.find(i => i.id === sourceItem.id);
            if (!targetItem) {
                return false;
            }

            return this.setTargetValue(titleNode, className, targetItem.name, true);
        }
    }

    aspectNameFilter(sourceItem, titleValue) {
        const aspectIndex = sourceItem.name.indexOf("Aspect");
        // [Aspect of ...] => [Item_Name of Aspect_Name]
        if (aspectIndex === 0) {
            const aspectName = sourceItem.name.substring(6);
            if (titleValue.endsWith(aspectName)) {
                return true;
            }
        }
        // [... Aspect] => [Aspect_Name Item_Name]
        else {
            const aspectName = sourceItem.name.substring(0, aspectIndex);
            if (titleValue.startsWith(aspectName)) {
                return true;
            }
        }

        return false;
    }

    unqItemNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems, true);
    }

    skillNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_skill_name", Language.skills, true);
    }

    legNodeNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes, true);
    }

    glyphNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_glyph_name", Language.glyphs, true);
    }

    runeNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_rune_name", Language.runes, true);
    }

    nodeProcess(node, className, resourceName, addSourceValue) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const sourceItem = this.sourceLanguage.getResource(resourceName).find(i => i.name === sourceValue);
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.getResource(resourceName).find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, className, targetItem.name, addSourceValue);
    }

    setTargetValue(node, className, targetValue, addSourceValue) {
        if (!targetValue) {
            return false;
        }

        let htmlValue = this.buildHtmlValue(className, targetValue);
        if (addSourceValue) {
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
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
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
        return this.nodeProcess(node, "d4br_aspect_name", Language.aspects, true);
    }

    temperNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        let sourceItem = this.sourceLanguage.tempers.find(i => i.name === sourceValue);

        if (!sourceItem) {
            const temperNameMatch = sourceValue.match(/(.+) - (.+)/);
            if (temperNameMatch) {
                const temperName = `${temperNameMatch[1]}-${temperNameMatch[2]}`;
                sourceItem = this.sourceLanguage.tempers.find(i => i.name === temperName);
            }
        }

        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.tempers.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, "d4br_temper_name", targetItem.name, true);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", Language.skills, true);
    }

    glyphNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const glyphMatch = sourceValue.match(/([a-zA-Z ]+) \(Lvl \d+\)/);
        if (!glyphMatch) {
            return false;
        }

        const glyphName = glyphMatch[1];
        const sourceItem = this.sourceLanguage.glyphs.find(i => i.name === glyphName);
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.glyphs.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, "d4br_glyph_name", targetItem.name, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes, true);
    }

    runeNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes, true);
    }

    nodeProcess(node, className, resourceName, addSourceValue) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const sourceItem = this.sourceLanguage.getResource(resourceName).find(i => i.name === sourceValue);
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.getResource(resourceName).find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, className, targetItem.name, addSourceValue);
    }

    setTargetValue(node, className, targetValue, addSourceValue) {
        if (!targetValue) {
            return false;
        }

        let htmlValue = this.buildHtmlValue(className, targetValue);
        if (addSourceValue) {
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
