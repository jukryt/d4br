// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      0.12.2
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
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

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
        return this.nodeProcess(node, "d4br_aspect_name", this.d4Data.aspectNameMap, false);
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
        const newValue = this.d4Data.temperNameMap.get(temperName);

        return this.setNewValue(node, "d4br_temper_name", newValue, false);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_name", this.d4Data.unqItemMap, false) ||
               this.nodeProcess(node, "d4br_myth_name", this.d4Data.mythItemMap, false);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", this.d4Data.skillsNameMap, false);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", this.d4Data.glyphNameMap, false);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", this.d4Data.legNodeMap, false);
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
                if (mutation.target.id === "d4tools-tooltip-root") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.className === "d4tools-tooltip") {
                            // leg node
                            if (newNode.querySelector("div.d4t-tip-skill.d4t-tip-legendary")) {
                                const legNodeTitleNode = newNode.querySelector("div.d4t-title");
                                if (legNodeTitleNode) {
                                    processor.legNodeNameProcess(legNodeTitleNode);
                                }
                            }
                            // aspect
                            else if (newNode.querySelector("div.d4t-tip-legendary")) {
                                const titleNode = newNode.querySelector("div.d4t-title");
                                const subTitleNode = newNode.querySelector("div.d4t-sub-title");
                                if (titleNode && subTitleNode) {
                                    processor.aspectNameProcess(titleNode, subTitleNode);
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
                            // glyph node
                            else if (newNode.querySelector("div.d4t-glyph-active")) {
                                const glyphTitleNode = newNode.querySelector("div:nth-child(2 of .d4t-title)");
                                if (glyphTitleNode) {
                                    processor.glyphNameProcess(glyphTitleNode);
                                }
                            }
                            // glyph in title
                            else if (newNode.querySelector("div.d4t-glyph-empty")) {
                                const glyphTitleNode = newNode.querySelector("div.d4t-title");
                                if (glyphTitleNode) {
                                    processor.glyphNameProcess(glyphTitleNode);
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
        const className = "d4br_aspect_name";
        const aspectNameMap = this.d4Data.aspectNameMap;
        const subTitleValue = subTitleNode.innerText;
        // aspect node
        if (subTitleValue === "Legendary Aspect") {
            return this.nodeProcess(titleNode, className, aspectNameMap, true);
        }
        // item node
        else {
            const oldTitleValue = titleNode.innerText;
            const self = this;

            const results = [...aspectNameMap].filter((row) => { return self.aspectNameFilter(row, oldTitleValue); });
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
        return this.nodeProcess(node, "d4br_unq_name", this.d4Data.unqItemMap, true);
    }

    mythItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_myth_name", this.d4Data.mythItemMap, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", this.d4Data.skillsNameMap, true);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", this.d4Data.glyphNameMap, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", this.d4Data.legNodeMap, true);
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
                }
            }
        }
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", this.d4Data.aspectNameMap, true);
    }

    temperNameProcess(node) {
        const oldValue = node.innerText;
        if (!oldValue) {
            return false;
        }

        let newValue = this.d4Data.temperNameMap.get(oldValue);

        if (!newValue) {
            const temperNameMatch = oldValue.match(/(.+) - (.+)/);
            if (temperNameMatch) {
                const newTemperName = `${temperNameMatch[1]}-${temperNameMatch[2]}`;
                newValue = this.d4Data.temperNameMap.get(newTemperName);
            }
        }

        return this.setNewValue(node, "d4br_temper_name", newValue, true);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_name", this.d4Data.unqItemMap, true) ||
               this.nodeProcess(node, "d4br_myth_name", this.d4Data.mythItemMap, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", this.d4Data.skillsNameMap, true);
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
        const newValue = this.d4Data.glyphNameMap.get(glyphName);
        return this.setNewValue(node, "d4br_glyph_name", newValue, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", this.d4Data.legNodeMap, true);
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

function D4Data() {
    return new class D4Data {
        constructor() {
            // https://www.wowhead.com/diablo-4/aspects
            this.aspectNameMap = new Map([
["Rebounding Aspect", "Аспект – отлетающий"],
["Aspect of Unyielding Hits", "Аспект неумолимых ударов"],
["Aspect of Star Shards", "Аспект звездных осколков"],
["Aspect of Might", "Аспект мощи"],
["Juggernaut's Aspect", "Аспект – мощный"],
["Aspect of Disobedience", "Аспект непослушания"],
["Duelist's Aspect", "Аспект – дуэлянтский"],
["Edgemaster's Aspect", "Аспект – гвардейский"],
["Storm Swell Aspect", "Аспект – крепнущий грозовой"],
["Aspect of Pestilence", "Аспект мора"],
["Aspect of Accursed Touch", "Аспект проклятого касания"],
["Insatiable Aspect", "Аспект – ненасытный"],
["Aspect of the Umbral", "Аспект мрака"],
["Aspect of Turbulence", "Аспект турбулентности"],
["Aspect of Infestation", "Аспект заражения"],
["Aspect of the Moonrise", "Аспект восхода луны"],
["Blood Boiling Aspect", "Аспект – Кипящей крови"],
["Aspect of Redirected Force", "Аспект перенаправленной силы"],
["Aspect of Occult Dominion", "Аспект оккультной власти"],
["Aspect of the Agile Wolf", "Аспект ловкого волка"],
["Umbrous Aspect", "Аспект – сумеречный"],
["Aspect of Concussive Strikes", "Аспект контузящих ударов"],
["Flamethrower's Aspect", "Аспект – огнемечущий"],
["Aspect of the Cursed Aura", "Аспект проклятой ауры"],
["Aspect of Splintering Energy", "Аспект раскалывающейся энергии"],
["Starlight Aspect", "Аспект – звездный"],
["Dust Devil's Aspect", "Аспект – пыльный дьявольский"],
["Conceited Aspect", "Аспект – высокомерный"],
["Unyielding Commander's Aspect", "Аспект – несгибаемый командирский"],
["Shademist Aspect", "Аспект – затененный"],
["Aspect of Interdiction", "Аспект заграждения"],
["Bold Chieftain's Aspect", "Аспект – бравый командирский"],
["Aspect of Plains Power", "Аспект равнинной мощи"],
["Aspect of Reanimation", "Аспект возрождения"],
["Aspect of the Unbroken Tether", "Аспект нерушимых уз"],
["Aspect of the Orange Herald", "Аспект рыжего вестника"],
["Aspect of Combined Strikes", "Аспект связанных ударов"],
["Recharging Aspect", "Аспект – перезаряжаемый"],
["Shockwave Aspect", "Аспект – взрывной"],
["Aspect of Endurance", "Аспект неутомимости"],
["Aspect of Haste", "Аспект спешки"],
["Aspect of True Sight", "Аспект истинного зрения"],
["Aspect of Frozen Orbit", "Аспект ледяного пути"],
["Aspect of Elemental Constellation", "Аспект созвездия стихий"],
["Aspect of Retribution", "Аспект воздаяния"],
["Ghostwalker Aspect", "Аспект – блуждающий в тенях"],
["Aspect of Creeping Death", "Аспект ползучей смерти"],
["Snowveiled Aspect", "Аспект – заметенный"],
["Blood Getter's Aspect", "Аспект – кровопускающий"],
["Aspect of Concentration", "Аспект сосредоточения"],
["Aspect of Arrow Storms", "Аспект бури стрел"],
["Accelerating Aspect", "Аспект – скорый"],
["Rapid Aspect", "Аспект – убыстряющий"],
["Aspect of Fierce Winds", "Аспект яростных ветров"],
["Aspect of Fel Gluttony", "Аспект скверного чревоугодия"],
["Aspect of the Expectant", "Аспект ожидания"],
["Aspect of Hardened Bones", "Аспект затвердевших костей"],
["Aspect of the Calm Breeze", "Аспект спокойного дуновения"],
["Aspect of Elements", "Аспект стихий"],
["Aspect of The Aftershock", "Аспект подземного эха"],
["Aspect of Control", "Аспект контроля"],
["Aspect of Inner Calm", "Аспект внутреннего покоя"],
["Aspect of Grasping Veins", "Аспект цепких жил"],
["Hectic Aspect", "Аспект – суматошный"],
["Aspect of Apprehension", "Аспект осознания"],
["Aspect of Vocalized Empowerment", "Аспект громогласного усиления"],
["Aspect of Branching Volleys", "Аспект веерного огня"],
["Undying Aspect", "Аспект – неумирающий"],
["Serpentine Aspect", "Аспект – Зигзаг"],
["Wind Striker Aspect", "Аспект – атакующий ветром"],
["Menacing Aspect", "Аспект – угрожающий"],
["Fell Soothsayer's Aspect", "Аспект – падшего оракула"],
["Aspect of Recalling Feathers", "Аспект возвращающихся перьев"],
["Aspect of Earthquakes", "Аспект землетрясений"],
["Glacial Aspect", "Аспект – ледниковый"],
["Fastblood Aspect", "Аспект – живокровный"],
["Aspect of the Ursine Horror", "Аспект кошмарного медведя"],
["Coldclip Aspect", "Аспект – разящий холодом"],
["Aspect of Frenzied Dead", "Аспект бешеных мертвецов"],
["Aspect of Shredding Blades", "Аспект кромсающих клинков"],
["Aspect of Herculean Spectacle", "Аспект титанического действа"],
["Devilish Aspect", "Аспект – сатанинский"],
["Aspect of Adaptability", "Аспект адаптации"],
["Ravager's Aspect", "Аспект – разоряющий"],
["Vengeful Aspect", "Аспект – злопамятный"],
["Aspect of Exhilaration", "Аспект азарта"],
["Aspect of the Alpha", "Аспект вожака стаи"],
["Aspect of Empowered Feathers", "Аспект усиленных перьев"],
["Aspect of the Protector", "Аспект защитника"],
["Blood-bathed Aspect", "Аспект – выпотрошенный"],
["Aspect of Noxious Ice", "Аспект отравленного льда"],
["Aspect of Anger Management", "Аспект управления гневом"],
["Aspect of Serration", "Аспект зазубрин"],
["Aspect of Metamorphosis", "Аспект метаморфозы"],
["Aspect of Voracious Rage", "Аспект ненасытной ярости"],
["Aspect of Natural Balance", "Аспект равновесия природы"],
["Raider's Aspect", "Аспект – рейдерский"],
["Aspect of the Bounding Conduit", "Аспект отражающего проводника"],
["Aspect of Elemental Acuity", "Аспект стихийного прозрения"],
["Lightning Rod Aspect", "Аспект – громоотводный"],
["Aspect of the Frozen Tundra", "Аспект мерзлой тундры"],
["Starving Ravager's  Aspect", "Аспект – иссушающий разорительный"],
["Frostbitten Aspect", "Аспект – обмороженный"],
["Wildbolt Aspect", "Аспект – ненастный"],
["Aspect of Ancestral Force", "Аспект силы предков"],
["Unrelenting Aspect", "Аспект – непреклонный"],
["Firestarter Aspect", "Аспект – зажигающий"],
["Tormentor's Aspect", "Аспект – терзающий"],
["Aspect of Bul-Kathos", "Аспект Бул-Катоса"],
["Exploiter's Aspect", "Аспект – эксплуатирующий"],
["Aspect of Bristling Vengeance", "Аспект шипастой мести"],
["Aspect of the Unsatiated", "Аспект неутолимости"],
["High Velocity Aspect", "Аспект – скоростной"],
["Enshrouding Aspect", "Аспект – окутывающий"],
["Aspect of Frozen Memories", "Аспект застывших воспоминаний"],
["Aspect of Binding Morass", "Аспект вязкой топи"],
["Aspect of Conflagration", "Аспект поджога"],
["Bladedancer's Aspect", "Аспект – танцующий с клинком"],
["Splintering Aspect", "Аспект – рассекающий"],
["Everliving Aspect", "Аспект – вечноживущий"],
["Aspect of the Damned", "Аспект проклятых"],
["Aspect of Searing Wards", "Аспект пылающей преграды"],
["Aphotic Aspect", "Аспект – мглистый"],
["Aspect of Tenacity", "Аспект стойкости"],
["Skinwalker's Aspect", "Аспект – переменчивый"],
["Aspect of Deflection", "Аспект отражения"],
["Blighted Aspect", "Аспект – зачумленный"],
["Dire Wolf's Aspect", "Аспект – лютоволчий"],
["Windlasher Aspect", "Аспект – хлестающий ветром"],
["Stormcrow's Aspect", "Аспект – грозового ворона"],
["Aspect of Retaliation", "Аспект расплаты"],
["Aspect of the Dire Whirlwind", "Аспект лютого вихря"],
["Aspect of Volatile Shadows", "Аспект взрывных теней"],
["Aspect of the Relentless Armsmaster", "Аспект неутомимого мастера оружия"],
["Tidal Aspect", "Аспект – приливный"],
["Aspect of Sky Power", "Аспект небесной мощи"],
["Aspect of Forest Power", "Аспект лесной мощи"],
["Relentless Berserker's Aspect", "Аспект – безжалостно-берсеркский"],
["Aspect of Decay", "Аспект распада"],
["Reaping Lotus' Aspect", "Аспект – лотосовый"],
["Aspect of the Changeling's Debt", "Аспект долга мимикрида"],
["Aspect of Bursting Venoms", "Аспект взрывающихся токсинов"],
["Aspect of Wild Claws", "Аспект диких когтей"],
["Aspect of the Iron Warrior", "Аспект железного воина"],
["Shepherd's Aspect", "Аспект – пастырский"],
["Elementalist's Aspect", "Аспект – стихийный"],
["Coldbringer's Aspect", "Аспект – хладоносный"],
["Gravitational Aspect", "Аспект – гравитации"],
["Aspect of Potent Exchange", "Аспект могучего обмена"],
["Aspect of Overheating", "Аспект перегрева"],
["Aspect of Grasping Whirlwind", "Аспект цепкого ветра"],
["Aspect of Stolen Vigor", "Аспект украденной бодрости"],
["Aspect of Fleet Wings", "Аспект быстрых крыльев"],
["Aspect of Gore Quills", "Аспект кровавых шипов"],
["Aspect of Numbing Wrath", "Аспект леденящего гнева"],
["Trickshot Aspect", "Аспект – хитрый стрелковый"],
["Repeating Aspect", "Аспект – пульсирующий"],
["Reaper's Aspect", "Аспект – секущий"],
["Ravenous Aspect", "Аспект – прожорливый"],
["Snowguard's Aspect", "Аспект – снежный защитный"],
["Aspect of the Embalmer", "Аспект бальзамировщика"],
["Aspect of Falling Feathers", "Аспект падающих перьев"],
["Aspect of Anticline Burst", "Аспект антиклинального взрыва"],
["Aspect of Layered Wards", "Аспект многоуровневой защиты"],
["Prodigy's Aspect", "Аспект – гениальный"],
["Lightning Dancer's Aspect", "Аспект – танцующий с молниями"],
["Aspect of the Rampaging Werebeast", "Аспект буйного медведя"],
["Aspect of Momentum", "Аспект импульса"],
["Aspect of Limitless Rage", "Аспект безграничной ярости"],
["Moonrage Aspect", "Аспект – Лунная ярость"],
["Sacrificial Aspect", "Аспект – жертвенный"],
["Aspect of Simple Reprisal", "Аспект простого возмездия"],
["Aspect of Reactive Armor", "Аспект реагирующей брони"],
["Smiting Aspect", "Аспект – карательный"],
["Earthstriker's Aspect", "Аспект – сотрясающий землю"],
["Hulking Aspect", "Аспект – громадный"],
["Aspect of Engulfing Flames", "Аспект жадного пламени"],
["Aspect of Three Curses", "Аспект трех проклятий"],
["Aspect of the Dark Dance", "Аспект темного танца"],
["Aspect of Encircling Blades", "Аспект окружающих клинков"],
["Aspect of the Great Feast", "Аспект великого пира"],
["Spirit Bond Aspect", "Аспект – духовный"],
["Needleflare Aspect", "Аспект – вспыхивающий иглами"],
["Aspect of Pestilent Points", "Аспект ядовитого укола"],
["Aspect of Synergy", "Аспект взаимосвязи"],
["Aspect of Ancestral Charge", "Аспект натиска предков"],
["Symbiotic Aspect", "Аспект – симбиотический"],
["Imprisoned Spirit's Aspect", "Аспект – пленяющий духов"],
["Aspect of Potent Blood", "Аспект крови силы"],
["Aspect of Plunging Darkness", "Аспект глубокой тьмы"],
["Aspect of the Stampede", "Аспект панического бегства"],
["Aspect of the Trampled Earth", "Аспект утоптанной земли"],
["Aspect of Berserk Ripping", "Аспект резни берсерка"],
["Blast-Trapper's Aspect", "Аспект – взрывной хватающий"],
["Aspect of Ancient Flame", "Аспект древнего пламени"],
["Ruthless Aspect", "Аспект – бесчеловечный"],
["Aspect of Hungry Blood", "Аспект голодной крови"],
["Aspect of Torment", "Аспект мучения"],
["Aspect of Giant Strides", "Аспект гигантских шагов"],
["Frostblitz Aspect", "Аспект – пронизывающий холодом"],
["Aspect of Shielding Storm", "Аспект щита ветров"],
["Bruiser's Aspect", "Аспект – закаляющий в бою"],
["Brawler's Aspect", "Аспект – бойцовский"],
["Aspect of Rathma's Chosen", "Аспект избранных Ратмы"],
["Aspect of Nebulous Brews", "Аспект бесформенных отваров"],
["Aspect of Shattering Steel", "Аспект расколотой стали"],
["Inexorable Reaper's Aspect", "Аспект – неумолимый жатвенный"],
["Blood-soaked Aspect", "Аспект – окровавленный"],
["Aspect of Frosty Strides", "Аспект морозных шагов"],
["Aspect of Explosive Mist", "Аспект взрывного тумана"],
["Overcharged Aspect", "Аспект – перегруженный"],
["Aspect of Explosive Verve", "Аспект взрывной яркости"],
["Aspect of Shattered Stars", "Аспект расколотых звезд"],
["Mage-Lord's Aspect", "Аспект – верховный магический"],
["Subterranean Aspect", "Аспект – подземный"],
["Eluding Aspect", "Аспект – ускользающий"],
["Stormclaw's Aspect", "Аспект – разрывающий штормовой"],
["Slaking Aspect", "Аспект – гасящий"],
["Bristleback Aspect", "Аспект – щетинистый"],
["Aspect of Empowering Reaper", "Аспект могучего жнеца"],
["Requiem Aspect", "Аспект – заупокойный"],
["Aspect of Berserk Fury", "Аспект ярости берсерка"],
["Aspect of Imitated Imbuement", "Аспект отраженного насыщения"],
["Trickster's Aspect", "Аспект – лживый"],
["Breakneck Bandit's Aspect", "Аспект – безудержный бандитский"],
["Raw Might Aspect", "Аспект – неоспоримый мощный"],
["Assimilation Aspect", "Аспект – обволакивающий"],
["Aspect of Quicksand", "Аспект зыбучих песков"],
["Aspect of Sundered Ground", "Аспект расколотой земли"],
["Aspect of Biting Cold", "Аспект жгучего холода"],
["Aspect of Temporal Incisions", "Аспект разрезов во времени"],
["Aspect of Charged Flash", "Аспект заряженной вспышки"],
["Aspect of the Crowded Sage", "Аспект осажденного мудреца"],
["Mighty Storm's Aspect", "Аспект – бушующий"],
["Aspect of Alacrity", "Аспект рвения"],
["Death Wish Aspect", "Аспект – смертельный"],
["Aspect of Nature's Savagery", "Аспект безжалостной природы"],
["Aspect of Quickening Fog", "Аспект ускоряющего тумана"],
["Aspect of the Firebird", "Аспект жар-птицы"],
["Phasing Poltergeist's Aspect", "Аспект – разделяющегося полтергейста"],
["Aspect of Mending Stone", "Аспект укрепляющего камня"],
["Sticker-thought Aspect", "Аспект – колкий"],
["Aspect of Elusive Menace", "Аспект неуловимой угрозы"],
["Aspect of the Wildrage", "Аспект дикой ярости"],
["Craven Aspect", "Аспект – пугающий"],
["Aspect of Ultimate Shadow", "Аспект последней тени"],
["Aspect of Cruel Sustenance", "Аспект безжалостной жатвы"],
["Aspect of Inevitable Fate", "Аспект неизбежной участи"],
["Aspect of Rallying Reversal", "Аспект обратного воодушевления"],
["Aspect of Fortune", "Аспект фортуны"],
["Mired Sharpshooter's  Aspect", "Аспект – погрязший стрелковый"],
["Aspect of Abundant Energy", "Аспект обильной энергии"],
["Aspect of Shared Misery", "Аспект общих страданий"],
["Aspect of Efficiency", "Аспект эффективности"],
["Aspect of Anemia", "Аспект анемии"],
["Aspect of Invigorating Will", "Аспект живительной воли"],
["Aspect of Corruption", "Аспект порчи"],
["Aspect of the Blurred Beast", "Аспект мелькающего зверя"],
["Luckbringer Aspect", "Аспект – приносящий удачу"],
["Energizing Aspect", "Аспект – наполняющий силой"],
["Winter Touch Aspect", "Аспект – зимний"],
["Aspect of Overwhelming Currents", "Аспект неодолимого течения"],
["Aspect of the Frozen Wake", "Аспект морозной волны"],
["Aspect of Siphoned Victuals", "Аспект похищенной провизии"],
["Aspect of Metamorphic Stone", "Аспект преображающего камня"],
["Aspect of Encroaching Wrath", "Аспект подступающего гнева"],
["Executioner's Aspect", "Аспект – палаческий"],
["Aspect of the Rabid Bear", "Аспект бешеного медведя"],
["Aspect of Iron Rain", "Аспект железного дождя"],
["Aspect of the Prudent Heart", "Аспект крепкого сердца"],
["Clandestine Aspect", "Аспект – Подполье"],
["Aspect of Shattered Defenses", "Аспект пробитой защиты"],
["Jolting Aspect", "Аспект – встряхивающий"],
["Ballistic Aspect", "Аспект – баллистический"],
["Aspect of Avoidance", "Аспект избегания"],
["Runeworker's Conduit Aspect", "Аспект – рунный заряженный"],
["Aspect of Piercing Cold", "Аспект пронзающего холода"],
["Aspect of Binding Embers", "Аспект связующих углей"],
["Aspect of Swelling Curse", "Аспект нарастающего проклятия"],
["Escape Artist's Aspect", "Аспект – обеспечивающий побег"],
["Icy Alchemist's Aspect", "Аспект – ледяной алхимический"],
["Aspect of Poisonous Clouds", "Аспект ядовитого облака"],
["Rotting Aspect", "Аспект – гнилой"],
["Iron Blood Aspect", "Аспект – железнокровный"],
["Crashstone Aspect", "Аспект – камнедробящий"],
["Aspect of the Void", "Аспект пустоты"],
["Incendiary Aspect", "Аспект – воспламеняющий"],
["Aspect of the Flaming Rampage", "Аспект огненного буйства"],
["Aspect of Kinetic Suppression", "Аспект кинетического сдерживания"],
["Rejuvenating Aspect", "Аспект – омолаживающий"],
["Aspect of Assistance", "Аспект подмоги"],
["Aspect of Audacity", "Аспект дерзости"],
["Aspect of Singed Extremities", "Аспект обожженных ног"],
["Shattered Spirit's Aspect", "Аспект – призрачный осколочный"],
["Aspect of Ancestral Echoes", "Аспект эха предков"],
["Cheat's Aspect", "Аспект – трюкаческий"],
["Mangler's Aspect", "Аспект – истязающий"],
["Opportunist's Aspect", "Аспект – авантюристский"],
["Aspect of Tenuous Agility", "Аспект тревожной ловкости"],
["Aspect of Surprise", "Аспект непредсказуемости"],
["Earthguard Aspect", "Аспект – защищенный землей"],
["Aspect of Untimely Death", "Аспект скоропостижной кончины"],
["Protecting Aspect", "Аспект – защищающий"],
["Aspect of Perpetual Stomping", "Аспект непрерывного топота"],
["Aspect of Uncanny Treachery", "Аспект омерзительной измены"],
["Aspect of the Rushing Wilds", "Аспект безудержной дикости"],
["Aspect of Splintering Shards", "Аспект треснутых осколков"],
["Aspect of the Deflecting Barrier", "Аспект отражающего барьера"],
["Aspect of Piercing Static", "Аспект пронзающего тока"],
["Stable Aspect", "Аспект – бурлящий"],
["Aspect of Tempering Blows", "Аспект закаляющих ударов"],
["Flamewalker's Aspect", "Аспект – идущий в пламени"],
["Aspect of Soil Power", "Аспект почвенной мощи"],
["Galvanized Slasher's  Aspect", "Аспект – рассекающий энергией"],
["Aspect of Burning Rage", "Аспект огненной ярости"],
["Aspect of Cyclonic Force", "Аспект силы циклона"],
["Cadaverous Aspect", "Аспект – мертвенный"],
["Aspect of Tenuous Destruction", "Аспект тревожного разрушения"],
["Battle Caster's Aspect", "Аспект – боевой магический"],
["Aspect of Armageddon", "Аспект конца света"],
["Aspect of the Dark Howl", "Аспект темного воя"],
["Snap Frozen Aspect", "Аспект – сковывающий морозом"],
["Osseous Gale Aspect", "Аспект – штормокостный"],
["Mangled Aspect", "Аспект – изувеченный"],
["Aspect of Lethal Dusk", "Аспект смертельного полумрака"],
["Aspect of Fevered Mauling", "Аспект свирепой трепки"],
["Resistant Assailant's Aspect", "Аспект – стойкий атакующий"],
["Aspect of Creeping Mist", "Аспект ползучего тумана"],
["Shattered Aspect", "Аспект – разбитый"],
["Aspect of Slaughter", "Аспект резни"],
["Stormshifter's Aspect", "Аспект – изменчивый штормовой"],
["Wanton Rupture Aspect", "Аспект – безудержно разрывающий"],
["Aspect of the Long Shadow", "Аспект длинной тени"],
["Skullbreaker's Aspect", "Аспект – костоломный"],
["Weapon Master's Aspect", "Аспект – высококлассный"],
["Torturous Aspect", "Аспект – пытающий"],
["Seismic-shift Aspect", "Аспект – тектонический"],
["Aspect of Unstable Imbuements", "Аспект нестабильных усилений"],
["Aspect of the Fortress", "Аспект оплота"],
["Charged Aspect", "Аспект – заряженный"],
["Aspect of Forward Momentum", "Аспект ускоряющего импульса"],
["Veteran Brawler's Aspect", "Аспект – старый бойцовский"],
["Encased Aspect", "Аспект – заключенный"],
["Aspect of Artful Initiative", "Аспект находчивого поступка"],
["Steadfast Berserker's Aspect", "Аспект – крепкий берсерков"],
["Aspect of Bursting Bones", "Аспект взрывающихся костей"],
["Flesh-Rending Aspect", "Аспект – кромсающий плоть"],
["Stormchaser's Aspect", "Аспект – бегущий за штормом"],
["Nighthowler's Aspect", "Аспект – воющий в ночи"],
["Aspect of the Unholy Tether", "Аспект нечестивой связи"],
["Aspect of Exposed Flesh", "Аспект обнаженной плоти"],
["Shadowslicer Aspect", "Аспект – рвущийся из тьмы"],
["Bear Clan Berserker's Aspect", "Аспект – медвежий берсерков"],
["Toxic Alchemist's Aspect", "Аспект – ядовитый алхимический"],
["Aspect of Sly Steps", "Аспект вороватой поступи"],
["Infiltrator's Aspect", "Аспект – диверсантский"],
["Aspect of the Tempest", "Аспект бури"],
["Balanced Aspect", "Аспект – сбалансированный"],
["Virulent Aspect", "Аспект – заразный"],
["Aspect of the Unwavering", "Аспект непоколебимости"],
["Blood Seeker's Aspect", "Аспект – кровавого охотника"],
["Battle-Mad Aspect", "Аспект – ярый"],
["Vigorous Aspect", "Аспект – энергетический"],
                ]);

            // https://www.wowhead.com/diablo-4/items/quality:6
            this.unqItemMap = new Map([
["Rod of Kepeleke", "Прут Кепелеке"],
["Harmony of Ebewaka", "Гармония Эбеваки"],
["Azurewrath", "Лазурная ярость"],
["Fractured Winterglass", "Расколотый хрусталь зимы"],
["Sepazontec", "Сепазонтак"],
["Ring of the Midnight Sun", "Кольцо полуночного солнца"],
["Rakanoth's Wake", "Дозор Раканот"],
["Frostburn", "Обжигающий холод"],
["The Umbracrux", "Умбракрукс"],
["Crown of Lucion", "Корона Люсиона"],
["Tibault's Will", "Воля Тибо"],
["Cruor's Embrace", "Объятия Круора"],
["Fists of Fate", "Кулаки судьбы"],
["Shard of Verathiel", "Осколок Вератиэль"],
["The Third Blade", "Третий клинок"],
["Tal Rasha's Iridescent Loop", "Переливчатое кольцо Тал Раши"],
["The Unmaker", "Непреклонный"],
["Blood Moon Breeches", "Брюки кровавой луны"],
["Banished Lord's Talisman", "Талисман лорда-изгнанника"],
["Axial Conduit", "Осевой проводник"],
["Wildheart Hunger", "Голод дикого сердца"],
["Ring of Mendeln", "Кольцо Мендельна"],
["Blood Artisan's Cuirass", "Кираса кровавого мастера"],
["Locran's Talisman", "Талисман Локрана"],
["Jacinth Shell", "Гиацинтовый панцирь"],
["Godslayer Crown", "Корона богоубийцы"],
["Unsung Ascetic's Wraps", "Повязки невоспетого аскета"],
["Penitent Greaves", "Наголенники покаяния"],
["Mjölnic Ryng", "Кольцо Мьельнир"],
["Earthbreaker", "Землекрушитель"],
["Loyalty's Mantle", "Накидка преданности"],
["Scorn of the Earth", "Презрение к земле"],
["Razorplate", "Бритвенная броня"],
["Esu's Heirloom", "Фамильное наследие Эсу"],
["Temerity", "Дерзание"],
["Staff of Endless Rage", "Посох бесконечного неистовства"],
["Scoundrel's Kiss", "Поцелуй негодяя"],
["Ring of the Sacrilegious Soul", "Кольцо богохульного духа"],
["Flickerstep", "Искроступы"],
["Yen's Blessing", "Благословение Йен"],
["Insatiable Fury", "Ненасытная ярость"],
["Rage of Harrogath", "Ярость Харрогата"],
["Ugly Bastard Helm", "Уродливый шлем ублюдка"],
["Gloves of the Illuminator", "Перчатки проповедника"],
["Ramaladni's Magnum Opus", "Шедевр Рамаладни"],
["Vasily's Prayer", "Молитва Василия"],
["Wound Drinker", "Иссушитель ран"],
["Black River", "Черная река"],
["Peacemonger's Signet", "Печатка миротворца"],
["Craze of the Dead God", "Безумие мертвого бога"],
["Skyhunter", "Небесный охотник"],
["Tuskhelm of Joritz the Mighty", "Клыкастый шлем Йорица Могучего"],
["Ring of the Midday Hunt", "Кольцо полуденной охоты"],
["Paingorger's Gauntlets", "Рукавицы упоения болью"],
["Arreat's Bearing", "Завет Арреат"],
["Ring of Writhing Moon", "Кольцо искривленной луны"],
["Bloodless Scream", "Бескровный крик"],
["Overkill", "Беспредельная мощь"],
["Band of First Breath", "Кольцо первого дыхания"],
["Shroud of Khanduras", "Покров из Хандараса"],
["Soulbrand", "Клеймитель душ"],
["Storm's Companion", "Спутник бури"],
["Mad Wolf's Glee", "Ликование безумного волка"],
["Wushe Nak Pa", "Вуше нак па"],
["Path of Trag'Oul", "Путь Траг'ула"],
["The Mortacrux", "Мортакрукс"],
["Mother's Embrace", "Объятия Матери"],
["Fields of Crimson", "Багряные поля"],
["Raiment of the Infinite", "Облачение бесконечности"],
["Esadora's Overflowing Cameo", "Переполненная камея Эсадоры"],
["Greatstaff of the Crone", "Великий посох старой ведуньи"],
["Lidless Wall", "Недремлющий защитник"],
["The Butcher's Cleaver", "Тесак Мясника"],
["Condemnation", "Осуждение"],
["Endurant Faith", "Стойкая вера"],
["Airidah's Inexorable Will", "Непоколебимая воля Айриды"],
["Tempest Roar", "Рев бури"],
["X'Fal's Corroded Signet", "Ржавая печатка З'фала"],
["Cowl of the Nameless", "Клобук Безымянного"],
["Sidhe Bindings", "Узы ши"],
["Hellhammer", "Адский молот"],
["Vox Omnium", "Общий голос"],
["Windforce", "Сила ветра"],
["Waxing Gibbous", "Растущая луна"],
["Howl from Below", "Вой из глубин"],
["Ancients' Oath", "Клятва Древних"],
["Tassets of the Dawning Sky", "Набедренные щитки рассвета"],
["The Oculus", "Око"],
["Deathspeaker's Pendant", "Подвеска Вестника Смерти"],
["Flamescar", "Обожженный шрам"],
["Dolmen Stone", "Камень дольмена"],
["Staff of Lam Esen", "Посох Лам Эсена"],
["Fleshrender", "Плотерез"],
["Word of Hakan", "Слово Хакана"],
["Unbroken Chain", "Неразорванная цепь"],
["Deathless Visage", "Лик бессмертия"],
["Protection of the Prime", "Защита первородных"],
["Stone of Vehemen", "Камень гнева"],
["Scoundrel's Leathers", "Кожаные обмотки негодяя"],
["Pitfighter's Gull", "Коварство бойца из ям"],
["Hunter's Zenith", "Охотничий зенит"],
["The Basilisk", "Василиск"],
["Saboteur's Signet", "Печатка диверсанта"],
["Battle Trance", "Упоение боем"],
["Gohr's Devastating Grips", "Захваты Гора-разорителя"],
["Iceheart Brais", "Нагрудник ледяного сердца"],
["Blue Rose", "Синяя роза"],
["Starfall Coronet", "Диадема упавшей звезды"],
["Ebonpiercer", "Черношип"],
["Twin Strikes", "Два удара"],
["Asheara's Khanjar", "Ханджар Аширы"],
["Flameweaver", "Ткач пламени"],
["Beastfall Boots", "Сапоги павшего зверя"],
["100,000 Steps", "100 000 шагов"],
["Grasp of Shadow", "Хватка тени"],
["Ring of Red Furor", "Кольцо алой ярости"],
["Writhing Band of Trickery", "Верткий перстень ловкача"],
["Ring of the Ravenous", "Кольцо ненасытных"],
["Björnfang's Tusks (Not used we reuse for future!)", "Клыки Бьорнфанга (будут использованы в будущем)"],
["Greaves of the Empty Tomb", "Наголенники пустой гробницы"],
["Mutilator Plate", "Латы изувера"],
["Eyes in the Dark", "Глаза в темноте"],
["Eaglehorn", "Орлиный рог"],
["Shard of Verathiel / The Third Blade", "Осколок Вератиэль / Третий клинок"],
["The Mortacrux / The Umbracrux", "Мортакрукс / Умбракрукс"],
["Tribute of Ascendance (Resolute)", "Дар вознесения (непоколебимый)"],
["Yen's Blessing", "Благословение Йен"],
["[PH] Thorn Pulse", "[PH] Thorn Pulse"],
["Tribute of Ascendance (United)", "Дар вознесения (сплоченный)"],
["Severed Hand of the Zakarum", "Отъятая длань Закарума"],
["Highest Honors of the Iron Wolves", "Высшая награда Стальных Волков"],
["Boost Pants", "Усиленные штаны"],
["[WIP] Eye of the Depths", "[WIP] Eye of the Depths"],
["Destroyer's Equipment Cache", "Сундук разрушителя: снаряжение"],
["PH Unique Quarterstaff", "PH Unique Quarterstaff"],
["[ph x1_unique_sorc_143]", "[ph x1_unique_sorc_143]"],
["[PH]", "[PH]"],
["[PH] Season 8 Rogue Gloves", "[PH] Season 8 Rogue Gloves"],
["Highest Honors of the Iron Wolves", "Высшая награда Стальных Волков"],
["Boost Scythe", "Усиленная коса"],
["Eternal Journey Chapter 8 Cache", "Сундук за 8 главу Вечного пути"],
["Boost Helm", "Усиленный шлем"],
["[PH] Distance Crit", "[PH] Distance Crit"],
["[PH] Season 7 Necro Pants", "[PH] Season 7 Necro Pants"],
["Boost Dagger", "Усиленный кинжал"],
["[PH] Unique Sorc Helm 99", "[PH] Unique Sorc Helm 99"],
["Destroyer's Equipment Cache", "Сундук снаряжения разрушителя"],
["Eternal Journey Chapter 6 Cache", "Сундук за 6 главу Вечного пути"],
["[PH] Season 8 Necro 2h Sword", "[PH] Season 8 Necro 2h Sword"],
["Traces of the Maiden", "Следы Девы"],
["(PH) Template Unique", "(PH) Template Unique"],
["[PH] Unique Necro 98", "[PH] Unique Necro 98"],
["[PH] Barb uniq 99 pants", "[PH] Barb uniq 99 pants"],
["[PH]", "[PH]"],
["Triune Strongbox of Endurant Faith", "Сейф Церкви Трех со &quot;Стойкой верой&quot;"],
["[PH]Godslayer Crown", "[PH]Godslayer Crown"],
["Boost Staff", "Усиленный посох"],
["[PH] Unique 99 Gloves", "[PH] Unique 99 Gloves"],
["Cleansing Prayer", "Очищающая молитва"],
["Iron Horn", "Железный рог"],
["[PH] BSK Upgrade", "[PH] BSK Upgrade"],
["Eternal Journey Chapter 7 Cache", "Сундук за 7 главу Вечного пути"],
["Champion's Equipment Cache", "Сундук снаряжения чемпиона"],
["[PH] Grab Bag Variant Helm1", "[PH] Grab Bag Variant Helm1"],
["Iron Wolves' Heroic Spoils", "Героические трофеи Стальных Волков"],
["[PH] Unique Helm 95", "[PH] Unique Helm 95"],
["PH Barb Boots", "PH Barb Boots"],
["Hateshard Core", "Hateshard Core"],
["[PH] Season 7 Barb Chest", "[PH] Season 7 Barb Chest"],
["[ph x1_unique_sorc_143]", "[ph x1_unique_sorc_143]"],
["Icy Rib", "Ледяное ребро"],
["Traces of the Maiden", "Следы Девы"],
["Slayer's Equipment Cache", "Сундук снаряжения убийцы"],
["-", "-"],
["Champion's Equipment Cache", "Сундук снаряжения чемпиона"],
["Iron Wolves' Final Harvest", "Последний урожай Стальных Волков"],
["[PH] Season 8 Druid Helm", "[PH] Season 8 Druid Helm"],
["Bloodforged Sigil", "Кровокованная печать"],
["Vox Omnium / The Basilisk", "Общий голос / Василиск"],
["Tuning Stone: Evernight", "Камень отладки: вечная ночь"],
["New Item [PH]", "New Item [PH]"],
["Glimmering Herb Supply", "Мерцающий запас трав"],
["Rusty Heirloom Dagger", "Ржавый наследный кинжал"],
["Pact Amulet", "Контрактный амулет"],
["Eternal Journey Chapter 2 Cache", "Сундук за 2 главу Вечного пути"],
["Iron Wolves' Final Harvest", "Последний урожай Стальных Волков"],
["Eternal Journey Chapter 3 Cache", "Сундук за 3 главу Вечного пути"],
["[PH] Season 7 Druid Amulet", "[PH] Season 7 Druid Amulet"],
["PTR Cache - Class Uniques", "Тайник PTR – Уникальные предметы (классовые)"],
["Skatsimi Tome", "Том скатсим"],
["Eternal Journey Chapter 5 Cache", "Сундук за 5 главу Вечного пути"],
["[PH] Chest Key", "[PH] Chest Key"],
["[PH] Season 8 Sorcerer Helm", "[PH] Season 8 Sorcerer Helm"],
["[ph x1_unique_sorc_143]", "[ph x1_unique_sorc_143]"],
["Tuning Stone: Genesis", "Камень отладки: генезис"],
["[ph x1_unique_sorc_143]", "[ph x1_unique_sorc_143]"],
["[PH]", "[PH]"],
["Slayer's Equipment Cache", "Сундук убийцы: снаряжение"],
["Champion's Equipment Cache", "Сундук чемпиона: снаряжение"],
["Chapter 2 Reward Cache", "Сундук с наградами 2-й главы"],
["Something Super Cool", "Something Super Cool"],
["Cages of Hubris", "Клетки гордыни"],
["Cages of Hubris", "Клетки гордыни"],
["-", "-"],
["-", "-"],
["PTR Cache - Generic Uniques", "Тайник PTR – Уникальные предметы (общие)"],
["-", "-"],
["Eternal Journey Chapter 4 Cache", "Сундук за 4 главу Вечного пути"],
["-", "-"],
["[PH] Season 7 Sorc Focus", "[PH] Season 7 Sorc Focus"],
["Slayer's Equipment Cache", "Сундук снаряжения убийцы"],
["[ph x1_unique_sorc_143]", "[ph x1_unique_sorc_143]"],
["[PH] Season 7 Rogue Boots", "[PH] Season 7 Rogue Boots"],
["Eternal Journey Chapter 9 Cache", "Сундук за 9 главу Вечного пути"],
["-", "-"],
["Destroyer's Equipment Cache", "Сундук снаряжения разрушителя"],
["[PH] Season 8 Spiritborn Amulet", "[PH] Season 8 Spiritborn Amulet"],
["Glimmering Herb Supply", "Мерцающий запас трав"],
["[PH] Unique Barb Gloves 99", "[PH] Unique Barb Gloves 99"],
["Chapter 1 Reward Cache", "Сундук с наградами 1-й главы"],
["Iron Wolves' Heroic Spoils", "Героические трофеи Стальных Волков"],
["[PH] Blue Glaive", "[PH] Blue Glaive"],
["[PH] Snake Glaive", "[PH] Snake Glaive"],
["[PH] Season 8 Barb Gloves", "[PH] Season 8 Barb Gloves"],
["Severed Hand of the Zakarum", "Отъятая длань Закарума"],
                ]);

            // https://www.wowhead.com/diablo-4/items/quality:8
            this.mythItemMap = new Map([
["Tyrael's Might", "Мощь Тираэля"],
["Andariel's Visage", "Лик Андариэль"],
["Ring of Starless Skies", "Кольцо беззвездных небес"],
["Harlequin Crest", "Шутовской гребень"],
["Doombringer", "Вестник рока"],
["The Grandfather", "Предок"],
["Heir of Perdition", "Наследник погибели"],
["Shroud of False Death", "Покров притворной смерти"],
["Resplendent Spark", "Ослепительная искра"],
["Melted Heart of Selig", "Расплавленное сердце Селига"],
["Nesekem, the Herald", "Глашатай Несекем"],
["Shattered Vow", "Нарушенная клятва"],
["Ahavarion, Spear of Lycander", "Аварион, копье Ликандер"],
["Greater Triune Arms Cache", "Сундук Трех с мощным оружием"],
["Mythic Unique Cache", "Сундук с эпохальным уникальным снаряжением"],
["PTR Cache - Mythic Uniques", "Тайник PTR – Эпохальные уникальные предметы"],
["Destroyer's Cache", "Сундук разрушителя"],
                ]);

            // https://www.wowhead.com/diablo-4/items/temper-manual
            this.temperNameMap = new Map([
["Wordly Endurance", "Выносливость путешественника"], // mobalytics bug
["Wordly Fortune", "Богатство путешественника"], // mobalytics bug

["Spiritborn Resolve", "Непоколебимость наследника духов"],
["Elemental Surge-Day", "Волна стихий – день"],
["Barbarian Protection (Legacy)", "Защита варвара (наследие)"],
["Wasteland Innovation", "Развитие Пустошей"],
["Spiritborn Resolve", "Непоколебимость наследника духов"],
["Subterfuge Expertise", "Мастерство: уловки"],
["Eagle Finesse", "Искусность орла"],
["Centipede Augments", "Усиления сороконожки"],
["Spiritborn Resolve", "Непоколебимость наследника духов"],
["Storm Finesse", "Искусность бури"],
["Worldly Endurance", "Выносливость путешественника"],
["Natural Finesse", "Естественная искусность"],
["Spiritborn Endurance", "Закалка наследника духов"],
["Elemental Control", "Контроль над стихиями"],
["Conjuration Augments", "Усиления колдовства"],
["Shadow Augments-Execution", "Усиления темной магии: казнь"],
["Elemental Surge-Day", "Волна стихий – день"],
["Daze Control", "Контроль головокружения"],
["Marksman Augments-Core", "Усиления стрелка: основные"],
["Berserking Innovation", "Развитие берсерка"],
["Barbarian Protection (Legacy)", "Защита варвара (наследие)"],
["Weapon Augments", "Усиления оружия"],
["Centipede Augments", "Усиления сороконожки"],
["Jaguar Innovation", "Развитие ягуара"],
["Subterfuge Expertise", "Мастерство: уловки"],
["Eagle Augments", "Усиления орла"],
["Berserking Finesse", "Искусный берсерк"],
["Scoundrel Finesse", "Искусный плут"],
["Wasteland Innovation", "Развитие Пустошей"],
["Eagle Finesse", "Искусность орла"],
["Furious Augments", "Свирепые усиления"],
["Worldly Fortune", "Богатство путешественника"],
["Frost Cage", "Морозная клетка"],
["Weapon Attunement-Barbarian", "Узы оружия варвара"],
["Bleed Augments", "Усиления кровотечения"],
["Worldly Fortune", "Богатство путешественника"],
["Jaguar Efficiency", "Эффективность ягуара"],
["Specialist Evolution", "Прогресс специализации"],
["Worldly Finesse", "Искусность путешественника"],
["Centipede Efficiency", "Эффективность сороконожки"],
["Fitness Efficiency", "Эффективная форма"],
["Brute Innovation", "Развитие громилы"],
["Gorilla Finesse", "Искусность гориллы"],
["Berserking Innovation", "Развитие берсерка"],
["Furious Augments", "Свирепые усиления"],
["Spiritborn Motion", "Подвижность наследника духов"],
["Natural Motion", "Естественная координация"],
["Bleed Augments", "Усиления кровотечения"],
["Eagle Augments", "Усиления орла"],
["Spiritborn Motion", "Подвижность наследника духов"],
["Sharpened Finesse", "Отточенное искусство"],
["Shadow Augments-Decay", "Усиления темной магии: разложение"],
["Rogue Motion", "Координация разбойника"],
["Wasteland Augments", "Усиления Пустошей"],
["Sorcerer Stability", "Стабильность волшебника"],
["Earth Augments", "Усиления земли"],
["Forest Augments", "Усиления леса"],
["Agile Augments", "Усиления изворотливости"],
["Profane Cage", "Нечестивая клетка"],
["Scoundrel Finesse", "Искусный плут"],
["Centipede Innovation", "Развитие сороконожки"],
["Conjuration Fortune", "Удача колдовства"],
["Gorilla Augments", "Усиления гориллы"],
["Worldly Endurance", "Выносливость путешественника"],
["Centipede Finesse", "Искусность сороконожки"],
["Gorilla Innovation", "Развитие гориллы"],
["Sky Augments", "Усиления неба"],
["Shock Finesse", "Искусность шока"],
["Barbarian Motion", "Координация варвара"],
["Subterfuge Efficiency", "Эффективные уловки"],
["Spiritborn Recovery", "Восстановление наследника духов"],
["Eagle Augments", "Усиления орла"],
["Cutthroat Augments", "Усиления головореза"],
["Brawling Efficiency", "Эффективный бой без правил"],
["Execution Innovation", "Развитие казни"],
["Werewolf Augments", "Усиления волка"],
["Execution Innovation", "Развитие казни"],
["Pyromancy Finesse", "Искусность пиромантии"],
["Druid Invigoration", "Вдохновение друида"],
["Centipede Finesse", "Искусность сороконожки"],
["Rogue Recovery", "Восстановление разбойника"],
["Natural Schemes", "Естественная тактика"],
["Pyromancy Augments", "Усиления пиромантии"],
["Necromancer Wall", "Стена некроманта"],
["Assassin Augments", "Усиления ассасина"],
["Gorilla Efficiency", "Эффективность гориллы"],
["Elemental Surge-Night", "Волна стихий – ночь"],
["Pyromancy Endurance", "Выносливость пиромантии"],
["Plains Augments", "Усиления равнин"],
["Thorn Body", "Шипованное тело"],
["Marksman Finesse", "Искусный стрелок"],
["Marksman Augments-Basic", "Усиления стрелка: базовые"],
["Conjuration Efficiency", "Эффективность колдовства"],
["Agility Efficiency", "Эффективная ловкость"],
["Blood Augments", "Усиления крови"],
["Sorcerer Control", "Контроль волшебника"],
["Natural Resistance", "Естественное сопротивление"],
["Rogue Cloaking", "Скрытность разбойника"],
["Barbarian Breach", "Варварский пролом"],
["Rogue Invigoration", "Вдохновение разбойника"],
["Werebear Augments", "Усиления медведя"],
["Shock Augments-Surge", "Усиления шока – Стремительный скачок"],
["Nature Magic Innovation", "Развитие сил природы"],
["Shadow Augments-Decay", "Усиления темной магии: разложение"],
["Elemental Surge-Day", "Волна стихий – день"],
["Necromancer Invigoration", "Вдохновение некроманта"],
["Jaguar Finesse", "Искусность ягуара"],
["Worldly Stability", "Стабильность путешественника"],
["Trap Expertise", "Мастерство: ловушки"],
["Execution Innovation", "Развитие казни"],
["Core Augments-Barbarian", "Основные усиления: варвар"],
["Bone Finesse", "Искусность костей"],
["Spiritborn Motion", "Подвижность наследника духов"],
["Gorilla Augments", "Усиления гориллы"],
["Companion Augments", "Усиления спутников"],
["Blood Finesse", "Искусность крови"],
["Sharpened Finesse", "Отточенное искусство"],
["Earth Finesse", "Искусность земли"],
["Eagle Efficiency", "Эффективность орла"],
["Eagle Finesse", "Искусность орла"],
["Worldly Stability", "Стабильность путешественника"],
["Natural Resistance", "Естественное сопротивление"],
["Sorcerer Innovation", "Развитие волшебника"],
["Natural Resistance", "Естественное сопротивление"],
["Frost Finesse", "Искусность мороза"],
["Alchemist Control", "Контроль алхимика"],
["Spiritborn Guard", "Страж наследника духов"],
["Nature Magic Wall", "Стена сил природы"],
["Necromancer Wall", "Стена некроманта"],
["Agile Augments", "Усиления изворотливости"],
["Shapeshifting Endurance", "Выносливость оборотня"],
["Cutthroat Augments", "Усиления головореза"],
["Summoning Finesse", "Искусный призыв"],
["Worldly Fortune", "Богатство путешественника"],
["Furious Augments", "Свирепые усиления"],
["Lightning Augments", "Усиления молнии"],
["Rogue Motion", "Координация разбойника"],
["Elemental Control", "Контроль над стихиями"],
["Centipede Innovation", "Развитие сороконожки"],
["Decay Innovation", "Развитие разложения"],
["Barbarian Recovery", "Излечение варвара"],
["Wasteland Augments", "Усиления Пустошей"],
["Druid Invigoration", "Вдохновение друида"],
["Eagle Innovation", "Развитие орла"],
["Demolition Finesse", "Искусное разрушение"],
["Sorcerer Motion", "Координация волшебника"],
["Frost Augments-Frozen", "Усиления мороза – морозные"],
["Subterfuge Efficiency", "Эффективные уловки"],
["Sorcerer Control", "Контроль волшебника"],
["Spiritborn Guard", "Страж наследника духов"],
["Companion Innovation", "Развитие спутников"],
["Gorilla Finesse", "Искусность гориллы"],
["Trap Augments", "Усиления ловушек"],
["Wasteland Augments", "Усиления Пустошей"],
["Brute Innovation", "Развитие громилы"],
["Earth Augments", "Усиления земли"],
["Profane Cage", "Нечестивая клетка"],
["Centipede Augments", "Усиления сороконожки"],
["Necromancer Efficiency", "Эффективность некроманта"],
["Marksman Finesse", "Искусный стрелок"],
["Companion Augments", "Усиления спутников"],
["Summoning Finesse", "Искусный призыв"],
["Frost Cage", "Морозная клетка"],
["Trap Expertise", "Мастерство: ловушки"],
["Centipede Innovation", "Развитие сороконожки"],
["Sorcerer Motion", "Координация волшебника"],
["Shadow Finesse", "Искусность темной магии"],
["Conjuration Fortune", "Удача колдовства"],
["Pyromancy Endurance", "Выносливость пиромантии"],
["Shock Augments-Discharge", "Усиления шока – Статический разряд"],
["Eagle Innovation", "Развитие орла"],
["Barbarian Motion", "Координация варвара"],
["Eagle Innovation", "Развитие орла"],
["Pyromancy Finesse", "Искусность пиромантии"],
["Slayer's Finesse", "Искусность убийцы"],
["Brawling Augments", "Усиления боя без правил"],
["Barbarian Recovery", "Излечение варвара"],
["Soil Augments", "Усиления почвы"],
["Shapeshifting Finesse", "Искусность оборотня"],
["Werebear Augments", "Усиления медведя"],
["Thorn Army", "Армия шипов"],
["Conjuration Augments", "Усиления колдовства"],
["Subterfuge Efficiency", "Эффективные уловки"],
["Barbarian Strategy", "Стратегия варвара"],
["Imbuement Abundance", "Изобильное насыщение"],
["Natural Schemes", "Естественная тактика"],
["Weapon Attunement-Necromancer", "Узы оружия некроманта"],
["Frost Augments", "Усиления мороза"],
["Marksman Augments-Basic", "Усиления стрелка: базовые"],
["Marksman Augments-Core", "Усиления стрелка: основные"],
["Wrath Efficiency", "Эффективный гнев"],
["Marksman Augments-Core", "Усиления стрелка: основные"],
["Rogue Cloaking", "Скрытность разбойника"],
["Ultimate Efficiency-Barbarian", "Эффективность мощных умений: варвар"],
["Thorn Army", "Армия шипов"],
["Conjuration Finesse", "Искусность колдовства"],
["Druid Motion", "Координация друида"],
["Subterfuge Expertise", "Мастерство: уловки"],
["Shapeshifting Endurance", "Выносливость оборотня"],
["Shadow Augments-Execution", "Усиления темной магии: казнь"],
["Jaguar Finesse", "Искусность ягуара"],
["Werebear Augments", "Усиления медведя"],
["Natural Finesse", "Естественная искусность"],
["Natural Finesse", "Естественная искусность"],
["Frost Finesse", "Искусность мороза"],
["Arsenal Finesse", "Арсенал искусности"],
["Shadow Finesse", "Искусность темной магии"],
["Companion Efficiency", "Эффективность спутников"],
["Conjuration Finesse", "Искусность колдовства"],
["Shadow Finesse", "Искусность темной магии"],
["Ultimate Efficiency-Druid", "Эффективность мощных умений: друид"],
["Bleed Innovation", "Развитие кровотечения"],
["Barbarian Innovation", "Варварское изобретение"],
["Gorilla Innovation", "Развитие гориллы"],
["Cutthroat Finesse", "Искусный головорез"],
["Bone Augments", "Усиления костей"],
["Necromancer Efficiency", "Эффективность некроманта"],
["Earth Augments", "Усиления земли"],
["Weapon Attunement-Necromancer", "Узы оружия некроманта"],
["Frost Augments", "Усиления мороза"],
["Bone Innovation", "Развитие костей"],
["Ultimate Efficiency-Barbarian", "Эффективность мощных умений: варвар"],
["Profane Finesse", "Искусность нечестивости"],
["Gorilla Efficiency", "Эффективность гориллы"],
["Spiritborn Recovery", "Восстановление наследника духов"],
["Profane Innovation", "Развитие нечестивости"],
["Bone Augments", "Усиления костей"],
["Trap Augments", "Усиления ловушек"],
["Weapon Mastery Efficiency", "Эффективный мастер оружия"],
["Blood Endurance", "Выносливость крови"],
["Bone Finesse", "Искусность костей"],
["Sorcerer Motion", "Координация волшебника"],
["Core Augments-Barbarian", "Основные усиления: варвар"],
["Storm Augments", "Усиления бури"],
["Druid Motion", "Координация друида"],
["Shock Augments-Discharge", "Усиления шока – Статический разряд"],
["Profane Finesse", "Искусность нечестивости"],
["Necromancer Efficiency", "Эффективность некроманта"],
["Slayer's Finesse", "Искусность убийцы"],
["Bone Finesse", "Искусность костей"],
["Necromancer Invigoration", "Вдохновение некроманта"],
["Spiritborn Endurance", "Закалка наследника духов"],
["Companion Innovation", "Развитие спутников"],
["Weapon Augments", "Усиления оружия"],
["Ultimate Efficiency-Sorcerer", "Эффективность мощных умений: волшебник"],
["Wasteland Innovation", "Развитие Пустошей"],
["Barbarian Strategy", "Стратегия варвара"],
["Bone Innovation", "Развитие костей"],
["Barbarian Control", "Контроль варвара"],
["Storm Augments", "Усиления бури"],
["Blood Augments", "Усиления крови"],
["Conjuration Augments", "Усиления колдовства"],
["Bone Augments", "Усиления костей"],
["Brawling Efficiency", "Эффективный бой без правил"],
["Necromancer Motion", "Координация некроманта"],
["Summoning Augments", "Усиления призыва"],
["Nature Magic Wall", "Стена сил природы"],
["Spiritborn Recovery", "Восстановление наследника духов"],
["Blood Innovation", "Развитие крови"],
["Cutthroat Augments", "Усиления головореза"],
["Shock Augments-Surge", "Усиления шока – Стремительный скачок"],
["Rogue Recovery", "Восстановление разбойника"],
["Conjuration Efficiency", "Эффективность колдовства"],
["Companion Innovation", "Развитие спутников"],
["Berserking Innovation", "Развитие берсерка"],
["Summoning Finesse", "Искусный призыв"],
["Rogue Motion", "Координация разбойника"],
["Storm Finesse", "Искусность бури"],
["Natural Motion", "Естественная координация"],
["Skillful Finesse", "Искусный ловкач"],
["Pyromancy Finesse", "Искусность пиромантии"],
["Eagle Efficiency", "Эффективность орла"],
["Alchemist Control", "Контроль алхимика"],
["Earth Finesse", "Искусность земли"],
["Companion Efficiency", "Эффективность спутников"],
["Eagle Efficiency", "Эффективность орла"],
["Storm Finesse", "Искусность бури"],
["Conjuration Efficiency", "Эффективность колдовства"],
["Ultimate Efficiency-Sorcerer", "Эффективность мощных умений: волшебник"],
["Rogue Persistence", "Настойчивость разбойника"],
["Spiritborn Endurance", "Закалка наследника духов"],
["Fitness Efficiency", "Эффективная форма"],
["Jaguar Augments", "Усиления ягуара"],
["Barbarian Strategy", "Стратегия варвара"],
["Wrath Efficiency", "Эффективный гнев"],
["Fitness Efficiency", "Эффективная форма"],
["Sky Augments", "Усиления неба"],
["Sorcerer Innovation", "Развитие волшебника"],
["Weapon Mastery Efficiency", "Эффективный мастер оружия"],
["Agility Efficiency", "Эффективная ловкость"],
["Sorcerer Control", "Контроль волшебника"],
["Rogue Invigoration", "Вдохновение разбойника"],
["Jaguar Innovation", "Развитие ягуара"],
["Sky Augments", "Усиления неба"],
["Gorilla Efficiency", "Эффективность гориллы"],
["Jaguar Innovation", "Развитие ягуара"],
["Elemental Surge-Night", "Волна стихий – ночь"],
["Rogue Invigoration", "Вдохновение разбойника"],
["Werewolf Augments", "Усиления волка"],
["Forest Augments", "Усиления леса"],
["Elemental Surge-Night", "Волна стихий – ночь"],
["Blood Endurance", "Выносливость крови"],
["Gorilla Finesse", "Искусность гориллы"],
["Forest Augments", "Усиления леса"],
["Jaguar Efficiency", "Эффективность ягуара"],
["Lightning Augments", "Усиления молнии"],
["Demolition Finesse", "Искусное разрушение"],
["Blood Augments", "Усиления крови"],
["Necromancer Motion", "Координация некроманта"],
["Trap Augments", "Усиления ловушек"],
["Rogue Innovation", "Развитие разбойника"],
["Jaguar Efficiency", "Эффективность ягуара"],
["Decay Innovation", "Развитие разложения"],
["Lightning Augments", "Усиления молнии"],
["Plains Augments", "Усиления равнин"],
["Werewolf Augments", "Усиления волка"],
["Rogue Innovation", "Развитие разбойника"],
["Jaguar Finesse", "Искусность ягуара"],
["Decay Innovation", "Развитие разложения"],
["Plains Augments", "Усиления равнин"],
["Skillful Finesse", "Искусный ловкач"],
["Blood Endurance", "Выносливость крови"],
["Trap Expertise", "Мастерство: ловушки"],
["Worldly Stability", "Стабильность путешественника"],
["Berserking Finesse", "Искусный берсерк"],
["Profane Cage", "Нечестивая клетка"],
["Shadow Augments-Decay", "Усиления темной магии: разложение"],
["Earth Finesse", "Искусность земли"],
["Pyromancy Augments-Fiery", "Усиления пиромантии – огненные"],
["Arsenal Finesse", "Арсенал искусности"],
["Shapeshifting Endurance", "Выносливость оборотня"],
["Necromancer Motion", "Координация некроманта"],
["Rogue Cloaking", "Скрытность разбойника"],
["Shapeshifting Finesse", "Искусность оборотня"],
["Centipede Efficiency", "Эффективность сороконожки"],
["Gorilla Augments", "Усиления гориллы"],
["Pyromancy Augments-Fiery", "Усиления пиромантии – огненные"],
["Specialist Evolution", "Прогресс специализации"],
["Sharpened Finesse", "Отточенное искусство"],
["Pyromancy Augments-Fiery", "Усиления пиромантии – огненные"],
["Wrath Efficiency", "Эффективный гнев"],
["Brawling Augments", "Усиления боя без правил"],
["Frost Augments-Frozen", "Усиления мороза – морозные"],
["Thorn Body", "Шипованное тело"],
["Barbarian Motion", "Координация варвара"],
["Shock Finesse", "Искусность шока"],
["Jaguar Augments", "Усиления ягуара"],
["Soil Augments", "Усиления почвы"],
["Frost Augments-Frozen", "Усиления мороза – морозные"],
["Shapeshifting Finesse", "Искусность оборотня"],
["Gorilla Innovation", "Развитие гориллы"],
["Jaguar Augments", "Усиления ягуара"],
["Soil Augments", "Усиления почвы"],
["Profane Innovation", "Развитие нечестивости"],
["Imbuement Abundance", "Изобильное насыщение"],
["Weapon Mastery Efficiency", "Эффективный мастер оружия"],
["Ultimate Efficiency-Sorcerer", "Эффективность мощных умений: волшебник"],
["Bone Innovation", "Развитие костей"],
["Barbarian Breach", "Варварский пролом"],
["Necromancer Invigoration", "Вдохновение некроманта"],
["Summoning Augments", "Усиления призыва"],
["Barbarian Innovation", "Варварское изобретение"],
["Assassin Augments", "Усиления ассасина"],
["Ultimate Efficiency-Barbarian", "Эффективность мощных умений: варвар"],
["Brute Innovation", "Развитие громилы"],
["Assassin Augments", "Усиления ассасина"],
["Daze Control", "Контроль головокружения"],
["Spiritborn Guard", "Страж наследника духов"],
["Blood Innovation", "Развитие крови"],
["Daze Control", "Контроль головокружения"],
["Marksman Augments-Basic", "Усиления стрелка: базовые"],
["Blood Innovation", "Развитие крови"],
["Brawling Efficiency", "Эффективный бой без правил"],
["Rogue Innovation", "Развитие разбойника"],
["Agile Augments", "Усиления изворотливости"],
["Bleed Augments", "Усиления кровотечения"],
["Frost Cage", "Морозная клетка"],
["Blood Finesse", "Искусность крови"],
["Core Augments-Barbarian", "Основные усиления: варвар"],
["Cutthroat Finesse", "Искусный головорез"],
["Worldly Finesse", "Искусность путешественника"],
["Centipede Efficiency", "Эффективность сороконожки"],
["Marksman Finesse", "Искусный стрелок"],
["Conjuration Finesse", "Искусность колдовства"],
["Conjuration Fortune", "Удача колдовства"],
["Slayer's Finesse", "Искусность убийцы"],
["Brawling Augments", "Усиления боя без правил"],
["Ultimate Efficiency-Druid", "Эффективность мощных умений: друид"],
["Bleed Innovation", "Развитие кровотечения"],
["Barbarian Control", "Контроль варвара"],
["Pyromancy Augments", "Усиления пиромантии"],
["Rogue Persistence", "Настойчивость разбойника"],
["Centipede Finesse", "Искусность сороконожки"],
["Bleed Innovation", "Развитие кровотечения"],
["Summoning Augments", "Усиления призыва"],
["Specialist Evolution", "Прогресс специализации"],
["Shock Finesse", "Искусность шока"],
["Weapon Attunement-Necromancer", "Узы оружия некроманта"],
["Agility Efficiency", "Эффективная ловкость"],
["Weapon Augments", "Усиления оружия"],
["Weapon Attunement-Barbarian", "Узы оружия варвара"],
["Skillful Finesse", "Искусный ловкач"],
["Barbarian Breach", "Варварский пролом"],
["Sorcerer Innovation", "Развитие волшебника"],
["Scoundrel Finesse", "Искусный плут"],
["Sorcerer Stability", "Стабильность волшебника"],
["Barbarian Innovation", "Варварское изобретение"],
["Companion Efficiency", "Эффективность спутников"],
["Frost Augments", "Усиления мороза"],
["Nature Magic Innovation", "Развитие сил природы"],
["Profane Innovation", "Развитие нечестивости"],
["Pyromancy Augments", "Усиления пиромантии"],
["Nature Magic Innovation", "Развитие сил природы"],
["Natural Schemes", "Естественная тактика"],
["Thorn Army", "Армия шипов"],
["Shock Augments-Surge", "Усиления шока – Стремительный скачок"],
["Shadow Augments-Execution", "Усиления темной магии: казнь"],
["Necromancer Wall", "Стена некроманта"],
["Storm Augments", "Усиления бури"],
["Demolition Finesse", "Искусное разрушение"],
["Berserking Finesse", "Искусный берсерк"],
["Companion Augments", "Усиления спутников"],
["Worldly Finesse", "Искусность путешественника"],
["Nature Magic Wall", "Стена сил природы"],
["Pyromancy Endurance", "Выносливость пиромантии"],
["Shock Augments-Discharge", "Усиления шока – Статический разряд"],
["Blood Finesse", "Искусность крови"],
["Frost Finesse", "Искусность мороза"],
["Arsenal Finesse", "Арсенал искусности"],
["Druid Motion", "Координация друида"],
["Barbarian Control", "Контроль варвара"],
["Cutthroat Finesse", "Искусный головорез"],
["Natural Motion", "Естественная координация"],
["Ultimate Efficiency-Druid", "Эффективность мощных умений: друид"],
["Worldly Endurance", "Выносливость путешественника"],
["Weapon Attunement-Barbarian", "Узы оружия варвара"],
["Rogue Persistence", "Настойчивость разбойника"],
["Profane Finesse", "Искусность нечестивости"],
["Sorcerer Innovation - Fiery", "Развитие волшебника – огненное"],
["Sorcerer Innovation - Fiery", "Развитие волшебника – огненное"],
["Sorcerer Innovation - Fiery", "Развитие волшебника – огненное"],
                ]);

            // https://www.wowhead.com/diablo-4/paragon-glyphs
            this.glyphNameMap = new Map([
["Talon", "Коготь"],
["Canny", "Благоразумие"],
["Headhunter", "Охотник за головами"],
["Colossal", "Колосс"],
["Spirit", "Дух"],
["Fulminate", "Сверкание"],
["Eliminator", "Уничтожитель"],
["Spirit", "Дух"],
["Exploit", "Уловка"],
["Fulminate", "Сверкание"],
["Undaunted", "Бесстрашие"],
["Revenge", "Мщение"],
["Ire", "Праведный гнев"],
["Fang and Claw", "Клыки и когти"],
["Scourge", "Плеть"],
["Tactician", "Тактик"],
["Deadraiser", "Воскрешатель"],
["Bane", "Бич"],
["Wrath", "Гнев"],
["Flamefeeder", "Питающее пламя"],
["Elementalist", "Стихии"],
["Challenger", "Противник"],
["Sacrificial", "Жертвоприношение"],
["Unleash", "Воля"],
["Menagerist", "Дрессировщик"],
["Fluidity", "Текучесть"],
["Turf", "Почва"],
["Marshal", "Судья"],
["Ritual", "Ритуал"],
["Twister", "Ураган"],
["Might", "Мощь"],
["Executioner", "Палач"],
["Diminish", "Снижение"],
["Territorial", "Защита границ"],
["Exploit", "Уловка"],
["Outmatch", "Превосходство"],
["Jagged Plume", "Зазубренный гребень"],
["Snare", "Капкан"],
["Ambidextrous", "Амбидекстр"],
["Corporeal", "Телесность"],
["Werebear", "Облик медведя"],
["Mage", "Маг"],
["Amplify", "Усиление"],
["Fitness", "Живучесть"],
["Invocation", "Воззвание"],
["Electrocution", "Удар током"],
["Fester", "Гной"],
["Imbiber", "Вкушение"],
["Control", "Контроль"],
["Warding", "Оберег"],
["Essence", "Эссенция"],
["Consumption", "Потребление"],
["Devious", "Хитрость"],
["Reinforced", "Бастион"],
["Combat", "Бой"],
["Tracker", "Следопыт"],
["Keeper", "Хранитель"],
["Hone", "Тренировка"],
["Exhumation", "Эксгумация"],
["Wildfire", "Дикий огонь"],
["Enchanter", "Чары"],
["Tectonic", "Движение земли"],
["Versatility", "Универсальность"],
["Chip", "Обломок"],
["Pyromaniac", "Пироманьяк"],
["Outmatch", "Превосходство"],
["Crusher", "Крушитель"],
["Dominate", "Подчинение"],
["Revenge", "Мщение"],
["Innate", "Рефлекс"],
["Mortal Draw", "Смертельное натяжение"],
["Disembowel", "Потрошение"],
["Closer", "Сближение"],
["Dominate", "Подчинение"],
["Adept", "Мастер"],
["Ambush", "Засада"],
["Ranger", "Странник"],
["Seething", "Возмущение"],
["Frostbite", "Обморожение"],
["Golem", "Голем"],
["Tracker", "Следопыт"],
["Control", "Контроль"],
["Abyssal", "Бездна"],
["Control", "Контроль"],
["Protector", "Защитник"],
["Charged", "Заряд"],
["Revenge", "Мщение"],
["Werewolf", "Облик волка"],
["Conjurer", "Чаротворец"],
["Brawl", "Потасовка"],
["Undaunted", "Бесстрашие"],
["Desecration", "Осквернение"],
["Rumble", "Рокот"],
["Winter", "Зима"],
["Warrior", "Воин"],
["Destruction", "Разрушение"],
["Dominate", "Подчинение"],
["Cleaver", "Тесак"],
["Efficacy", "Эффективность"],
["Hubris", "Гордыня"],
["Shapeshifter", "Оборотень"],
["Blood-drinker", "Кровопийца"],
["Human", "Человек"],
["Bloodfeeder", "Питающая кровь"],
["Weapon Master", "Мастер оружия"],
["Explosive", "Взрывчатка"],
["Exploit", "Уловка"],
["Gravekeeper", "Могильщик"],
["Pride", "Гордыня"],
["Nightstalker", "Ночной охотник"],
["Electrocute", "Электрошок"],
["Torch", "Факел"],
["Wilds", "Дикая природа"],
["Darkness", "Тьма"],
["Bane", "Бич"],
["Earth and Sky", "Земля и небо"],
["Headhunter", "Охотник за головами"],
["Poise", "Самообладание"],
["Stalagmite", "Сталагмит"],
["Frostfeeder", "Питающий лед"],
["Guzzler", "Обжора"],
["Infusion", "Насыщение"],
["-", "-"],
["Advantage", "Первый ход"],
["Reanimator", "Оживление"],
["Ruin", "Крах"],
["Ruin", "Крах"],
["Subdue", "Усмирение"],
["Power", "Сила"],
["Subdue", "Усмирение"],
["Battle-hardened", "Боевая закалка"],
["Bane", "Бич"],
["Slayer", "Истребитель"],
                ]);

            // https://www.wowhead.com/diablo-4/paragon-nodes/quality:4
            this.legNodeMap = new Map([
["Sapping", "Иссушение сил"],
["Frailty", "Хрупкость"],
["Fundamental Release", "Свобода стихий"],
["No Witnesses", "Никаких свидетелей"],
["Ancestral Guidance", "Наставление предков"],
["Icefall", "Ледопад"],
["Cult Leader", "Глава культа"],
["Elemental Summoner", "Призыватель стихий"],
["Burning Instinct", "Пылающий инстинкт"],
["Warbringer", "Разжигатель войны"],
["Scent of Death", "Запах смерти"],
["Force of Nature", "Сила природы"],
["Eldritch Bounty", "Потусторонний дар"],
["Cunning Stratagem", "Хитрый маневр"],
["Wither", "Иссушение"],
["Blood Begets Blood", "Кровь рождает кровь"],
["Bone Graft", "Пересаженная кость"],
["Viscous Shield", "Вязкий щит"],
["Flesh-eater", "Пожирание плоти"],
["Frigid Fate", "Смерть во льдах"],
["Leyrana's Instinct", "Инстинкт Лейраны"],
["Bitter Medicine", "Горькое лекарство"],
["Exploit Weakness", "Игра на слабостях"],
["Constricting Tendrils", "Щупальца-душители"],
["Carnage", "Расправа"],
["Thunderstruck", "Громовой молот"],
["Untamed", "Неукрощенная воля"],
["Bloodbath", "Кровавая баня"],
["Hulking Monstrosity", "Исполинское чудовище"],
["Convergence", "Конвергенция"],
["Hemorrhage", "Кровоизлияние"],
["Blood Rage", "Кровавая ярость"],
["Inner Beast", "Внутренний зверь"],
["Ceaseless Conduit", "Бесконечный проводник"],
["Enchantment Master", "Мастер чар"],
["Tricks of the Trade", "Профессиональные приемы"],
["Decimator", "Дециматор"],
["Heightened Malice", "Необычайная злоба"],
["Searing Heat", "Опаляющий жар"],
["Deadly Ambush", "Смертельная засада"],
["Cheap Shot", "Грязный прием"],
["Survival Instincts", "Инстинкты выживания"],
["Earthen Devastation", "Земляное уничтожение"],
["Lust for Carnage", "Жажда насилия"],
["Static Surge", "Всплеск энергии"],
["Spiney Skin", "Колючая кожа"],
["Drive", "Рвение"],
["Weapons Master", "Мастерское владение оружием"],
["Revealing", "Обнаружение"],
["Bone Breaker", "Костолом"],
["Flawless Technique", "Безупречная техника"],
["Danse Macabre", "Пляска смерти"],
["In-Fighter", "Боец ближнего боя"],
["Natural Leader", "Прирожденный лидер"],
                ]);

            // https://www.wowhead.com/diablo-4/skills
            this.skillsNameMap = new Map([
["Dance of Knives", "Танец с кинжалами"],
["Soar", "Парение"],
["Quill Volley", "Шквал игл"],
["Familiar", "Фамилиар"],
["Counterattack", "Контратака"],
["Thrash", "Трепка"],
["Touch of Death", "Хватка смерти"],
["Thunderspike", "Громовой шип"],
["Sever", "Отсечение"],
["The Hunter", "Охотник"],
["Dark Shroud", "Теневая завеса"],
["Corpse Explosion", "Взрыв трупа"],
["Vortex", "Циклон"],
["Ravager", "Разоритель"],
["Mighty Throw", "Могучий бросок"],
["Rushing Claw", "Стремительные когти"],
["Decrepify", "Немощь"],
["Scourge", "Плеть"],
["Valiance", "Доблесть"],
["Raise Skeleton", "Призыв скелета"],
["Rock Splitter", "Камнекрушитель"],
["Withering Fist", "Губительный кулак"],
["Iron Maiden", "Железная дева"],
["Esu's Ferocity", "Свирепость Эсу"],
["Soulrift", "Раскол души"],
["Toxic Skin", "Токсичная кожа"],
["Chain Lightning", "Цепная молния"],
["Reap", "Жатва"],
["Heartseeker", "Пронзатель сердец"],
["The Devourer", "Пожиратель"],
["Blood Surge", "Волнение крови"],
["Payback", "Расплата"],
["Lightning Storm", "Грозовой шторм"],
["Stinger", "Жало"],
["Armored Hide", "Бронированная шкура"],
["Fireball", "Огненный шар"],
["Barrage", "Шквальный огонь"],
["Lightning Spear", "Электрическое копье"],
["Puncture", "Колющий удар"],
["Army of the Dead", "Армия мертвецов"],
["War Cry", "Воинственный клич"],
["Teleport", "Телепортация"],
["Unstable Currents", "Бурный поток"],
["Blood Mist", "Кровавый туман"],
["Golem", "Голем"],
["Weapon Mastery", "Мастер оружия"],
["Shadow Step", "Шаг сквозь тень"],
["Shadow Imbuement", "Насыщение тенью"],
["Incinerate", "Испепеление"],
["Corpse Tendrils", "Трупные щупальца"],
["Bash", "Сокрушающий удар"],
["Whirlwind", "Вихрь"],
["Blood Wave", "Кровавая волна"],
["Ice Blades", "Ледяные клинки"],
["Frozen Orb", "Морозная сфера"],
["One With Nature", "Единение с природой"],
["Fire Bolt", "Стрела огня"],
["Ice Armor", "Ледяной доспех"],
["Challenging Shout", "Подстрекающий крик"],
["Innervation", "Прилив энергии"],
["Lunging Strike", "Выпад"],
["Call of the Ancients", "Зов Древних"],
["Potent Warding", "Надежные обереги"],
["Frigid Finesse", "Ледяная точность"],
["Unstable Elixirs", "Опасные эликсиры"],
["Vital Strikes", "Атака по уязвимости"],
["Victimize", "Жестокая расправа"],
["Bone Spirit", "Костяной дух"],
["Target Practice", "Стрельба по мишеням"],
["Upheaval", "Выброс земли"],
["Auspicious", "Процветание"],
["Spark", "Искра"],
["Earthen Bulwark", "Земляной бастион"],
["Rapid Fire", "Скоростная стрельба"],
["Conjuration Mastery", "Мастер колдовства"],
["Crushing Hand", "Крушащая рука"],
["Rake", "Раздирание"],
["Poison Imbuement", "Насыщение ядом"],
["Follow Through", "Цепочка ударов"],
["Stutter Step", "Перебежка"],
["Flame Shield", "Пламенный щит"],
["Malice", "Злоба"],
["Bone Storm", "Буря костей"],
["Blood Howl", "Кровавый вой"],
["Caltrops", "Шипы"],
["Cataclysm", "Катаклизм"],
["Charge", "Натиск"],
["Hellbent Commander", "Одержимый командир"],
["Smoke Grenade", "Ослепляющий дым"],
["Wrath of the Berserker", "Гнев берсерка"],
["Razor Wings", "Режущие крылья"],
["Elemental Synergies", "Стихийные комбинации"],
["Enlightenment", "Просветление"],
["Potent", "Мощь"],
["Raheir's Guard", "Защита Рахейра"],
["Wind Shear", "Ветрорез"],
["Blight", "Тлен"],
["Grim Harvest", "Мрачный урожай"],
["Frenzy", "Бешенство"],
["Firewall", "Стена огня"],
["Wolves", "Волки"],
["Hewed Flesh", "Обрезки плоти"],
["Seeker", "Искатель"],
["Rallying Cry", "Воодушевляющий клич"],
["Concealment", "Маскировка"],
["Hammer of the Ancients", "Молот Древних"],
["Massacre", "Резня"],
["Frost Nova", "Кольцо льда"],
["Nature's Resolve", "Стойкость природы"],
["Glass Cannon", "Хрупкий разрушитель"],
["Pulverize", "Сокрушение"],
["Reaper's Pursuit", "Преследующий жнец"],
["Rupture", "Разрыв"],
["Flurry", "Шквал"],
["Precision", "Точность"],
["Dash", "Рывок"],
["Bone Prison", "Костяная тюрьма"],
["Ravens", "Вороны"],
["Exploit", "Уловка"],
["Arc Lash", "Грозовая плеть"],
["Momentum", "Импульс"],
["Noxious Resonance", "Ядовитый резонанс"],
["Warmth", "Тепло"],
["Decompose", "Распад"],
["The Protector", "Защитник"],
["Mirage", "Мираж"],
["Skeletal Mage Mastery", "Мастер скелетов-магов"],
["Elemental Dominance", "Власть над стихиями"],
["Shadowblight", "Чума тьмы"],
["Fueled", "Подпитка"],
["Twisting Blades", "Вонзающиеся клинки"],
["Invigorating Strike", "Живительный удар"],
["Second Wind", "Второе дыхание"],
["Flay", "Свежевание"],
["Affliction", "Недуг"],
["Hydra", "Гидра"],
["Spiked Armor", "Шипастый доспех"],
["Penetrating Shot", "Пробивающий выстрел"],
["Duelist", "Дуэлянт"],
["Unrestrained Power", "Необузданная мощь"],
["Fueled by Death", "Смерть придает силы"],
["Alchemical Advantage", "Польза алхимии"],
["Poison Trap", "Ловушка с ядом"],
["Concussive Stomp", "Контузящий топот"],
["Trample", "Тяжелый шаг"],
["Adaptive Stances", "Адаптивные стойки"],
["Iron Skin", "Железная кожа"],
["Invigorating Conduit", "Бодрящий проводник"],
["Patient Guard", "Терпеливый страж"],
["Amplify Damage", "Усиление урона"],
["Digitigrade Gait", "Прыть пальцеходящих"],
["Walking Arsenal", "Живой арсенал"],
["Petrify", "Окаменение"],
["Shatter", "Раскалывание"],
["Imperfectly Balanced", "Хрупкий баланс"],
["Necrotic Carapace", "Некротический панцирь"],
["Storm Strike", "Удар бури"],
["Poison Creeper", "Ядовитая лоза"],
["Resolution", "Решительность"],
["Trick Attacks", "Коварные удары"],
["Prodigy's Tempo", "Темп гения"],
["Stone Burst", "Каменный взрыв"],
["Death Blow", "Смертельный удар"],
["Ice Shards", "Осколки льда"],
["Hemorrhage", "Кровоизлияние"],
["Debilitating Roar", "Изнуряющий рев"],
["Pit Fighter", "Боец арены"],
["Maul", "Трепка"],
["Siphoning Strikes", "Вытягивающие удары"],
["Ossified Essence", "Окостеневшая эссенция"],
["Velocity", "Быстрота"],
["Heavy Handed", "Тяжелая рука"],
["Precision Imbuement", "Прицельное насыщение"],
["Claw", "Удар когтями"],
["Adrenaline Rush", "Выброс адреналина"],
["Steel Grasp", "Железная хватка"],
["Gloom", "Сумрак"],
["Invigorating Fury", "Бодрящая ярость"],
["Landslide", "Оползень"],
["Quickshift", "Быстрое преображение"],
["Skeletal Warrior Mastery", "Мастер скелетов-воинов"],
["Shred", "Разрывание"],
["Evulsion", "Искоренение"],
["Sturdy", "Прочность"],
["Bone Spear", "Костяное копье"],
["Impetus", "Сила движения"],
["Haste", "Спешка"],
["Deadly Venom", "Смертельный яд"],
["Inferno", "Инферно"],
["Clarity", "Ясность"],
["The Seeker", "Искатель"],
["Death's Approach", "Приближение смерти"],
["Outburst", "Вспышка гнева"],
["Vyr's Mastery", "Мастерство Выра"],
["Nourishment", "Насыщение"],
["Leap", "Прыжок"],
["Counteroffensive", "Контрнаступление"],
["Sustenance", "Поддержка сил"],
["Shadow Clone", "Темное отражение"],
["Forceful Arrow", "Стрела силы"],
["Drain Vitality", "Иссушение жизненной силы"],
["Rapid Ossification", "Быстрое окостенение"],
["Double Swing", "Двойной удар"],
["Brilliance", "Гениальность"],
["Belligerence", "Воинственность"],
["Feral Aptitude", "Звериная сноровка"],
["Ground Stomp", "Топот"],
["Envenom", "Наполнение ядом"],
["Vigorous", "Истовость"],
["Death Trap", "Смертоносная ловушка"],
["Death's Embrace", "Объятия смерти"],
["Rabies", "Звериное бешенство"],
["Overflowing Energy", "Неудержимая энергия"],
["Bestial Rampage", "Звериное буйство"],
["Swift", "Проворство"],
["Blasphemous Fate", "Кощунственная судьба"],
["Nature's Fury", "Гнев природы"],
["Heightened Senses", "Обостренные чувства"],
["Devastation", "Опустошение"],
["Rend", "Рваные раны"],
["Iron Maelstrom", "Круговорот стали"],
["Necrotic Fortitude", "Некротическая стойкость"],
["Slaying Strike", "Разящий удар"],
["Raid Leader", "Лидер рейда"],
["Unliving Energy", "Неживая энергия"],
["Hurricane", "Ураган"],
["Grizzly Rage", "Ярость гризли"],
["Heart of the Wild", "Сердце дикой природы"],
["Avalanche", "Лавина"],
["No Mercy", "Никакой пощады"],
["Ravenous", "Ненасытность"],
["Electrocution", "Электрошок"],
["Bonded in Essence", "Связанные одной эссенцией"],
["Inspiring Leader", "Пример для подражания"],
["Static Discharge", "Статический разряд"],
["Blood Lance", "Окровавленное копье"],
["Kalan's Edict", "Эдикт Калана"],
["Barbed Carapace", "Шипованный панцирь"],
["Crippling Flames", "Увечащее пламя"],
["Rain of Arrows", "Град стрел"],
["Conduction", "Проводимость"],
["Apex", "Сверххищник"],
["Ursine Strength", "Медвежья сила"],
["Cold Imbuement", "Насыщение холодом"],
["Tough as Nails", "Шипастый щит"],
["Nature's Reach", "Власть природы"],
["Concussion", "Контузия"],
["Bone Splinters", "Костяные осколки"],
["Ball Lightning", "Шаровая молния"],
["Endurance", "Закалка"],
["Aftermath", "Итог"],
["Frost Bolt", "Ледяная стрела"],
["Elemental Attunement", "Единство со стихиями"],
["Perseverance", "Упорство"],
["Unconstrained", "Неудержимая сила"],
["Antivenom", "Противоядие"],
["Deep Freeze", "Глубокая заморозка"],
["Devouring Blaze", "Всепоглощающее пламя"],
["Imposing Presence", "Довлеющее присутствие"],
["Crushing Earth", "Сокрушающая земля"],
["Spiritual Attunement", "Духовное единение"],
["Defensive Posture", "Защитная стойка"],
["Brute Force", "Грубая сила"],
["Lacerate", "Раздирание"],
["Compound Fracture", "Сложный перелом"],
["Close Quarters Combat", "Ближний бой"],
["Crippling Darkness", "Жестокая тьма"],
["Supremacy", "Превосходство"],
["Alchemist's Fortune", "Удача алхимика"],
["Inner Flames", "Внутреннее пламя"],
["Charged Bolts", "Электрические разряды"],
["Alchemical Admixture", "Алхимическая смесь"],
["Cyclone Armor", "Ураганный доспех"],
["Titan's Fall", "Падение титана"],
["Wallop", "Разгром"],
["Martial Vigor", "Боевой азарт"],
["Booming Voice", "Громогласность"],
["Abundance", "Изобилие"],
["Acceleration", "Ускорение"],
["Furnace", "Печь"],
["Unrestrained", "Необузданная сила"],
["Hamstring", "Подрезание сухожилий"],
["Resilient", "Устойчивость"],
["Prolific Fury", "Живительная ярость"],
["Defiance", "Непокорность"],
["Endless Pyre", "Нескончаемое сожжение"],
["Backlash", "Сила непробиваемости"],
["Golem Mastery", "Мастер големов"],
["Blizzard", "Снежная буря"],
["Shield Charge", "Рывок с щитом"],
["Dominant", "Властность"],
["Earth Breaker", "Землекрушитель"],
["Meteor", "Метеорит"],
["Shocking Impact", "Импульс шока"],
["Earthen Might", "Мощь земли"],
["Debilitating Toxins", "Изнуряющие яды"],
["Tides of Blood", "Волны крови"],
["Frigid Breeze", "Леденящий ветер"],
["Wild Impulses", "Дикие инстинкты"],
["Kick", "Удар ногой"],
["Pressure Point", "Уязвимая точка"],
["Gushing Wounds", "Кровоточащие раны"],
["Initiative", "Инициатива"],
["Coalesced Blood", "Сгусток крови"],
["Heavy Hitter", "Тяжелые удары"],
["Shadow Crash", "Теневое сокрушение"],
["Death's Defense", "Защита смерти"],
["Memento Mori", "Помни о смерти"],
["Iron Fur", "Железный мех"],
["Fiery Surge", "Вспышка огня"],
["Expose Vulnerability", "Найти слабости"],
["Lupine Ferocity", "Волчья свирепость"],
["Energy Focus", "Средоточие энергии"],
["Raheir's Aegis", "Эгида Рахейра"],
["Toxic Claws", "Ядовитые когти"],
["Focal Point", "Четкий фокус"],
["Rathma's Vigor", "Бодрость Ратмы"],
["Combustion", "Возгорание"],
["Resonance", "Резонанс"],
["Rapid Gambits", "Быстрые хитрости"],
["Terror", "Устрашение"],
["Intricacy", "Запутанность"],
["Aggressive Resistance", "Яростное сопротивление"],
["Agile", "Изворотливость"],
["Battle Fervor", "Боевое рвение"],
["Serration", "Зазубрины"],
["Crater", "Кратер"],
["Diminishment", "Умаление"],
["Cold Front", "Холодный фронт"],
["Call of the Wild", "Зов дикой природы"],
["Convulsions", "Конвульсии"],
["Natural Disaster", "Природная катастрофа"],
["Endless Fury", "Бесконечная ярость"],
["Permafrost", "Вечная мерзлота"],
["Blade Shift", "Блуждающий клинок"],
["Perfect Storm", "Буря в разгаре"],
["Trip Mines", "Мины с растяжкой"],
["Mana Shield", "Щит маны"],
["Wire Trap", "Проволочная ловушка"],
["Predatory Instinct", "Инстинкт хищника"],
["Consuming Shadows", "Поглощающие теней"],
["Mocking Lure", "Приманивающая насмешка"],
["Endless Tempest", "Нескончаемый ураган"],
["Icy Touch", "Ледяное прикосновение"],
["Thick Skin", "Плотная кожа"],
["Precision Decay", "Точечное гниение"],
["Bastion", "Бастион"],
["Rugged", "Двужильность"],
["Bloodthirst", "Кровожадность"],
["Hysteria", "Истерия"],
["Stone Guard", "Каменный страж"],
["Bloodlust", "Жажда крови"],
["Taste of Flesh", "Вкус плоти"],
["Mending Obscurity", "Целительная пелена"],
["Provocation", "Провокация"],
["Cut to the Bone", "Порез до кости"],
["Evocation", "Воззвание"],
["Align the Elements", "Баланс стихий"],
["Coursing Currents", "Текучие потоки"],
["Recklessness", "Безрассудство"],
["Humanity", "Человечность"],
["Gruesome Mending", "Зловещее исцеление"],
["Oppressive", "Угнетение"],
["Neurotoxin", "Нейротоксин"],
["Ground Slam", "Удар по земле"],
["Haunt", "Проклятие призраков"],
["Snipe", "Снайперский выстрел"],
["Precision Magic", "Точная магия"],
["Protection", "Защита"],
["Balanced Exertion", "Распределение усилий"],
["Stand Alone", "Одиночка"],
["Piercing Arrows", "Пронзающие стрелы"],
["Exposure", "Вредное воздействие"],
["Swiftness", "Быстрота"],
["Iron Wolf's Call", "Зов Стального Волка"],
["Eradication", "Изничтожение"],
["Whirlwind", "Вихрь"],
["Soulfire", "Ожог души"],
["Terrify", "Ужас"],
["Raging Violence", "Беспощадная ярость"],
["Tempered Fury", "Усмиренная ярость"],
["Raging Havoc", "Опустошительная ярость"],
["Cover Fire", "Огневая поддержка"],
["Tornado", "Смерч"],
["Charged Atmosphere", "Атмосферное напряжение"],
["Boulder", "Глыба"],
["Elemental Exposure", "Сила стихий"],
["Ancestral Fortitude", "Стойкость предков"],
["Bastion", "Бастион"],
["Ancient Harpoons", "Древние гарпуны"],
["Exhaustion", "Изнеможение"],
["Catastrophe", "Бедствие"],
["Vehemence", "Неистовство"],
["Thrillseeker", "Азартный боец"],
["Earth Spike", "Шип земли"],
["Storm of Fire", "Огненный шторм"],
["Hoarfrost", "Изморозь"],
["Guttural Yell", "Утробный рев"],
["Ember's Gift", "Дар углей"],
["Vigilance", "Бдительность"],
["Attack", "Атака"],
["Molotov", "Горючая смесь"],
["Field of Languish", "Поле изнеможения"],
["Safeguard", "Защитные меры"],
["Opening Fire", "Начальный выстрел"],
["Sundering Shield", "Раскалывающий щит"],
["Unto Dawn", "До рассвета"],
["Balestra", "Прыжок с выпадом"],
["Annihilator", "Аннигилятор"],
["Shockwave", "Ударная волна"],
["Burning Chaos", "Пылающий хаос"],
["Flame Surge", "Выброс пламени"],
["Pin Cushion", "Град стрел"],
["Snap Freeze", "Мгновенная заморозка"],
["Scorched Earth", "Выжженная земля"],
["Finality", "Исход"],
["Provoke", "Провокация"],
["Inspiration", "Вдохновение"],
["Chilling Weight", "Обременяющий холод"],
["Bargaining Chips", "Разменные монеты"],
["Dampen Layer", "Подавляющий слой"],
["Defensive Stance", "Защитная позиция"],
["Wave of Flame", "Волна пламени"],
["Condemned", "Приговор"],
["Icy Veil", "Ледяная завеса"],
["Warpath", "Тропа войны"],
["Trap Mastery", "Мастер ловушек"],
["Transfusion", "Переливание"],
["Rampage", "Буйство"],
["Furious Impulse", "Яростный порыв"],
["Circle of Life", "Круг жизни"],
["Chain of Souls", "Цепь душ"],
["Unbridled Rage", "Необузданная свирепость"],
["Ready At Hand", "Оружие под рукой"],
["Natural Fortitude", "Природная выносливость"],
["Attack", "Атака"],
["No Escape", "Неотвратимость"],
["Incendiary Bolt", "Зажигательный снаряд"],
["Dismembering", "Расчленение"],
["Attack", "Атака"],
["Mastermind", "Главарь"],
["Draw Fire", "Перенаправление угрозы"],
["Explosive Charge", "Взрывчатка"],
["Iron Grip", "Железная хватка"],
["Intimidated", "Запугивание"],
["Iron Wolf's Ward", "Оберег Стального Волка"],
["Crushing Force", "Сокрушительная сила"],
["Electric Shock", "Электрошок"],
["Ambusher", "Внезапная атака"],
["Mending", "Исправление"],
["Consecrated Shield", "Освященный щит"],
["Shared Pain", "Общая боль"],
["Iron Wolf's Arrival", "Прибытие Стального Волка"],
["Bad Omen", "Дурное знамение"],
["Loaded Munitions", "Заряженные боеприпасы"],
["Thick Hide", "Плотная шкура"],
["Reprisal", "Возмездие"],
["Irrepressible", "Неукротимость"],
["Covered in Ash", "Пепельный покров"],
["Quick Impulses", "Стремительные инстинкты"],
["Cleave", "Рассекающий удар"],
["Reactive Defense", "Защитный импульс"],
["Shield Throw", "Бросок щита"],
["Paranoia", "Паранойя"],
["Share a Drink", "Выпьем"],
["Iron Wolf's Virtue", "Добродетель Стального Волка"],
["Vanguard", "Авангард"],
["Attack", "Атака"],
["Evasive", "Уклончивость"],
["Amplified Suffering", "Усиленные страдания"],
["Attack", "Атака"],
["Attack", "Атака"],
                ]);
        }
    }
}
