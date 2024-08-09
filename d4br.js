// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      0.11.4
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
                // fix popup negative top bug
                if (mutation.attributeName === "style" &&
                    mutation.target.id.startsWith("tippy-")) {
                    const tippy = mutation.target;
                    const transformValue = tippy.style.getPropertyValue("transform");
                    if (transformValue) {
                        const transformMatch = transformValue.match(/translate3d\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/);
                        if (transformMatch) {
                            const clientRect = tippy.getBoundingClientRect();
                            const elementTop = clientRect.top;
                            if (elementTop < 0) {
                                let transformX = +transformMatch[1];
                                let transformY = +transformMatch[3];
                                let transformZ = +transformMatch[5];

                                transformY = -elementTop + transformY;
                                const newTransformValue = `translate3d(${transformX}px, ${transformY}px, ${transformZ}px)`;
                                tippy.style.setProperty("transform", newTransformValue);
                            }
                        }
                    }
                }
            } else if (mutation.type === "childList") {
                if (mutation.target.localName === "body") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.id.startsWith("tippy-")) {
                            // aspect
                            if (newNode.querySelector("div.codex__tooltip")) {
                                const gearNameNode = newNode.querySelector("div.codex__tooltip__name");
                                if (gearNameNode) {
                                    processor.aspectNameProcess(gearNameNode, false);
                                }
                            }
                            // unq item
                            else if (newNode.querySelector("div.unique__tooltip")) {
                                const unqItemNameNode = newNode.querySelector("h2.unique__tooltip__name");
                                if (unqItemNameNode) {
                                    processor.unqItemNameProcess(unqItemNameNode, false);
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

    aspectNameProcess(node, addOldValue) {
        return this.nodeProcess(node, "aspect_name_rus", this.d4Data.aspectNameMap, addOldValue);
    }

    unqItemNameProcess(node, addOldValue) {
        return this.nodeProcess(node, "unq_name_rus", this.d4Data.unqItemMap, addOldValue) ||
               this.nodeProcess(node, "mif_name_rus", this.d4Data.mifItemMap, addOldValue);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "skill_name_rus", this.d4Data.skillsNameMap, false);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "glyph_name_rus", this.d4Data.glyphNameMap, false);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "leg_node_name_rus", this.d4Data.legNodeMap, false);
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
        return `<div class="${className}" style="color:gray; font-size:15px;">${value}</div>`;
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
        const className = "aspect_name_rus";
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
        return this.nodeProcess(node, "unq_name_rus", this.d4Data.unqItemMap, true) ||
               this.nodeProcess(node, "mif_name_rus", this.d4Data.mifItemMap, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "skill_name_rus", this.d4Data.skillsNameMap, true);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "glyph_name_rus", this.d4Data.glyphNameMap, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "leg_node_name_rus", this.d4Data.legNodeMap, true);
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
        return `<div class="${className}" style="color:darkgray; font-size:15px;">${value}</div>`;
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
                    // aspect
                    if (tippyNode.querySelector("div.m-1tii5t")) {
                        const aspectNameNode = tippyNode.querySelector("p.m-foqf9j");
                        if (aspectNameNode) {
                            processor.aspectNameProcess(aspectNameNode);
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
                }
                else if (mutation.target.className === "m-187xuox") {
                    const typeNode = mutation.target.querySelector("div.m-1rhbarm");
                    if (typeNode) {
                        // leg node
                        if (typeNode.innerText === "Legendary Node") {
                            const legNodeNameNode = mutation.target.querySelector("p.m-1vrrnd3");
                            if (legNodeNameNode) {
                                processor.legNodeNameProcess(legNodeNameNode);
                            }
                        }
                    }
                }
            }
        }
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "aspect_name_rus", this.d4Data.aspectNameMap, true);
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "unq_name_rus", this.d4Data.unqItemMap, true) ||
               this.nodeProcess(node, "mif_name_rus", this.d4Data.mifItemMap, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "skill_name_rus", this.d4Data.skillsNameMap, true);
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
        return this.setNewValue(node, "glyph_name_rus", newValue, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "leg_node_name_rus", this.d4Data.legNodeMap, true);
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
        return `<div class="${className}" style="color:darkgray; font-size:15px;">${value}</div>`;
    }
}

