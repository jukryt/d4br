// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      0.13.2
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
// @resource     aspect   https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/aspect.json
// @resource     glyph    https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/glyph.json
// @resource     legNode  https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/legNode.json
// @resource     mythItem https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/mythItem.json
// @resource     skill    https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/skill.json
// @resource     temper   https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/temper.json
// @resource     unqItem  https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/unqItem.json
// @resource     rune     https://raw.githubusercontent.com/jukryt/d4br/7e8768c8d56c0971a94d0a88c112484e1b8fcfe1/ru/rune.json
// ==/UserScript==

function D4Data() {
    return new class D4Data {
        constructor() {
            this.aspectMap = this.getMap("aspect");
            this.unqItemMap = this.getMap("unqItem");
            this.mythItemMap = this.getMap("mythItem");
            this.temperMap = this.getMap("temper");
            this.glyphMap = this.getMap("glyph");
            this.legNodeMap = this.getMap("legNode");
            this.skillMap = this.getMap("skill");
            this.runeMap = this.getMap("rune");
        }

        getMap(resourceName) {
            let text = GM_getResourceText(resourceName);
            let json = JSON.parse(text);
            let map = new Map(json.data);
            return map;
        }
    }
}

class D4BuildsProcessor {
    constructor() {
        this.d4Data = new D4Data();
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
        return this.nodeProcess(node, "d4br_aspect_name", this.d4Data.aspectMap, false);
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
        const newValue = this.d4Data.temperMap.get(temperName);

        return this.setNewValue(node, "d4br_temper_name", newValue, false);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_name", this.d4Data.unqItemMap, false) ||
               this.nodeProcess(node, "d4br_myth_name", this.d4Data.mythItemMap, false);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", this.d4Data.skillMap, false);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", this.d4Data.glyphMap, false);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", this.d4Data.legNodeMap, false);
    }

    gemNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", this.d4Data.runeMap, false);
    }

    nodeProcess(node, className, map, addOldValue) {
        if (!node.childNodes) {
            return false;
        }

        const oldValue = node.childNodes[0].data;
        if (!oldValue) {
            return false;
        }

        const newValue = map.get(oldValue);
        return this.setNewValue(node, className, newValue, addOldValue);
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
        this.d4Data = new D4Data();
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
                                    processor.mythItemNameProcess(titleNode);
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
        const aspectMap = this.d4Data.aspectMap;
        const subTitleValue = subTitleNode.innerText;
        // aspect node
        if (subTitleValue === "Legendary Aspect") {
            return this.nodeProcess(titleNode, className, aspectMap, true);
        }
        // item node
        else {
            const oldTitleValue = titleNode.innerText;
            const self = this;

            const results = [...aspectMap].filter((row) => { return self.aspectNameFilter(row, oldTitleValue); });
            if (results.length != 1) {
                return false;
            }

            const newTitleValue = results[0][1];
            return this.setNewValue(titleNode, className, newTitleValue, true);
        }
    }

    aspectNameFilter(mapRow, oldTitleValue) {
        const key = mapRow[0];
        const value = mapRow[1];

        const aspectIndex = key.indexOf("Aspect");
        // [Aspect of ...] => [Item_Name of Aspect_Name]
        if (aspectIndex === 0) {
            const aspectName = key.substring(6);
            if (oldTitleValue.endsWith(aspectName)) {
                return true;
            }
        }
        // [... Aspect] => [Aspect_Name Item_Name]
        else {
            const aspectName = key.substring(0, aspectIndex);
            if (oldTitleValue.startsWith(aspectName)) {
                return true;
            }
        }

        return false;
    }

    unqItemNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_unq_name", this.d4Data.unqItemMap, true);
    }

    mythItemNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_myth_name", this.d4Data.mythItemMap, true);
    }

    skillNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_skill_name", this.d4Data.skillMap, true);
    }

    legNodeNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_leg_node_name", this.d4Data.legNodeMap, true);
    }

    glyphNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_glyph_name", this.d4Data.glyphMap, true);
    }

    runeNameProcess(node) {
        if (!node) { return false; }
        return this.nodeProcess(node, "d4br_rune_name", this.d4Data.runeMap, true);
    }

    nodeProcess(node, className, map, addOldValue) {
        const newValue = map.get(node.innerText);
        return this.setNewValue(node, className, newValue, addOldValue);
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
        this.d4Data = new D4Data();
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
        return this.nodeProcess(node, "d4br_aspect_name", this.d4Data.aspectMap, true);
    }

    temperNameProcess(node) {
        const oldValue = node.innerText;
        if (!oldValue) {
            return false;
        }

        let newValue = this.d4Data.temperMap.get(oldValue);

        if (!newValue) {
            const temperNameMatch = oldValue.match(/(.+) - (.+)/);
            if (temperNameMatch) {
                const newTemperName = `${temperNameMatch[1]}-${temperNameMatch[2]}`;
                newValue = this.d4Data.temperMap.get(newTemperName);
            }
        }

        return this.setNewValue(node, "d4br_temper_name", newValue, true);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_name", this.d4Data.unqItemMap, true) ||
               this.nodeProcess(node, "d4br_myth_name", this.d4Data.mythItemMap, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", this.d4Data.skillMap, true);
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
        const newValue = this.d4Data.glyphMap.get(glyphName);
        return this.setNewValue(node, "d4br_glyph_name", newValue, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", this.d4Data.legNodeMap, true);
    }

    runeNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", this.d4Data.runeMap, true);
    }

    nodeProcess(node, className, map, addOldValue) {
        const newValue = map.get(node.innerText);
        return this.setNewValue(node, className, newValue, addOldValue);
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