(function() {
    'use strict';

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

function D4Data() {
    return new class D4Data {
        constructor() {
            // https://www.wowhead.com/diablo-4/aspects
            this.aspectNameMap = new Map(
                [
["Edgemaster's Aspect", "Аспект – гвардейский"],
["Aspect of Might", "Аспект мощи"],
["Aspect of Occult Dominion", "Аспект оккультной власти"],
["Aspect of Hardened Bones", "Аспект затвердевших костей"],
["Rapid Aspect", "Аспект – убыстряющий"],
["Aspect of Anger Management", "Аспект управления гневом"],
["Aspect of the Moonrise", "Аспект восхода луны"],
["Aspect of Concussive Strikes", "Аспект контузящих ударов"],
["Umbrous Aspect", "Аспект – сумеречный"],
["Blood Getter's Aspect", "Аспект – кровопускающий"],
["Aspect of Adaptability", "Аспект адаптации"],
["Unyielding Commander's Aspect", "Аспект – несгибаемый командирский"],
["Aspect of Grasping Veins", "Аспект цепких жил"],
["Hectic Aspect", "Аспект – суматошный"],
["Aspect of Frenzied Dead", "Аспект бешеных мертвецов"],
["Aspect of the Great Feast", "Аспект великого пира"],
["Aspect of Disobedience", "Аспект непослушания"],
["Aspect of Reanimation", "Аспект возрождения"],
["Blighted Aspect", "Аспект – зачумленный"],
["Undying Aspect", "Аспект – неумирающий"],
["Aspect of Creeping Death", "Аспект ползучей смерти"],
["Storm Swell Aspect", "Аспект – крепнущий грозовой"],
["Aspect of the Cursed Aura", "Аспект проклятой ауры"],
["Aspect of the Stampede", "Аспект панического бегства"],
["Dust Devil's Aspect", "Аспект – пыльный дьявольский"],
["Aspect of Inner Calm", "Аспект внутреннего покоя"],
["Bold Chieftain's Aspect", "Аспект – бравый командирский"],
["Aspect of the Expectant", "Аспект ожидания"],
["Aspect of Retribution", "Аспект воздаяния"],
["Coldclip Aspect", "Аспект – разящий холодом"],
["Shepherd's Aspect", "Аспект – пастырский"],
["Conceited Aspect", "Аспект – высокомерный"],
["Aspect of the Orange Herald", "Аспект рыжего вестника"],
["Aphotic Aspect", "Аспект – мглистый"],
["Frostbitten Aspect", "Аспект – обмороженный"],
["Aspect of Accursed Touch", "Аспект проклятого касания"],
["Aspect of Metamorphosis", "Аспект метаморфозы"],
["Juggernaut's Aspect", "Аспект – мощный"],
["Aspect of Fierce Winds", "Аспект яростных ветров"],
["Clandestine Aspect", "Аспект – Подполье"],
["Winter Touch Aspect", "Аспект – зимний"],
["Aspect of the Firebird", "Аспект жар-птицы"],
["Relentless Berserker's Aspect", "Аспект – безжалостно-берсеркский"],
["Shademist Aspect", "Аспект – затененный"],
["Ghostwalker Aspect", "Аспект – блуждающий в тенях"],
["Aspect of Numbing Wrath", "Аспект леденящего гнева"],
["Aspect of Elements", "Аспект стихий"],
["Devilish Aspect", "Аспект – сатанинский"],
["Steadfast Berserker's Aspect", "Аспект – крепкий берсерков"],
["Aspect of Retaliation", "Аспект расплаты"],
["Aspect of the Changeling's Debt", "Аспект долга мимикрида"],
["Aspect of the Calm Breeze", "Аспект спокойного дуновения"],
["Aspect of Control", "Аспект контроля"],
["Wind Striker Aspect", "Аспект – атакующий ветром"],
["Accelerating Aspect", "Аспект – скорый"],
["Spirit Bond Aspect", "Аспект – духовный"],
["Shockwave Aspect", "Аспект – взрывной"],
["Firestarter Aspect", "Аспект – зажигающий"],
["Aspect of Vocalized Empowerment", "Аспект громогласного усиления"],
["Aspect of the Alpha", "Аспект вожака стаи"],
["Aspect of the Ursine Horror", "Аспект кошмарного медведя"],
["Aspect of Serration", "Аспект зазубрин"],
["Aspect of the Crowded Sage", "Аспект осажденного мудреца"],
["Aspect of Corruption", "Аспект порчи"],
["Aspect of Berserk Ripping", "Аспект резни берсерка"],
["Everliving Aspect", "Аспект – вечноживущий"],
["Aspect of Noxious Ice", "Аспект отравленного льда"],
["Aspect of Branching Volleys", "Аспект веерного огня"],
["Aspect of Shared Misery", "Аспект общих страданий"],
["Aspect of Sly Steps", "Аспект вороватой поступи"],
["Rejuvenating Aspect", "Аспект – омолаживающий"],
["Executioner's Aspect", "Аспект – палаческий"],
["Wildbolt Aspect", "Аспект – ненастный"],
["Aspect of Shielding Storm", "Аспект щита ветров"],
["Splintering Aspect", "Аспект – рассекающий"],
["Jolting Aspect", "Аспект – встряхивающий"],
["High Velocity Aspect", "Аспект – скоростной"],
["Imprisoned Spirit's Aspect", "Аспект – пленяющий духов"],
["Requiem Aspect", "Аспект – заупокойный"],
["Aspect of True Sight", "Аспект истинного зрения"],
["Sacrificial Aspect", "Аспект – жертвенный"],
["Iron Blood Aspect", "Аспект – железнокровный"],
["Aspect of the Iron Warrior", "Аспект железного воина"],
["Aspect of Piercing Cold", "Аспект пронзающего холода"],
["Aspect of Torment", "Аспект мучения"],
["Blood Boiling Aspect", "Аспект – Кипящей крови"],
["Aspect of the Unsatiated", "Аспект неутолимости"],
["Aspect of the Prudent Heart", "Аспект крепкого сердца"],
["Aspect of Quicksand", "Аспект зыбучих песков"],
["Earthstriker's Aspect", "Аспект – сотрясающий землю"],
["Aspect of Elemental Acuity", "Аспект стихийного прозрения"],
["Aspect of the Fortress", "Аспект оплота"],
["Blood-bathed Aspect", "Аспект – выпотрошенный"],
["Lightning Dancer's Aspect", "Аспект – танцующий с молниями"],
["Aspect of Limitless Rage", "Аспект безграничной ярости"],
["Aspect of Iron Rain", "Аспект железного дождя"],
["Aspect of the Dark Dance", "Аспект темного танца"],
["Aspect of the Damned", "Аспект проклятых"],
["Sticker-thought Aspect", "Аспект – колкий"],
["Vengeful Aspect", "Аспект – злопамятный"],
["Aspect of Inevitable Fate", "Аспект неизбежной участи"],
["Flamethrower's Aspect", "Аспект – огнемечущий"],
["Glacial Aspect", "Аспект – ледниковый"],
["Aspect of Conflagration", "Аспект поджога"],
["Aspect of the Blurred Beast", "Аспект мелькающего зверя"],
["Windlasher Aspect", "Аспект – хлестающий ветром"],
["Mired Sharpshooter's  Aspect", "Аспект – погрязший стрелковый"],
["Aspect of Concentration", "Аспект сосредоточения"],
["Aspect of Berserk Fury", "Аспект ярости берсерка"],
["Aspect of the Umbral", "Аспект мрака"],
["Assimilation Aspect", "Аспект – обволакивающий"],
["Aspect of the Protector", "Аспект защитника"],
["Aspect of Bursting Venoms", "Аспект взрывающихся токсинов"],
["Aspect of the Unbroken Tether", "Аспект нерушимых уз"],
["Vigorous Aspect", "Аспект – энергетический"],
["Bladedancer's Aspect", "Аспект – танцующий с клинком"],
["Aspect of Encircling Blades", "Аспект окружающих клинков"],
["Aspect of the Trampled Earth", "Аспект утоптанной земли"],
["Raw Might Aspect", "Аспект – неоспоримый мощный"],
["Stormclaw's Aspect", "Аспект – разрывающий штормовой"],
["Repeating Aspect", "Аспект – пульсирующий"],
["Aspect of Giant Strides", "Аспект гигантских шагов"],
["Aspect of Creeping Mist", "Аспект ползучего тумана"],
["Gravitational Aspect", "Аспект – гравитации"],
["Trickshot Aspect", "Аспект – хитрый стрелковый"],
["Aspect of Natural Balance", "Аспект равновесия природы"],
["Aspect of Nebulous Brews", "Аспект бесформенных отваров"],
["Mage-Lord's Aspect", "Аспект – верховный магический"],
["Aspect of the Unholy Tether", "Аспект нечестивой связи"],
["Weapon Master's Aspect", "Аспект – высококлассный"],
["Hulking Aspect", "Аспект – громадный"],
["Lightning Rod Aspect", "Аспект – громоотводный"],
["Aspect of Arrow Storms", "Аспект бури стрел"],
["Aspect of The Aftershock", "Аспект подземного эха"],
["Aspect of Ultimate Shadow", "Аспект последней тени"],
["Ravenous Aspect", "Аспект – прожорливый"],
["Aspect of Tenuous Agility", "Аспект тревожной ловкости"],
["Galvanized Slasher's  Aspect", "Аспект – рассекающий энергией"],
["Aspect of Sundered Ground", "Аспект расколотой земли"],
["Needleflare Aspect", "Аспект – вспыхивающий иглами"],
["Aspect of Forward Momentum", "Аспект ускоряющего импульса"],
["Aspect of Ancestral Force", "Аспект силы предков"],
["Aspect of Decay", "Аспект распада"],
["Aspect of Engulfing Flames", "Аспект жадного пламени"],
["Exploiter's Aspect", "Аспект – эксплуатирующий"],
["Subterranean Aspect", "Аспект – подземный"],
["Symbiotic Aspect", "Аспект – симбиотический"],
["Moonrage Aspect", "Аспект – Лунная ярость"],
["Aspect of Explosive Mist", "Аспект взрывного тумана"],
["Aspect of the Rushing Wilds", "Аспект безудержной дикости"],
["Ravager's Aspect", "Аспект – разоряющий"],
["Stormchaser's Aspect", "Аспект – бегущий за штормом"],
["Prodigy's Aspect", "Аспект – гениальный"],
["Aspect of the Dire Whirlwind", "Аспект лютого вихря"],
["Aspect of Splintering Energy", "Аспект раскалывающейся энергии"],
["Aspect of Frozen Memories", "Аспект застывших воспоминаний"],
["Aspect of the Frozen Tundra", "Аспект мерзлой тундры"],
["Breakneck Bandit's Aspect", "Аспект – безудержный бандитский"],
["Aspect of Shredding Blades", "Аспект кромсающих клинков"],
["Aspect of Rathma's Chosen", "Аспект избранных Ратмы"],
["Frostblitz Aspect", "Аспект – пронизывающий холодом"],
["Blood-soaked Aspect", "Аспект – окровавленный"],
["Aspect of Fevered Mauling", "Аспект свирепой трепки"],
["Recharging Aspect", "Аспект – перезаряжаемый"],
["Snowguard's Aspect", "Аспект – снежный защитный"],
["Protecting Aspect", "Аспект – защищающий"],
["Slaking Aspect", "Аспект – гасящий"],
["Aspect of Cyclonic Force", "Аспект силы циклона"],
["Aspect of Volatile Shadows", "Аспект взрывных теней"],
["Nighthowler's Aspect", "Аспект – воющий в ночи"],
["Aspect of Bul-Kathos", "Аспект Бул-Катоса"],
["Aspect of Mending Stone", "Аспект укрепляющего камня"],
["Aspect of Gore Quills", "Аспект кровавых шипов"],
["Ballistic Aspect", "Аспект – баллистический"],
["Cadaverous Aspect", "Аспект – мертвенный"],
["Aspect of Encroaching Wrath", "Аспект подступающего гнева"],
["Energizing Aspect", "Аспект – наполняющий силой"],
["Starlight Aspect", "Аспект – звездный"],
["Aspect of Empowering Reaper", "Аспект могучего жнеца"],
["Earthquake Aspect", "Аспект – сейсмический"],
["Aspect of the Rampaging Werebeast", "Аспект буйного медведя"],
["Aspect of Binding Embers", "Аспект связующих углей"],
["Enshrouding Aspect", "Аспект – окутывающий"],
["Aspect of Voracious Rage", "Аспект ненасытной ярости"],
["Aspect of the Wildrage", "Аспект дикой ярости"],
["Aspect of Grasping Whirlwind", "Аспект цепкого ветра"],
["Snowveiled Aspect", "Аспект – заметенный"],
["Balanced Aspect", "Аспект – сбалансированный"],
["Aspect of Untimely Death", "Аспект скоропостижной кончины"],
["Tidal Aspect", "Аспект – приливный"],
["Seismic-shift Aspect", "Аспект – тектонический"],
["Trickster's Aspect", "Аспект – лживый"],
["Charged Aspect", "Аспект – заряженный"],
["Aspect of Frozen Orbit", "Аспект ледяного пути"],
["Aspect of Hungry Blood", "Аспект голодной крови"],
["Inexorable Reaper's Aspect", "Аспект – неумолимый жатвенный"],
["Elementalist's Aspect", "Аспект – стихийный"],
["Dire Wolf's Aspect", "Аспект – лютоволчий"],
["Mangler's Aspect", "Аспект – истязающий"],
["Virulent Aspect", "Аспект – заразный"],
["Aspect of Ancestral Charge", "Аспект натиска предков"],
["Aspect of Efficiency", "Аспект эффективности"],
["Aspect of the Frozen Wake", "Аспект морозной волны"],
["Blast-Trapper's Aspect", "Аспект – взрывной хватающий"],
["Aspect of Artful Initiative", "Аспект находчивого поступка"],
["Aspect of the Bounding Conduit", "Аспект отражающего проводника"],
["Crashstone Aspect", "Аспект – камнедробящий"],
["Aspect of the Relentless Armsmaster", "Аспект неутомимого мастера оружия"],
["Aspect of Nature's Savagery", "Аспект безжалостной природы"],
["Runeworker's Conduit Aspect", "Аспект – рунный заряженный"],
["Skinwalker's Aspect", "Аспект – переменчивый"],
["Aspect of the Void", "Аспект пустоты"],
["Shattered Spirit's Aspect", "Аспект – призрачный осколочный"],
["Wanton Rupture Aspect", "Аспект – безудержно разрывающий"],
["Aspect of Fortune", "Аспект фортуны"],
["Craven Aspect", "Аспект – пугающий"],
["Aspect of Burning Rage", "Аспект огненной ярости"],
["Incendiary Aspect", "Аспект – воспламеняющий"],
["Aspect of Frosty Strides", "Аспект морозных шагов"],
["Aspect of Bursting Bones", "Аспект взрывающихся костей"],
["Aspect of Ancestral Echoes", "Аспект эха предков"],
["Death Wish Aspect", "Аспект – смертельный"],
["Aspect of Elusive Menace", "Аспект неуловимой угрозы"],
["Veteran Brawler's Aspect", "Аспект – старый бойцовский"],
["Aspect of Metamorphic Stone", "Аспект преображающего камня"],
["Torturous Aspect", "Аспект – пытающий"],
["Aspect of Singed Extremities", "Аспект обожженных ног"],
["Coldbringer's Aspect", "Аспект – хладоносный"],
["Serpentine Aspect", "Аспект – Зигзаг"],
["Aspect of Pestilent Points", "Аспект ядовитого укола"],
["Aspect of Slaughter", "Аспект резни"],
["Aspect of Ancient Flame", "Аспект древнего пламени"],
["Aspect of the Tempest", "Аспект бури"],
["Overcharged Aspect", "Аспект – перегруженный"],
["Aspect of Tempering Blows", "Аспект закаляющих ударов"],
["Aspect of Stolen Vigor", "Аспект украденной бодрости"],
["Shadowslicer Aspect", "Аспект – рвущийся из тьмы"],
["Aspect of Audacity", "Аспект дерзости"],
["Aspect of Overwhelming Currents", "Аспект неодолимого течения"],
["Aspect of Plunging Darkness", "Аспект глубокой тьмы"],
["Aspect of Swelling Curse", "Аспект нарастающего проклятия"],
["Aspect of Surprise", "Аспект непредсказуемости"],
["Icy Alchemist's Aspect", "Аспект – ледяной алхимический"],
["Aspect of the Embalmer", "Аспект бальзамировщика"],
["Blood Seeker's Aspect", "Аспект – кровавого охотника"],
["Aspect of Exposed Flesh", "Аспект обнаженной плоти"],
["Aspect of Shattered Stars", "Аспект расколотых звезд"],
["Aspect of Imitated Imbuement", "Аспект отраженного насыщения"],
["Bear Clan Berserker's Aspect", "Аспект – медвежий берсерков"],
["Aspect of Potent Blood", "Аспект крови силы"],
["Osseous Gale Aspect", "Аспект – штормокостный"],
["Smiting Aspect", "Аспект – карательный"],
["Resistant Assailant's Aspect", "Аспект – стойкий атакующий"],
["Cheat's Aspect", "Аспект – трюкаческий"],
["Stormshifter's Aspect", "Аспект – изменчивый штормовой"],
["Aspect of the Long Shadow", "Аспект длинной тени"],
["Aspect of Quickening Fog", "Аспект ускоряющего тумана"],
["Toxic Alchemist's Aspect", "Аспект – ядовитый алхимический"],
["Aspect of Explosive Verve", "Аспект взрывной яркости"],
["Flesh-Rending Aspect", "Аспект – кромсающий плоть"],
["Rotting Aspect", "Аспект – гнилой"],
["Aspect of the Deflecting Barrier", "Аспект отражающего барьера"],
["Opportunist's Aspect", "Аспект – авантюристский"],
["Mangled Aspect", "Аспект – изувеченный"],
["Aspect of Armageddon", "Аспект конца света"],
["Aspect of Uncanny Treachery", "Аспект омерзительной измены"],
["Fastblood Aspect", "Аспект – живокровный"],
["Aspect of Three Curses", "Аспект трех проклятий"],
["Aspect of Piercing Static", "Аспект пронзающего тока"],
["Brawler's Aspect", "Аспект – бойцовский"],
["Mighty Storm's Aspect", "Аспект – бушующий"],
["Aspect of Searing Wards", "Аспект пылающей преграды"],
["Aspect of Synergy", "Аспект взаимосвязи"],
["Flamewalker's Aspect", "Аспект – идущий в пламени"],
["Encased Aspect", "Аспект – заключенный"],
["Battle Caster's Aspect", "Аспект – боевой магический"],
["Stable Aspect", "Аспект – бурлящий"],
["Shattered Aspect", "Аспект – разбитый"],
["Snap Frozen Aspect", "Аспект – сковывающий морозом"],
["Aspect of Abundant Energy", "Аспект обильной энергии"],
["Aspect of the Dark Howl", "Аспект темного воя"],
["Aspect of Unstable Imbuements", "Аспект нестабильных усилений"],
["Aspect of Cruel Sustenance", "Аспект безжалостной жатвы"],
["Battle-Mad Aspect", "Аспект – ярый"],
["Aspect of the Unwavering", "Аспект непоколебимости"],
["Infiltrator's Aspect", "Аспект – диверсантский"],
["Aspect of Biting Cold", "Аспект жгучего холода"],
["Aspect of Tenuous Destruction", "Аспект тревожного разрушения"],
["Aspect of Perpetual Stomping", "Аспект непрерывного топота"],
["Eluding Aspect", "Аспект – ускользающий"],
["Earthguard Aspect", "Аспект – защищенный землей"],
["Aspect of Lethal Dusk", "Аспект смертельного полумрака"],
["Skullbreaker's Aspect", "Аспект – костоломный"],
["Luckbringer Aspect", "Аспект – приносящий удачу"],
["Aspect of Anemia", "Аспект анемии"],
["Aspect of Siphoned Victuals", "Аспект похищенной провизии"],
["Escape Artist's Aspect", "Аспект – обеспечивающий побег"],
                ]);

            // https://www.wowhead.com/diablo-4/items/quality:6
            this.unqItemMap = new Map(
                [
["Shard of Verathiel", "Осколок Вератиэль"],
["Crown of Lucion", "Корона Люсиона"],
["The Umbracrux", "Умбракрукс"],
["Tibault's Will", "Воля Тибо"],
["Axial Conduit", "Осевой проводник"],
["Godslayer Crown", "Корона богоубийцы"],
["Paingorger's Gauntlets", "Рукавицы упоения болью"],
["Banished Lord's Talisman", "Талисман лорда-изгнанника"],
["Blood Moon Breeches", "Брюки кровавой луны"],
["Scoundrel's Kiss", "Поцелуй негодяя"],
["Tal Rasha's Iridescent Loop", "Переливчатое кольцо Тал Раши"],
["Ring of the Sacrilegious Soul", "Кольцо богохульного духа"],
["Tempest Roar", "Рев бури"],
["Fractured Winterglass", "Расколотый хрусталь зимы"],
["Path of Trag'Oul", "Путь Траг'ула"],
["Flickerstep", "Искроступы"],
["Temerity", "Дерзание"],
["Ring of Mendeln", "Кольцо Мендельна"],
["Locran's Talisman", "Талисман Локрана"],
["Razorplate", "Бритвенная броня"],
["Rage of Harrogath", "Ярость Харрогата"],
["Esu's Heirloom", "Фамильное наследие Эсу"],
["Rakanoth's Wake", "Дозор Раканот"],
["Raiment of the Infinite", "Облачение бесконечности"],
["Ramaladni's Magnum Opus", "Шедевр Рамаладни"],
["Lidless Wall", "Недремлющий защитник"],
["Yen's Blessing", "Благословение Йен"],
["X'Fal's Corroded Signet", "Ржавая печатка З'фала"],
["Azurewrath", "Лазурная ярость"],
["Fists of Fate", "Кулаки судьбы"],
["Shroud of Khanduras", "Покров из Хандараса"],
["Flameweaver", "Ткач пламени"],
["Björnfang's Tusks", "Клыки Бьорнфанга"],
["Tuskhelm of Joritz the Mighty", "Клыкастый шлем Йорица Могучего"],
["Storm's Companion", "Спутник бури"],
["The Third Blade", "Третий клинок"],
["Wildheart Hunger", "Голод дикого сердца"],
["Mad Wolf's Glee", "Ликование безумного волка"],
["Ebonpiercer", "Черношип"],
["Deathless Visage", "Лик бессмертия"],
["Black River", "Черная река"],
["Insatiable Fury", "Ненасытная ярость"],
["The Basilisk", "Василиск"],
["Howl from Below", "Вой из глубин"],
["Unsung Ascetic's Wraps", "Повязки невоспетого аскета"],
["Soulbrand", "Клеймитель душ"],
["Vox Omnium", "Общий голос"],
["Blue Rose", "Синяя роза"],
["Overkill", "Беспредельная мощь"],
["The Oculus", "Око"],
["Condemnation", "Осуждение"],
["Mother's Embrace", "Объятия Матери"],
["The Mortacrux", "Мортакрукс"],
["Starfall Coronet", "Диадема упавшей звезды"],
["Hunter's Zenith", "Охотничий зенит"],
["Cowl of the Nameless", "Клобук Безымянного"],
["Cruor's Embrace", "Объятия Круора"],
["Greatstaff of the Crone", "Великий посох старой ведуньи"],
["Tassets of the Dawning Sky", "Набедренные щитки рассвета"],
["Vasily's Prayer", "Молитва Василия"],
["Bloodless Scream", "Бескровный крик"],
["Waxing Gibbous", "Растущая луна"],
["Shard of Verathiel / The Third Blade", "Осколок Вератиэль / Третий клинок"],
["Staff of Endless Rage", "Посох бесконечного неистовства"],
["Flamescar", "Обожженный шрам"],
["Penitent Greaves", "Наголенники покаяния"],
["Arreat's Bearing", "Завет Арреат"],
["Endurant Faith", "Стойкая вера"],
["Word of Hakan", "Слово Хакана"],
["Esadora's Overflowing Cameo", "Переполненная камея Эсадоры"],
["Hellhammer", "Адский молот"],
["Gloves of the Illuminator", "Перчатки проповедника"],
["Skyhunter", "Небесный охотник"],
["Greaves of the Empty Tomb", "Наголенники пустой гробницы"],
["Saboteur's Signet", "Печатка диверсанта"],
["Unbroken Chain", "Неразорванная цепь"],
["Airidah's Inexorable Will", "Непоколебимая воля Айриды"],
["Ring of the Ravenous", "Кольцо ненасытных"],
["Windforce", "Сила ветра"],
["Ring of Red Furor", "Кольцо алой ярости"],
["Gohr's Devastating Grips", "Захваты Гора-разорителя"],
["Fields of Crimson", "Багряные поля"],
["Dolmen Stone", "Камень дольмена"],
["Frostburn", "Обжигающий холод"],
["Twin Strikes", "Два удара"],
["Scoundrel's Leathers", "Кожаные обмотки негодяя"],
["Deathspeaker's Pendant", "Подвеска Вестника Смерти"],
["Earthbreaker", "Землекрушитель"],
["Iceheart Brais", "Нагрудник ледяного сердца"],
["Asheara's Khanjar", "Ханджар Аширы"],
["Writhing Band of Trickery", "Верткий перстень ловкача"],
["Ancients' Oath", "Клятва Древних"],
["Highest Honors of the Iron Wolves", "Высшая награда Стальных Волков"],
["Grasp of Shadow", "Хватка тени"],
["Mutilator Plate", "Латы изувера"],
["Battle Trance", "Упоение боем"],
["The Butcher's Cleaver", "Тесак Мясника"],
["Yen's Blessing", "Благословение Йен"],
["Fleshrender", "Плотерез"],
["Eyes in the Dark", "Глаза в темноте"],
["Blood Artisan's Cuirass", "Кираса кровавого мастера"],
["The Mortacrux / The Umbracrux", "Мортакрукс / Умбракрукс"],
["Beastfall Boots", "Сапоги павшего зверя"],
["Staff of Lam Esen", "Посох Лам Эсена"],
["100,000 Steps", "100 000 шагов"],
["Eaglehorn", "Орлиный рог"],
["Destroyer's Equipment Cache", "Сундук снаряжения разрушителя"],
["Traces of the Maiden", "Следы Девы"],
["Slayer's Equipment Cache", "Сундук снаряжения убийцы"],
["Champion's Equipment Cache", "Сундук снаряжения чемпиона"],
["Iron Wolves' Final Harvest", "Последний урожай Стальных Волков"],
["Slayer's Equipment Cache", "Сундук снаряжения убийцы"],
["Vox Omnium / The Basilisk", "Общий голос / Василиск"],
["Iron Wolves' Heroic Spoils", "Героические трофеи Стальных Волков"],
["Cages of Hubris", "Клетки гордыни"],
["[WIP] Eye of the Depths", "[WIP] Eye of the Depths"],
["Traces of the Maiden", "Следы Девы"],
["[PH]Godslayer Crown", "[PH]Godslayer Crown"],
["Destroyer's Equipment Cache", "Сундук снаряжения разрушителя"],
["Glimmering Herb Supply", "Мерцающий запас трав"],
["Iron Wolves' Heroic Spoils", "Героические трофеи Стальных Волков"],
["Champion's Equipment Cache", "Сундук снаряжения чемпиона"],
["Bloodforged Sigil", "Кровокованная печать"],
["Highest Honors of the Iron Wolves", "Высшая награда Стальных Волков"],
["Eternal Journey Chapter 2 Cache", "Сундук за 2 главу Вечного пути"],
["New Item [PH]", "New Item [PH]"],
["[PH]", "[PH]"],
["Boost Dagger", "Усиленный кинжал"],
["Cages of Hubris", "Клетки гордыни"],
["Eternal Journey Chapter 9 Cache", "Сундук за 9 главу Вечного пути"],
["Chapter 1 Reward Cache", "Сундук с наградами 1-й главы"],
["[PH] Unique Necro 98", "[PH] Unique Necro 98"],
["Boost Pants", "Усиленные штаны"],
["Pact Amulet", "Контрактный амулет"],
["[PH] Unique Sorc Helm 99", "[PH] Unique Sorc Helm 99"],
["[PH]", "[PH]"],
["[PH] Grab Bag Variant Helm1", "[PH] Grab Bag Variant Helm1"],
["[PH] Barb uniq 99 pants", "[PH] Barb uniq 99 pants"],
["[PH] BSK Upgrade", "[PH] BSK Upgrade"],
["Iron Wolves' Final Harvest", "Последний урожай Стальных Волков"],
["Boost Helm", "Усиленный шлем"],
["-", "-"],
["-", "-"],
["Glimmering Herb Supply", "Мерцающий запас трав"],
["-", "-"],
["-", "-"],
["-", "-"],
["Boost Scythe", "Усиленная коса"],
["Chapter 2 Reward Cache", "Сундук с наградами 2-й главы"],
["Rusty Heirloom Dagger", "Ржавый наследный кинжал"],
["[PH] Unique Helm 95", "[PH] Unique Helm 95"],
["Eternal Journey Chapter 3 Cache", "Сундук за 3 главу Вечного пути"],
["Eternal Journey Chapter 4 Cache", "Сундук за 4 главу Вечного пути"],
["[PH] Unique 99 Gloves", "[PH] Unique 99 Gloves"],
["Triune Strongbox of Endurant Faith", "Сейф Церкви Трех со &quot;Стойкой верой&quot;"],
["Eternal Journey Chapter 5 Cache", "Сундук за 5 главу Вечного пути"],
["Tuning Stone: Evernight", "Камень отладки: вечная ночь"],
["Eternal Journey Chapter 6 Cache", "Сундук за 6 главу Вечного пути"],
["Tuning Stone: Genesis", "Камень отладки: генезис"],
["Eternal Journey Chapter 7 Cache", "Сундук за 7 главу Вечного пути"],
["Eternal Journey Chapter 8 Cache", "Сундук за 8 главу Вечного пути"],
["Hateshard Core", "Hateshard Core"],
["Something Super Cool", "Something Super Cool"],
["Boost Staff", "Усиленный посох"],
["Icy Rib", "Ледяное ребро"],
["[PH] Unique Barb Gloves 99", "[PH] Unique Barb Gloves 99"],
["[PH]", "[PH]"],
["Mjölnic Ryng", "Кольцо Мьельнир"],
                ]);

            // https://www.wowhead.com/diablo-4/items/quality:8
            this.mifItemMap = new Map(
                [
["Harlequin Crest", "Шутовской гребень"],
["Ring of Starless Skies", "Кольцо беззвездных небес"],
["Tyrael's Might", "Мощь Тираэля"],
["Andariel's Visage", "Лик Андариэль"],
["The Grandfather", "Предок"],
["Doombringer", "Вестник рока"],
["Resplendent Spark", "Ослепительная искра"],
["Melted Heart of Selig", "Расплавленное сердце Селига"],
["Ahavarion, Spear of Lycander", "Аварион, копье Ликандер"],
["Greater Triune Arms Cache", "Сундук Трех с мощным оружием"],
                ]);

            // https://www.wowhead.com/diablo-4/paragon-glyphs
            this.glyphNameMap = new Map(
                [
["Rumble", "Рокот"],
["Exploit", "Уловка"],
["Werebear", "Облик медведя"],
["Marshal", "Судья"],
["Fang and Claw", "Клыки и когти"],
["Elementalist", "Стихии"],
["Ire", "Праведный гнев"],
["Twister", "Ураган"],
["Deadraiser", "Воскрешатель"],
["Werewolf", "Облик волка"],
["Undaunted", "Бесстрашие"],
["Corporeal", "Телесность"],
["Canny", "Благоразумие"],
["Outmatch", "Превосходство"],
["Territorial", "Защита границ"],
["Tears of Blood", "Кровавые слезы"],
["Sacrificial", "Жертвоприношение"],
["Amplify", "Усиление"],
["Desecration", "Осквернение"],
["Might", "Мощь"],
["Electrocution", "Удар током"],
["Disembowel", "Потрошение"],
["Executioner", "Палач"],
["Dominate", "Подчинение"],
["Wrath", "Гнев"],
["Control", "Контроль"],
["Flamefeeder", "Питающее пламя"],
["Ambidextrous", "Амбидекстр"],
["Exploit", "Уловка"],
["Reinforced", "Бастион"],
["Bane", "Бич"],
["Scourge", "Плеть"],
["Essence", "Эссенция"],
["Unleash", "Воля"],
["Pyromaniac", "Пироманьяк"],
["Exhumation", "Эксгумация"],
["Earth and Sky", "Земля и небо"],
["Human", "Человек"],
["Darkness", "Тьма"],
["Dominate", "Подчинение"],
["Brawl", "Потасовка"],
["Crusher", "Крушитель"],
["Bloodfeeder", "Питающая кровь"],
["Mortal Draw", "Смертельное натяжение"],
["Enchanter", "Чары"],
["Turf", "Почва"],
["Imbiber", "Вкушение"],
["Devious", "Хитрость"],
["Combat", "Бой"],
["Pride", "Гордыня"],
["Diminish", "Снижение"],
["Seething", "Возмущение"],
["Control", "Контроль"],
["Gravekeeper", "Могильщик"],
["Explosive", "Взрывчатка"],
["Spirit", "Дух"],
["Closer", "Сближение"],
["Chip", "Обломок"],
["Destruction", "Разрушение"],
["Undaunted", "Бесстрашие"],
["Keeper", "Хранитель"],
["Golem", "Голем"],
["Fulminate", "Сверкание"],
["Invocation", "Воззвание"],
["Skill", "Умение"],
["Fluidity", "Текучесть"],
["Wisdom", "Мудрость"],
["Mage", "Маг"],
["Adept", "Мастер"],
["Ambush", "Засада"],
["Protector", "Защитник"],
["Subdue", "Усмирение"],
["Frostbite", "Обморожение"],
["Resolve", "Непоколебимость"],
["Revenge", "Мщение"],
["Ranger", "Странник"],
["Cleaver", "Тесак"],
["Infusion", "Насыщение"],
["Warding", "Оберег"],
["Stalagmite", "Сталагмит"],
["Weapon Master", "Мастер оружия"],
["Abyssal", "Бездна"],
["Conjurer", "Чаротворец"],
["Tactician", "Тактик"],
["Torch", "Факел"],
["Revenge", "Мщение"],
["Slayer", "Истребитель"],
["Efficacy", "Эффективность"],
["Slayer", "Истребитель"],
["Tracker", "Следопыт"],
["Control", "Контроль"],
["Tracker", "Следопыт"],
["Ruin", "Крах"],
["Exploit", "Уловка"],
["Blood-drinker", "Кровопийца"],
["Nightstalker", "Ночной охотник"],
["Snare", "Капкан"],
["-", "-"],
["Winter", "Зима"],
["Electrocute", "Электрошок"],
["Versatility", "Универсальность"],
["Charged", "Заряд"],
["Frostfeeder", "Питающий лед"],
["Wilds", "Дикая природа"],
["Impairment", "Сковывание"],
["Overwhelm", "Яростный натиск"],
["Warrior", "Воин"],
["Impairment", "Сковывание"],
["Overwhelm", "Яростный натиск"],
["Poise", "Самообладание"],
["Dominate", "Подчинение"],
["Guzzler", "Обжора"],
["Battle-hardened", "Боевая закалка"],
["Tectonic", "Движение земли"],
["Overwhelm", "Яростный натиск"],
["Ruin", "Крах"],
["Subdue", "Усмирение"],
["Battle-hardened", "Боевая закалка"],
["Battle-hardened", "Боевая закалка"],
["Slayer", "Истребитель"],
["Impairment", "Сковывание"],
["Overwhelm", "Яростный натиск"],
["Shapeshifter", "Оборотень"],
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
            this.legNodeMap = new Map(
                [
["Blood Rage", "Кровавая ярость"],
["Burning Instinct", "Пылающий инстинкт"],
["Wither", "Иссушение"],
["Exploit Weakness", "Игра на слабостях"],
["Cult Leader", "Глава культа"],
["Flesh-eater", "Пожирание плоти"],
["Hemorrhage", "Кровоизлияние"],
["Leyrana's Instinct", "Инстинкт Лейраны"],
["Thunderstruck", "Громовой молот"],
["Blood Begets Blood", "Кровь рождает кровь"],
["Bone Graft", "Пересаженная кость"],
["Elemental Summoner", "Призыватель стихий"],
["Ceaseless Conduit", "Бесконечный проводник"],
["No Witnesses", "Никаких свидетелей"],
["Bloodbath", "Кровавая баня"],
["Frigid Fate", "Смерть во льдах"],
["Constricting Tendrils", "Щупальца-душители"],
["Warbringer", "Разжигатель войны"],
["Carnage", "Расправа"],
["Decimator", "Дециматор"],
["Eldritch Bounty", "Потусторонний дар"],
["Searing Heat", "Опаляющий жар"],
["Icefall", "Ледопад"],
["Enchantment Master", "Мастер чар"],
["Tricks of the Trade", "Профессиональные приемы"],
["Survival Instincts", "Инстинкты выживания"],
["Earthen Devastation", "Земляное уничтожение"],
["Inner Beast", "Внутренний зверь"],
["Flawless Technique", "Безупречная техника"],
["Scent of Death", "Запах смерти"],
["Ancestral Guidance", "Наставление предков"],
["Bone Breaker", "Костолом"],
["Cheap Shot", "Грязный прием"],
["Static Surge", "Всплеск энергии"],
["Hulking Monstrosity", "Исполинское чудовище"],
["Heightened Malice", "Необычайная злоба"],
["Deadly Ambush", "Смертельная засада"],
["Cunning Stratagem", "Хитрый маневр"],
["Weapons Master", "Мастерское владение оружием"],
["Lust for Carnage", "Жажда насилия"],
["Natural Leader", "Прирожденный лидер"],
                ]);

            // https://www.wowhead.com/diablo-4/skills
            this.skillsNameMap = new Map(
                [
["Heartseeker", "Пронзатель сердец"],
["Dark Shroud", "Теневая завеса"],
["Flurry", "Шквал"],
["Shadow Step", "Шаг сквозь тень"],
["Dash", "Рывок"],
["Puncture", "Колющий удар"],
["Bash", "Сокрушающий удар"],
["Unstable Elixirs", "Опасные эликсиры"],
["Corpse Explosion", "Взрыв трупа"],
["Barrage", "Шквальный огонь"],
["Caltrops", "Шипы"],
["Corpse Tendrils", "Трупные щупальца"],
["Poison Creeper", "Ядовитая лоза"],
["Raise Skeleton", "Призыв скелета"],
["Decrepify", "Немощь"],
["Blood Howl", "Кровавый вой"],
["Spark", "Искра"],
["Wind Shear", "Ветрорез"],
["Shadow Imbuement", "Насыщение тенью"],
["Bone Spirit", "Костяной дух"],
["Blood Mist", "Кровавый туман"],
["Frenzy", "Бешенство"],
["Smoke Grenade", "Ослепляющий дым"],
["Rallying Cry", "Воодушевляющий клич"],
["Ravens", "Вороны"],
["Victimize", "Жестокая расправа"],
["Grizzly Rage", "Ярость гризли"],
["Weapon Mastery", "Мастер оружия"],
["Teleport", "Телепортация"],
["Concealment", "Маскировка"],
["Rupture", "Разрыв"],
["Frozen Orb", "Морозная сфера"],
["Poison Imbuement", "Насыщение ядом"],
["Wolves", "Волки"],
["Chain Lightning", "Цепная молния"],
["Pulverize", "Сокрушение"],
["Lightning Spear", "Электрическое копье"],
["Claw", "Удар когтями"],
["Blood Surge", "Волнение крови"],
["Iron Maiden", "Железная дева"],
["Cold Imbuement", "Насыщение холодом"],
["Frigid Finesse", "Ледяная точность"],
["Rapid Fire", "Скоростная стрельба"],
["Penetrating Shot", "Пробивающий выстрел"],
["Maul", "Трепка"],
["Close Quarters Combat", "Ближний бой"],
["Steel Grasp", "Железная хватка"],
["Reap", "Жатва"],
["Rabies", "Звериное бешенство"],
["Hemorrhage", "Кровоизлияние"],
["Bone Prison", "Костяная тюрьма"],
["Flame Shield", "Пламенный щит"],
["Exploit", "Уловка"],
["Twisting Blades", "Вонзающиеся клинки"],
["Trample", "Тяжелый шаг"],
["Blight", "Тлен"],
["Cataclysm", "Катаклизм"],
["Lightning Storm", "Грозовой шторм"],
["Rain of Arrows", "Град стрел"],
["Golem", "Голем"],
["Flay", "Свежевание"],
["Storm Strike", "Удар бури"],
["Malice", "Злоба"],
["Lunging Strike", "Выпад"],
["Gushing Wounds", "Кровоточащие раны"],
["Hurricane", "Ураган"],
["Debilitating Roar", "Изнуряющий рев"],
["Fire Bolt", "Стрела огня"],
["Shadowblight", "Чума тьмы"],
["Challenging Shout", "Подстрекающий крик"],
["Ursine Strength", "Медвежья сила"],
["Double Swing", "Двойной удар"],
["Fireball", "Огненный шар"],
["War Cry", "Воинственный клич"],
["Trick Attacks", "Коварные удары"],
["Shred", "Разрывание"],
["Poison Trap", "Ловушка с ядом"],
["Frost Nova", "Кольцо льда"],
["Whirlwind", "Вихрь"],
["Hydra", "Гидра"],
["Unconstrained", "Неудержимая сила"],
["Boulder", "Глыба"],
["Petrify", "Окаменение"],
["Ice Armor", "Ледяной доспех"],
["Imposing Presence", "Довлеющее присутствие"],
["Bone Splinters", "Костяные осколки"],
["Forceful Arrow", "Стрела силы"],
["Earthen Bulwark", "Земляной бастион"],
["Incinerate", "Испепеление"],
["Bestial Rampage", "Звериное буйство"],
["Landslide", "Оползень"],
["Ice Blades", "Ледяные клинки"],
["Ossified Essence", "Окостеневшая эссенция"],
["Iron Maelstrom", "Круговорот стали"],
["Invigorating Strike", "Живительный удар"],
["Unstable Currents", "Бурный поток"],
["Wrath of the Berserker", "Гнев берсерка"],
["Overflowing Energy", "Неудержимая энергия"],
["Bone Storm", "Буря костей"],
["Arc Lash", "Грозовая плеть"],
["Precision", "Точность"],
["Charge", "Натиск"],
["Upheaval", "Выброс земли"],
["Decompose", "Распад"],
["Esu's Ferocity", "Свирепость Эсу"],
["Iron Skin", "Железная кожа"],
["Firewall", "Стена огня"],
["Hammer of the Ancients", "Молот Древних"],
["Hewed Flesh", "Обрезки плоти"],
["Army of the Dead", "Армия мертвецов"],
["Sturdy", "Прочность"],
["Vyr's Mastery", "Мастерство Выра"],
["Cyclone Armor", "Ураганный доспех"],
["Shadow Clone", "Темное отражение"],
["Bone Spear", "Костяное копье"],
["Momentum", "Импульс"],
["Heavy Handed", "Тяжелая рука"],
["Shatter", "Раскалывание"],
["Earth Spike", "Шип земли"],
["Agile", "Изворотливость"],
["Blade Shift", "Блуждающий клинок"],
["Pit Fighter", "Боец арены"],
["Death Trap", "Смертоносная ловушка"],
["Sever", "Отсечение"],
["Quickshift", "Быстрое преображение"],
["Lupine Ferocity", "Волчья свирепость"],
["Rapid Ossification", "Быстрое окостенение"],
["Innervation", "Прилив энергии"],
["Siphoning Strikes", "Вытягивающие удары"],
["Lacerate", "Раздирание"],
["Tornado", "Смерч"],
["Charged Bolts", "Электрические разряды"],
["Digitigrade Gait", "Прыть пальцеходящих"],
["Hellbent Commander", "Одержимый командир"],
["Wild Impulses", "Дикие инстинкты"],
["Precision Imbuement", "Прицельное насыщение"],
["Haste", "Спешка"],
["Concussion", "Контузия"],
["Blizzard", "Снежная буря"],
["Ball Lightning", "Шаровая молния"],
["Frost Bolt", "Ледяная стрела"],
["Stutter Step", "Перебежка"],
["Rend", "Рваные раны"],
["Aftermath", "Итог"],
["Ground Stomp", "Топот"],
["Defiance", "Непокорность"],
["Envenom", "Наполнение ядом"],
["Toxic Claws", "Ядовитые когти"],
["Ice Shards", "Осколки льда"],
["Endless Tempest", "Нескончаемый ураган"],
["Blood Lance", "Окровавленное копье"],
["Adrenaline Rush", "Выброс адреналина"],
["Kick", "Удар ногой"],
["Death Blow", "Смертельный удар"],
["Impetus", "Сила движения"],
["Nature's Resolve", "Стойкость природы"],
["Rathma's Vigor", "Бодрость Ратмы"],
["Leap", "Прыжок"],
["Clarity", "Ясность"],
["Elemental Dominance", "Власть над стихиями"],
["Call of the Ancients", "Зов Древних"],
["Conjuration Mastery", "Мастер колдовства"],
["Rapid Gambits", "Быстрые хитрости"],
["Heightened Senses", "Обостренные чувства"],
["Nature's Fury", "Гнев природы"],
["Amplify Damage", "Усиление урона"],
["Evulsion", "Искоренение"],
["Shadow Crash", "Теневое сокрушение"],
["Resonance", "Резонанс"],
["Slaying Strike", "Разящий удар"],
["Crushing Earth", "Сокрушающая земля"],
["Invigorating Conduit", "Бодрящий проводник"],
["Abundance", "Изобилие"],
["Kalan's Edict", "Эдикт Калана"],
["Deep Freeze", "Глубокая заморозка"],
["Heart of the Wild", "Сердце дикой природы"],
["Ancestral Fortitude", "Стойкость предков"],
["Natural Disaster", "Природная катастрофа"],
["Warmth", "Тепло"],
["Second Wind", "Второе дыхание"],
["Spiked Armor", "Шипастый доспех"],
["Defensive Posture", "Защитная стойка"],
["Aggressive Resistance", "Яростное сопротивление"],
["Tough as Nails", "Шипастый щит"],
["Rugged", "Двужильность"],
["Fueled by Death", "Смерть придает силы"],
["Cut to the Bone", "Порез до кости"],
["Circle of Life", "Круг жизни"],
["Neurotoxin", "Нейротоксин"],
["Fiery Surge", "Вспышка огня"],
["Glass Cannon", "Хрупкий разрушитель"],
["Potent Warding", "Надежные обереги"],
["Alchemical Advantage", "Польза алхимии"],
["Coalesced Blood", "Сгусток крови"],
["Gloom", "Сумрак"],
["Combustion", "Возгорание"],
["Counteroffensive", "Контрнаступление"],
["Defensive Stance", "Защитная позиция"],
["Consuming Shadows", "Поглощающие теней"],
["Serration", "Зазубрины"],
["Blood Wave", "Кровавая волна"],
["Raid Leader", "Лидер рейда"],
["Guttural Yell", "Утробный рев"],
["Unliving Energy", "Неживая энергия"],
["Pressure Point", "Уязвимая точка"],
["Martial Vigor", "Боевой азарт"],
["Devouring Blaze", "Всепоглощающее пламя"],
["Call of the Wild", "Зов дикой природы"],
["Predatory Instinct", "Инстинкт хищника"],
["Inferno", "Инферно"],
["Grim Harvest", "Мрачный урожай"],
["Static Discharge", "Статический разряд"],
["Deadly Venom", "Смертельный яд"],
["Walking Arsenal", "Живой арсенал"],
["Death's Embrace", "Объятия смерти"],
["Exposure", "Вредное воздействие"],
["Convulsions", "Конвульсии"],
["Alchemist's Fortune", "Удача алхимика"],
["Elemental Exposure", "Сила стихий"],
["Nature's Reach", "Власть природы"],
["Stone Guard", "Каменный страж"],
["Skeletal Mage Mastery", "Мастер скелетов-магов"],
["Coursing Currents", "Текучие потоки"],
["Cold Front", "Холодный фронт"],
["Unbridled Rage", "Необузданная свирепость"],
["Tides of Blood", "Волны крови"],
["Golem Mastery", "Мастер големов"],
["Perfect Storm", "Буря в разгаре"],
["Necrotic Carapace", "Некротический панцирь"],
["Brute Force", "Грубая сила"],
["Reaper's Pursuit", "Преследующий жнец"],
["Charged Atmosphere", "Атмосферное напряжение"],
["Iron Fur", "Железный мех"],
["Earthen Might", "Мощь земли"],
["Shocking Impact", "Импульс шока"],
["Safeguard", "Защитные меры"],
["Soulfire", "Ожог души"],
["Wallop", "Разгром"],
["Inspiring Leader", "Пример для подражания"],
["Provocation", "Провокация"],
["Inner Flames", "Внутреннее пламя"],
["Death's Defense", "Защита смерти"],
["Drain Vitality", "Иссушение жизненной силы"],
["Hamstring", "Подрезание сухожилий"],
["Electric Shock", "Электрошок"],
["Crippling Darkness", "Жестокая тьма"],
["Natural Fortitude", "Природная выносливость"],
["Elemental Attunement", "Единство со стихиями"],
["Outburst", "Вспышка гнева"],
["Meteor", "Метеорит"],
["Trap Mastery", "Мастер ловушек"],
["Skeletal Warrior Mastery", "Мастер скелетов-воинов"],
["Devastation", "Опустошение"],
["Vigilance", "Бдительность"],
["Compound Fracture", "Сложный перелом"],
["Imperfectly Balanced", "Хрупкий баланс"],
["Endless Fury", "Бесконечная ярость"],
["Electrocution", "Электрошок"],
["Gruesome Mending", "Зловещее исцеление"],
["No Mercy", "Никакой пощады"],
["Avalanche", "Лавина"],
["Mending", "Исправление"],
["Endless Pyre", "Нескончаемое сожжение"],
["Death's Approach", "Приближение смерти"],
["Debilitating Toxins", "Изнуряющие яды"],
["Crippling Flames", "Увечащее пламя"],
["Battle Fervor", "Боевое рвение"],
["Mana Shield", "Щит маны"],
["Duelist", "Дуэлянт"],
["Precision Magic", "Точная магия"],
["Memento Mori", "Помни о смерти"],
["Thick Skin", "Плотная кожа"],
["Align the Elements", "Баланс стихий"],
["Frigid Breeze", "Леденящий ветер"],
["Permafrost", "Вечная мерзлота"],
["Invigorating Fury", "Бодрящая ярость"],
["Protection", "Защита"],
["Unrestrained", "Необузданная сила"],
["Booming Voice", "Громогласность"],
["Expose Vulnerability", "Найти слабости"],
["Thick Hide", "Плотная шкура"],
["Prolific Fury", "Живительная ярость"],
["Mending Obscurity", "Целительная пелена"],
["Swiftness", "Быстрота"],
["Reactive Defense", "Защитный импульс"],
["Hoarfrost", "Изморозь"],
["Terror", "Устрашение"],
["Chilling Weight", "Обременяющий холод"],
["Stand Alone", "Одиночка"],
["Bonded in Essence", "Связанные одной эссенцией"],
["Icy Touch", "Ледяное прикосновение"],
["Tempered Fury", "Усмиренная ярость"],
["Transfusion", "Переливание"],
["Icy Veil", "Ледяная завеса"],
["Attack", "Атака"],
["Snap Freeze", "Мгновенная заморозка"],
["Bad Omen", "Дурное знамение"],
["Attack", "Атака"],
["Conduction", "Проводимость"],
["Furious Impulse", "Яростный порыв"],
["Quick Impulses", "Стремительные инстинкты"],
["Attack", "Атака"],
["Attack", "Атака"],
["Attack", "Атака"],
                ]);
        }
    }
}
