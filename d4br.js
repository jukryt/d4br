// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      0.10.1
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
            if (mutation.type === "childList") {
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
        return this.nodeProcess(node, "unq_name_rus", this.d4Data.unqItemMap, addOldValue);
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
        return this.nodeProcess(node, "unq_name_rus", this.d4Data.unqItemMap, true);
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
        return this.nodeProcess(node, "unq_name_rus", this.d4Data.unqItemMap, true);
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
    observer.observe(document, { subtree: true, childList: true });

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
["Aspect of Occult Dominion", "Аспект оккультной власти"],
["Juggernaut's Aspect", "Аспект – мощный"],
["Aspect of Hardened Bones", "Аспект затвердевших костей"],
["Aspect of Reanimation", "Аспект возрождения"],
["Aspect of Frenzied Dead", "Аспект бешеных мертвецов"],
["Blood Getter's Aspect", "Аспект – кровопускающий"],
["Aspect of Grasping Veins", "Аспект цепких жил"],
["Blighted Aspect", "Аспект – зачумленный"],
["Edgemaster's Aspect", "Аспект – гвардейский"],
["Unyielding Commander's Aspect", "Аспект – несгибаемый командирский"],
["Aspect of Might", "Аспект мощи"],
["Storm Swell Aspect", "Аспект – крепнущий грозовой"],
["Aspect of Frozen Orbit", "Аспект ледяного пути"],
["Conceited Aspect", "Аспект – высокомерный"],
["Everliving Aspect", "Аспект – вечноживущий"],
["Aspect of Adaptability", "Аспект адаптации"],
["Hulking Aspect", "Аспект – громадный"],
["Aspect of Concussive Strikes", "Аспект контузящих ударов"],
["Dust Devil's Aspect", "Аспект – пыльный дьявольский"],
["Bold Chieftain's Aspect", "Аспект – бравый командирский"],
["Aspect of Fierce Winds", "Аспект яростных ветров"],
["Aspect of Giant Strides", "Аспект гигантских шагов"],
["Aspect of Disobedience", "Аспект непослушания"],
["Aphotic Aspect", "Аспект – мглистый"],
["Aspect of Control", "Аспект контроля"],
["Accelerating Aspect", "Аспект – скорый"],
["Windlasher Aspect", "Аспект – хлестающий ветром"],
["Devilish Aspect", "Аспект – сатанинский"],
["Hectic Aspect", "Аспект – суматошный"],
["Rapid Aspect", "Аспект – убыстряющий"],
["Relentless Berserker's Aspect", "Аспект – безжалостно-берсеркский"],
["Aspect of Inner Calm", "Аспект внутреннего покоя"],
["Shepherd's Aspect", "Аспект – пастырский"],
["Aspect of Numbing Wrath", "Аспект леденящего гнева"],
["Aspect of the Moonrise", "Аспект восхода луны"],
["Undying Aspect", "Аспект – неумирающий"],
["Ghostwalker Aspect", "Аспект – блуждающий в тенях"],
["Stormchaser's Aspect", "Аспект – бегущий за штормом"],
["Aspect of the Expectant", "Аспект ожидания"],
["Flamethrower's Aspect", "Аспект – огнемечущий"],
["Aspect of Metamorphosis", "Аспект метаморфозы"],
["Aspect of the Stampede", "Аспект панического бегства"],
["Shockwave Aspect", "Аспект – взрывной"],
["Aspect of Accursed Touch", "Аспект проклятого касания"],
["Glacial Aspect", "Аспект – ледниковый"],
["Blood Boiling Aspect", "Аспект – Кипящей крови"],
["Aspect of Explosive Mist", "Аспект взрывного тумана"],
["Umbrous Aspect", "Аспект – сумеречный"],
["Gravitational Aspect", "Аспект – гравитации"],
["Aspect of Shielding Storm", "Аспект щита ветров"],
["Iron Blood Aspect", "Аспект – железнокровный"],
["Aspect of the Changeling's Debt", "Аспект долга мимикрида"],
["Aspect of Elements", "Аспект стихий"],
["Aspect of Vocalized Empowerment", "Аспект громогласного усиления"],
["Prodigy's Aspect", "Аспект – гениальный"],
["Aspect of Concentration", "Аспект сосредоточения"],
["Aspect of the Damned", "Аспект проклятых"],
["Aspect of Voracious Rage", "Аспект ненасытной ярости"],
["Wind Striker Aspect", "Аспект – атакующий ветром"],
["Earthquake Aspect", "Аспект – сейсмический"],
["Aspect of the Ursine Horror", "Аспект кошмарного медведя"],
["Aspect of the Unbroken Tether", "Аспект нерушимых уз"],
["Blood-bathed Aspect", "Аспект – выпотрошенный"],
["Vigorous Aspect", "Аспект – энергетический"],
["Aspect of Branching Volleys", "Аспект веерного огня"],
["Aspect of Retaliation", "Аспект расплаты"],
["Elementalist's Aspect", "Аспект – стихийный"],
["Fastblood Aspect", "Аспект – живокровный"],
["Aspect of Bul-Kathos", "Аспект Бул-Катоса"],
["Aspect of the Umbral", "Аспект мрака"],
["Aspect of Ultimate Shadow", "Аспект последней тени"],
["Aspect of Corruption", "Аспект порчи"],
["Aspect of Conflagration", "Аспект поджога"],
["Mage-Lord's Aspect", "Аспект – верховный магический"],
["Aspect of Frosty Strides", "Аспект морозных шагов"],
["High Velocity Aspect", "Аспект – скоростной"],
["Aspect of the Frozen Tundra", "Аспект мерзлой тундры"],
["Aspect of Shredding Blades", "Аспект кромсающих клинков"],
["Aspect of the Void", "Аспект пустоты"],
["Needleflare Aspect", "Аспект – вспыхивающий иглами"],
["Aspect of Plunging Darkness", "Аспект глубокой тьмы"],
["Aspect of Quicksand", "Аспект зыбучих песков"],
["Exploiter's Aspect", "Аспект – эксплуатирующий"],
["Aspect of Ancient Flame", "Аспект древнего пламени"],
["Aspect Repeating", "Аспект пульсирующий"],
["Aspect of the Calm Breeze", "Аспект спокойного дуновения"],
["Aspect of Ancestral Charge", "Аспект натиска предков"],
["Frostbitten Aspect", "Аспект – обмороженный"],
["Aspect of Serration", "Аспект зазубрин"],
["Snowguard's Aspect", "Аспект – снежный защитный"],
["Aspect of the Alpha", "Аспект вожака стаи"],
["Aspect of Engulfing Flames", "Аспект жадного пламени"],
["Aspect of the Protector", "Аспект защитника"],
["Aspect of Retribution", "Аспект воздаяния"],
["Aspect of Natural Balance", "Аспект равновесия природы"],
["Serpentine Aspect", "Аспект – Зигзаг"],
["Aspect of Limitless Rage", "Аспект безграничной ярости"],
["Coldbringer's Aspect", "Аспект – хладоносный"],
["Aspect of the Embalmer", "Аспект бальзамировщика"],
["Aspect of Mending Stone", "Аспект укрепляющего камня"],
["Trickshot Aspect", "Аспект – хитрый стрелковый"],
["Aspect of Frozen Memories", "Аспект застывших воспоминаний"],
["Splintering Aspect", "Аспект – рассекающий"],
["Aspect of the Crowded Sage", "Аспект осажденного мудреца"],
["Aspect of Berserk Ripping", "Аспект резни берсерка"],
["Shattered Spirit's Aspect", "Аспект – призрачный осколочный"],
["Earthstriker's Aspect", "Аспект – сотрясающий землю"],
["Assimilation Aspect", "Аспект – обволакивающий"],
["Aspect of Fortune", "Аспект фортуны"],
["Recharging Aspect", "Аспект – перезаряжаемый"],
["Aspect of Slaughter", "Аспект резни"],
["Bladedancer's Aspect", "Аспект – танцующий с клинком"],
["Aspect of Rathma's Chosen", "Аспект избранных Ратмы"],
["Aspect of Shared Misery", "Аспект общих страданий"],
["Frostblitz Aspect", "Аспект – пронизывающий холодом"],
["Virulent Aspect", "Аспект – заразный"],
["Aspect of the Iron Warrior", "Аспект железного воина"],
["Snowveiled Aspect", "Аспект – заметенный"],
["Blood-soaked Aspect", "Аспект – окровавленный"],
["Aspect of Cruel Sustenance", "Аспект безжалостной жатвы"],
["Aspect of the Dire Whirlwind", "Аспект лютого вихря"],
["Death Wish Aspect", "Аспект – смертельный"],
["Resistant Assailant's Aspect", "Аспект – стойкий атакующий"],
["Aspect of Metamorphic Stone", "Аспект преображающего камня"],
["Aspect of the Bounding Conduit", "Аспект отражающего проводника"],
["Aspect of Torment", "Аспект мучения"],
["Aspect of Sundered Ground", "Аспект расколотой земли"],
["Symbiotic Aspect", "Аспект – симбиотический"],
["Incendiary Aspect", "Аспект – воспламеняющий"],
["Aspect of Shattered Stars", "Аспект расколотых звезд"],
["Aspect of the Relentless Armsmaster", "Аспект неутомимого мастера оружия"],
["Lightning Dancer's Aspect", "Аспект – танцующий с молниями"],
["Aspect of Tempering Blows", "Аспект закаляющих ударов"],
["Aspect of Berserk Fury", "Аспект ярости берсерка"],
["Aspect of Grasping Whirlwind", "Аспект цепкого ветра"],
["Aspect of Ancestral Force", "Аспект силы предков"],
["Aspect of Noxious Ice", "Аспект отравленного льда"],
["Aspect of Arrow Storms", "Аспект бури стрел"],
["Aspect of Fevered Mauling", "Аспект свирепой трепки"],
["Raw Might Aspect", "Аспект – неоспоримый мощный"],
["Aspect of the Wildrage", "Аспект дикой ярости"],
["Ravenous Aspect", "Аспект – прожорливый"],
["Aspect of Piercing Cold", "Аспект пронзающего холода"],
["Ravager's Aspect", "Аспект – разоряющий"],
["Aspect of Bursting Venoms", "Аспект взрывающихся токсинов"],
["Aspect of the Blurred Beast", "Аспект мелькающего зверя"],
["Cheat's Aspect", "Аспект – трюкаческий"],
["Charged Aspect", "Аспект – заряженный"],
["Aspect of Untimely Death", "Аспект скоропостижной кончины"],
["Starlight Aspect", "Аспект – звездный"],
["Aspect of Volatile Shadows", "Аспект взрывных теней"],
["Mighty Storm's Aspect", "Аспект – бушующий"],
["Aspect of the Unsatiated", "Аспект неутолимости"],
["Aspect of Binding Embers", "Аспект связующих углей"],
["Nighthowler's Aspect", "Аспект – воющий в ночи"],
["Osseous Gale Aspect", "Аспект – штормокостный"],
["Weapon Master's Aspect", "Аспект – высококлассный"],
["Stormclaw's Aspect", "Аспект – разрывающий штормовой"],
["Aspect of Pestilent Points", "Аспект ядовитого укола"],
["Aspect of Unstable Imbuements", "Аспект нестабильных усилений"],
["Eluding Aspect", "Аспект – ускользающий"],
["Overcharged Aspect", "Аспект – перегруженный"],
["Aspect of Encircling Blades", "Аспект окружающих клинков"],
["Icy Alchemist's Aspect", "Аспект – ледяной алхимический"],
["Aspect of the Tempest", "Аспект бури"],
["Veteran Brawler's Aspect", "Аспект – старый бойцовский"],
["Mangler's Aspect", "Аспект – истязающий"],
["Aspect of the Trampled Earth", "Аспект утоптанной земли"],
["Subterranean Aspect", "Аспект – подземный"],
["Aspect of The Aftershock", "Аспект подземного эха"],
["Aspect of Swelling Curse", "Аспект нарастающего проклятия"],
["Aspect of Decay", "Аспект распада"],
["Dire Wolf's Aspect", "Аспект – лютоволчий"],
["Aspect of Empowering Reaper", "Аспект могучего жнеца"],
["Opportunist's Aspect", "Аспект – авантюристский"],
["Aspect of Explosive Verve", "Аспект взрывной яркости"],
["Aspect of Nature's Savagery", "Аспект безжалостной природы"],
["Aspect of Gore Quills", "Аспект кровавых шипов"],
["Aspect of Ancestral Echoes", "Аспект эха предков"],
["Aspect of the Rampaging Werebeast", "Аспект буйного медведя"],
["Aspect of Three Curses", "Аспект трех проклятий"],
["Protecting Aspect", "Аспект – защищающий"],
["Steadfast Berserker's Aspect", "Аспект – крепкий берсерков"],
["Aspect of the Long Shadow", "Аспект длинной тени"],
["Aspect of Audacity", "Аспект дерзости"],
["Aspect of Burning Rage", "Аспект огненной ярости"],
["Aspect of Piercing Static", "Аспект пронзающего тока"],
["Aspect of Tenuous Destruction", "Аспект тревожного разрушения"],
["Bear Clan Berserker's Aspect", "Аспект – медвежий берсерков"],
["Skinwalker's Aspect", "Аспект – переменчивый"],
["Aspect of Exposed Flesh", "Аспект обнаженной плоти"],
["Ballistic Aspect", "Аспект – баллистический"],
["Craven Aspect", "Аспект – пугающий"],
["Aspect of Surprise", "Аспект непредсказуемости"],
["Vengeful Aspect", "Аспект – злопамятный"],
["Aspect of Quickening Fog", "Аспект ускоряющего тумана"],
["Aspect of Uncanny Treachery", "Аспект омерзительной измены"],
["Blast-Trapper's Aspect", "Аспект – взрывной хватающий"],
["Runeworker's Conduit Aspect", "Аспект – рунный заряженный"],
["Aspect of Anemia", "Аспект анемии"],
["Aspect of the Deflecting Barrier", "Аспект отражающего барьера"],
["Brawler's Aspect", "Аспект – бойцовский"],
["Cadaverous Aspect", "Аспект – мертвенный"],
["Rotting Aspect", "Аспект – гнилой"],
["Stable Aspect", "Аспект – бурлящий"],
["Mangled Aspect", "Аспект – изувеченный"],
["Aspect of Efficiency", "Аспект эффективности"],
["Aspect of Hungry Blood", "Аспект голодной крови"],
["Blood Seeker's Aspect", "Аспект – кровавого охотника"],
["Flamewalker's Aspect", "Аспект – идущий в пламени"],
["Aspect of Potent Blood", "Аспект крови силы"],
["Smiting Aspect", "Аспект – карательный"],
["Aspect of Artful Initiative", "Аспект находчивого поступка"],
["Sacrificial Aspect", "Аспект – жертвенный"],
["Aspect of Splintering Energy", "Аспект раскалывающейся энергии"],
["Energizing Aspect", "Аспект – наполняющий силой"],
["Aspect of the Dark Howl", "Аспект темного воя"],
["Aspect of Encroaching Wrath", "Аспект подступающего гнева"],
["Tidal Aspect", "Аспект – приливный"],
["Trickster's Aspect", "Аспект – лживый"],
["Torturous Aspect", "Аспект – пытающий"],
["Slaking Aspect", "Аспект – гасящий"],
["Aspect of Armageddon", "Аспект конца света"],
["Aspect of Imitated Imbuement", "Аспект отраженного насыщения"],
["Aspect of Synergy", "Аспект взаимосвязи"],
["Aspect of the Frozen Wake", "Аспект морозной волны"],
["Crashstone Aspect", "Аспект – камнедробящий"],
["Aspect of Singed Extremities", "Аспект обожженных ног"],
["Aspect of Stolen Vigor", "Аспект украденной бодрости"],
["Aspect of Abundant Energy", "Аспект обильной энергии"],
["Requiem Aspect", "Аспект – заупокойный"],
["Skullbreaker's Aspect", "Аспект – костоломный"],
["Shattered Aspect", "Аспект – разбитый"],
["Enshrouding Aspect", "Аспект – окутывающий"],
["Aspect of Overwhelming Currents", "Аспект неодолимого течения"],
["Aspect of the Unwavering", "Аспект непоколебимости"],
["Seismic-shift Aspect", "Аспект – тектонический"],
["Wanton Rupture Aspect", "Аспект – безудержно разрывающий"],
["Flesh-Rending Aspect", "Аспект – кромсающий плоть"],
["Aspect of Biting Cold", "Аспект жгучего холода"],
["Battle Caster's Aspect", "Аспект – боевой магический"],
["Stormshifter's Aspect", "Аспект – изменчивый штормовой"],
["Luckbringer Aspect", "Аспект – приносящий удачу"],
["Escape Artist's Aspect", "Аспект – обеспечивающий побег"],
["Toxic Alchemist's Aspect", "Аспект – ядовитый алхимический"],
["Aspect of Searing Wards", "Аспект пылающей преграды"],
["Shadowslicer Aspect", "Аспект – рвущийся из тьмы"],
["Aspect of Bursting Bones", "Аспект взрывающихся костей"],
["Infiltrator's Aspect", "Аспект – диверсантский"],
["Snap Frozen Aspect", "Аспект – сковывающий морозом"],
["Aspect of Elusive Menace", "Аспект неуловимой угрозы"],
["Aspect of Lethal Dusk", "Аспект смертельного полумрака"],
["Aspect of Perpetual Stomping", "Аспект непрерывного топота"],
["Battle-Mad Aspect", "Аспект – ярый"],
["Aspect of Siphoned Victuals", "Аспект похищенной провизии"],
["Encased Aspect", "Аспект – заключенный"],
["Earthguard Aspect", "Аспект – защищенный землей"],
["Aspect of Cyclonic Force", "Аспект силы циклона"],
["Balanced Aspect", "Аспект – сбалансированный"],
                ]);

            // https://www.wowhead.com/diablo-4/items/quality:6
            this.unqItemMap = new Map(
                [
["Tibault's Will", "Воля Тибо"],
["Paingorger's Gauntlets", "Рукавицы упоения болью"],
["Harlequin Crest", "Шутовской гребень"],
["Ring of Starless Skies", "Кольцо беззвездных небес"],
["Tyrael's Might", "Мощь Тираэля"],
["Fractured Winterglass", "Расколотый хрусталь зимы"],
["Yen's Blessing", "Благословение Йен"],
["Godslayer Crown", "Корона богоубийцы"],
["Resplendent Spark", "Ослепительная искра"],
["The Grandfather", "Предок"],
["Scoundrel's Kiss", "Поцелуй негодяя"],
["Tempest Roar", "Рев бури"],
["Doombringer", "Вестник рока"],
["Ramaladni's Magnum Opus", "Шедевр Рамаладни"],
["Ring of the Sacrilegious Soul", "Кольцо богохульного духа"],
["Melted Heart of Selig", "Расплавленное сердце Селига"],
["Temerity", "Дерзание"],
["Razorplate", "Бритвенная броня"],
["Wildheart Hunger", "Голод дикого сердца"],
["Tuskhelm of Joritz the Mighty", "Клыкастый шлем Йорица Могучего"],
["Ring of Mendeln", "Кольцо Мендельна"],
["Andariel's Visage", "Лик Андариэль"],
["Black River", "Черная река"],
["Tal Rasha's Iridescent Loop", "Переливчатое кольцо Тал Раши"],
["Esu's Heirloom", "Фамильное наследие Эсу"],
["Blood Moon Breeches", "Брюки кровавой луны"],
["X'Fal's Corroded Signet", "Ржавая печатка З'фала"],
["Flameweaver", "Ткач пламени"],
["Hunter's Zenith", "Охотничий зенит"],
["Banished Lord's Talisman", "Талисман лорда-изгнанника"],
["Flickerstep", "Искроступы"],
["Raiment of the Infinite", "Облачение бесконечности"],
["Ebonpiercer", "Черношип"],
["Arreat's Bearing", "Завет Арреат"],
["Rage of Harrogath", "Ярость Харрогата"],
["Twin Strikes", "Два удара"],
["Ahavarion, Spear of Lycander", "Аварион, копье Ликандер"],
["[WIP] Eye of the Depths", "[WIP] Eye of the Depths"],
["Azurewrath", "Лазурная ярость"],
["Yen's Blessing", "Благословение Йен"],
["Ancients' Oath", "Клятва Древних"],
["Cruor's Embrace", "Объятия Круора"],
["Soulbrand", "Клеймитель душ"],
["Storm's Companion", "Спутник бури"],
["Mad Wolf's Glee", "Ликование безумного волка"],
["Lidless Wall", "Недремлющий защитник"],
["Flamescar", "Обожженный шрам"],
["Howl from Below", "Вой из глубин"],
["Earthbreaker", "Землекрушитель"],
["Bloodless Scream", "Бескровный крик"],
["Dolmen Stone", "Камень дольмена"],
["Starfall Coronet", "Диадема упавшей звезды"],
["Vasily's Prayer", "Молитва Василия"],
["Greatstaff of the Crone", "Великий посох старой ведуньи"],
["Hellhammer", "Адский молот"],
["Tassets of the Dawning Sky", "Набедренные щитки рассвета"],
["Deathless Visage", "Лик бессмертия"],
["Unsung Ascetic's Wraps", "Повязки невоспетого аскета"],
["Highest Honors of the Iron Wolves", "Высшая награда Стальных Волков"],
["Deathspeaker's Pendant", "Подвеска Вестника Смерти"],
["Fists of Fate", "Кулаки судьбы"],
["Blue Rose", "Синяя роза"],
["Saboteur's Signet", "Печатка диверсанта"],
["Penitent Greaves", "Наголенники покаяния"],
["Word of Hakan", "Слово Хакана"],
["Airidah's Inexorable Will", "Непоколебимая воля Айриды"],
["Insatiable Fury", "Ненасытная ярость"],
["Skyhunter", "Небесный охотник"],
["Mother's Embrace", "Объятия Матери"],
["Esadora's Overflowing Cameo", "Переполненная камея Эсадоры"],
["The Oculus", "Око"],
["Ring of the Ravenous", "Кольцо ненасытных"],
["Greaves of the Empty Tomb", "Наголенники пустой гробницы"],
["Condemnation", "Осуждение"],
["Frostburn", "Обжигающий холод"],
["Blood Artisan's Cuirass", "Кираса кровавого мастера"],
["Gohr's Devastating Grips", "Захваты Гора-разорителя"],
["Staff of Lam Esen", "Посох Лам Эсена"],
["Overkill", "Беспредельная мощь"],
["Fields of Crimson", "Багряные поля"],
["Iceheart Brais", "Нагрудник ледяного сердца"],
["Beastfall Boots", "Сапоги павшего зверя"],
["Ring of Red Furor", "Кольцо алой ярости"],
["Staff of Endless Rage", "Посох бесконечного неистовства"],
["Mutilator Plate", "Латы изувера"],
["Gloves of the Illuminator", "Перчатки проповедника"],
["Asheara's Khanjar", "Ханджар Аширы"],
["Scoundrel's Leathers", "Кожаные обмотки негодяя"],
["Writhing Band of Trickery", "Верткий перстень ловкача"],
["Battle Trance", "Упоение боем"],
["Cowl of the Nameless", "Клобук Безымянного"],
["Grasp of Shadow", "Хватка тени"],
["The Butcher's Cleaver", "Тесак Мясника"],
["Windforce", "Сила ветра"],
["Waxing Gibbous", "Растущая луна"],
["Fleshrender", "Плотерез"],
["Traces of the Maiden", "Следы Девы"],
["Iron Wolves' Final Harvest", "Последний урожай Стальных Волков"],
["100,000 Steps", "100 000 шагов"],
["Eyes in the Dark", "Глаза в темноте"],
["Eaglehorn", "Орлиный рог"],
["Highest Honors of the Iron Wolves", "Высшая награда Стальных Волков"],
["Iron Wolves' Final Harvest", "Последний урожай Стальных Волков"],
["Destroyer's Equipment Cache", "Сундук снаряжения разрушителя"],
["[PH]Godslayer Crown", "[PH]Godslayer Crown"],
["Traces of the Maiden", "Следы Девы"],
["Slayer's Equipment Cache", "Сундук снаряжения убийцы"],
["Iron Wolves' Heroic Spoils", "Героические трофеи Стальных Волков"],
["Cages of Hubris", "Клетки гордыни"],
["Iron Wolves' Heroic Spoils", "Героические трофеи Стальных Волков"],
["Glimmering Herb Supply", "Мерцающий запас трав"],
["Pact Amulet", "Контрактный амулет"],
["Glimmering Herb Supply", "Мерцающий запас трав"],
["[PH] Unique 99 Gloves", "[PH] Unique 99 Gloves"],
["Boost Dagger", "Усиленный кинжал"],
["Champion's Equipment Cache", "Сундук снаряжения чемпиона"],
["Chapter 1 Reward Cache", "Сундук с наградами 1-й главы"],
["Boost Scythe", "Усиленная коса"],
["-", "-"],
["Chapter 2 Reward Cache", "Сундук с наградами 2-й главы"],
["[PH]", "[PH]"],
["Eternal Journey Chapter 2 Cache", "Сундук за 2 главу Вечного пути"],
["Boost Staff", "Усиленный посох"],
["[PH] Unique Barb Gloves 99", "[PH] Unique Barb Gloves 99"],
["Eternal Journey Chapter 4 Cache", "Сундук за 4 главу Вечного пути"],
["Cages of Hubris", "Клетки гордыни"],
["Eternal Journey Chapter 9 Cache", "Сундук за 9 главу Вечного пути"],
["Tuning Stone: Genesis", "Камень отладки: генезис"],
["Something Super Cool", "Something Super Cool"],
["Boost Helm", "Усиленный шлем"],
["Rusty Heirloom Dagger", "Ржавый наследный кинжал"],
["Eternal Journey Chapter 3 Cache", "Сундук за 3 главу Вечного пути"],
["[PH] Barb uniq 99 pants", "[PH] Barb uniq 99 pants"],
["Eternal Journey Chapter 5 Cache", "Сундук за 5 главу Вечного пути"],
["Eternal Journey Chapter 7 Cache", "Сундук за 7 главу Вечного пути"],
["Boost Pants", "Усиленные штаны"],
["Icy Rib", "Ледяное ребро"],
["Bloodforged Sigil", "Кровокованная печать"],
["Eternal Journey Chapter 6 Cache", "Сундук за 6 главу Вечного пути"],
["Tuning Stone: Evernight", "Камень отладки: вечная ночь"],
["Eternal Journey Chapter 8 Cache", "Сундук за 8 главу Вечного пути"],
                ]);

            // https://www.wowhead.com/diablo-4/paragon-glyphs
            this.glyphNameMap = new Map(
                [
["Deadraiser", "Воскрешатель"],
["Corporeal", "Телесность"],
["Exploit", "Уловка"],
["Amplify", "Усиление"],
["Undaunted", "Бесстрашие"],
["Territorial", "Защита границ"],
["Twister", "Ураган"],
["Marshal", "Судья"],
["Canny", "Благоразумие"],
["Ire", "Праведный гнев"],
["Reinforced", "Бастион"],
["Elementalist", "Стихии"],
["Golem", "Голем"],
["Essence", "Эссенция"],
["Flamefeeder", "Питающее пламя"],
["Scourge", "Плеть"],
["Gravekeeper", "Могильщик"],
["Tactician", "Тактик"],
["Desecration", "Осквернение"],
["Rumble", "Рокот"],
["Exhumation", "Эксгумация"],
["Ambidextrous", "Амбидекстр"],
["Outmatch", "Превосходство"],
["Adept", "Мастер"],
["Wrath", "Гнев"],
["Ranger", "Странник"],
["Sacrificial", "Жертвоприношение"],
["Disembowel", "Потрошение"],
["Exploit", "Уловка"],
["Conjurer", "Чаротворец"],
["Enchanter", "Чары"],
["Mage", "Маг"],
["Efficacy", "Эффективность"],
["Keeper", "Хранитель"],
["Destruction", "Разрушение"],
["Explosive", "Взрывчатка"],
["Control", "Контроль"],
["Impairment", "Сковывание"],
["Bane", "Бич"],
["Control", "Контроль"],
["Undaunted", "Бесстрашие"],
["Revenge", "Мщение"],
["Pyromaniac", "Пироманьяк"],
["Abyssal", "Бездна"],
["Turf", "Почва"],
["Imbiber", "Вкушение"],
["Werebear", "Облик медведя"],
["Devious", "Хитрость"],
["Werewolf", "Облик волка"],
["Versatility", "Универсальность"],
["Might", "Мощь"],
["Combat", "Бой"],
["Stalagmite", "Сталагмит"],
["Dominate", "Подчинение"],
["Revenge", "Мщение"],
["Winter", "Зима"],
["Tears of Blood", "Кровавые слезы"],
["Exploit", "Уловка"],
["Darkness", "Тьма"],
["Crusher", "Крушитель"],
["Spirit", "Дух"],
["Pride", "Гордыня"],
["Brawl", "Потасовка"],
["Charged", "Заряд"],
["Chip", "Обломок"],
["Unleash", "Воля"],
["Closer", "Сближение"],
["Fang and Claw", "Клыки и когти"],
["Torch", "Факел"],
["Control", "Контроль"],
["Electrocution", "Удар током"],
["Warrior", "Воин"],
["Seething", "Возмущение"],
["Shapeshifter", "Оборотень"],
["Diminish", "Снижение"],
["Tracker", "Следопыт"],
["Wilds", "Дикая природа"],
["Earth and Sky", "Земля и небо"],
["Nightstalker", "Ночной охотник"],
["Mortal Draw", "Смертельное натяжение"],
["Weapon Master", "Мастер оружия"],
["Tectonic", "Движение земли"],
["Invocation", "Воззвание"],
["Dominate", "Подчинение"],
["Human", "Человек"],
["Battle-hardened", "Боевая закалка"],
["Tracker", "Следопыт"],
["Blood-drinker", "Кровопийца"],
["Bane", "Бич"],
["Fulminate", "Сверкание"],
["Infusion", "Насыщение"],
["Warding", "Оберег"],
["Battle-hardened", "Боевая закалка"],
["Subdue", "Усмирение"],
["Electrocute", "Электрошок"],
["Guzzler", "Обжора"],
["Slayer", "Истребитель"],
["Poise", "Самообладание"],
["Dominate", "Подчинение"],
["Frostbite", "Обморожение"],
["Ambush", "Засада"],
["Frostfeeder", "Питающий лед"],
["Bloodfeeder", "Питающая кровь"],
["Fluidity", "Текучесть"],
["Snare", "Капкан"],
["Overwhelm", "Яростный натиск"],
["Wisdom", "Мудрость"],
["Advantage", "Первый ход"],
["Protector", "Защитник"],
["Cleaver", "Тесак"],
["Overwhelm", "Яростный натиск"],
["Ruin", "Крах"],
["Impairment", "Сковывание"],
["Executioner", "Палач"],
["Resolve", "Непоколебимость"],
["Impairment", "Сковывание"],
["Reanimator", "Оживление"],
["Subdue", "Усмирение"],
["Battle-hardened", "Боевая закалка"],
["Overwhelm", "Яростный натиск"],
["Slayer", "Истребитель"],
["Slayer", "Истребитель"],
["Power", "Сила"],
["Battle-hardened", "Боевая закалка"],
["Subdue", "Усмирение"],
["Slayer", "Истребитель"],
["-", "-"],
["Ruin", "Крах"],
["Skill", "Умение"],
["Overwhelm", "Яростный натиск"],
["Ruin", "Крах"],
["Ruin", "Крах"],
["Subdue", "Усмирение"],
                ]);

            // https://www.wowhead.com/diablo-4/paragon-nodes/quality:4
            this.legNodeMap = new Map(
                [
["Cult Leader", "Глава культа"],
["Flesh-eater", "Пожирание плоти"],
["Thunderstruck", "Громовой молот"],
["Frigid Fate", "Смерть во льдах"],
["Hulking Monstrosity", "Исполинское чудовище"],
["Lust for Carnage", "Жажда насилия"],
["Enchantment Master", "Мастер чар"],
["Wither", "Иссушение"],
["Inner Beast", "Внутренний зверь"],
["Icefall", "Ледопад"],
["Blood Rage", "Кровавая ярость"],
["Warbringer", "Разжигатель войны"],
["Cunning Stratagem", "Хитрый маневр"],
["Burning Instinct", "Пылающий инстинкт"],
["Scent of Death", "Запах смерти"],
["Cheap Shot", "Грязный прием"],
["Bone Graft", "Пересаженная кость"],
["Heightened Malice", "Необычайная злоба"],
["Carnage", "Расправа"],
["Tricks of the Trade", "Профессиональные приемы"],
["Constricting Tendrils", "Щупальца-душители"],
["Eldritch Bounty", "Потусторонний дар"],
["Ceaseless Conduit", "Бесконечный проводник"],
["Searing Heat", "Опаляющий жар"],
["No Witnesses", "Никаких свидетелей"],
["Decimator", "Дециматор"],
["Bloodbath", "Кровавая баня"],
["Ancestral Guidance", "Наставление предков"],
["Exploit Weakness", "Игра на слабостях"],
["Earthen Devastation", "Земляное уничтожение"],
["Deadly Ambush", "Смертельная засада"],
["Static Surge", "Всплеск энергии"],
["Blood Begets Blood", "Кровь рождает кровь"],
["Hemorrhage", "Кровоизлияние"],
["Elemental Summoner", "Призыватель стихий"],
["Leyrana's Instinct", "Инстинкт Лейраны"],
["Flawless Technique", "Безупречная техника"],
["Bone Breaker", "Костолом"],
["Weapons Master", "Мастерское владение оружием"],
["Survival Instincts", "Инстинкты выживания"],
["Natural Leader", "Прирожденный лидер"],
                ]);

            // https://www.wowhead.com/diablo-4/skills
            this.skillsNameMap = new Map(
                [
["Decrepify", "Немощь"],
["Raise Skeleton", "Призыв скелета"],
["Shadowblight", "Чума тьмы"],
["Hellbent Commander", "Одержимый командир"],
["Corpse Explosion", "Взрыв трупа"],
["Digitigrade Gait", "Прыть пальцеходящих"],
["Bash", "Сокрушающий удар"],
["Golem", "Голем"],
["Frozen Orb", "Морозная сфера"],
["Corpse Tendrils", "Трупные щупальца"],
["Heartseeker", "Пронзатель сердец"],
["Concussion", "Контузия"],
["Blight", "Тлен"],
["Imposing Presence", "Довлеющее присутствие"],
["Double Swing", "Двойной удар"],
["Frost Nova", "Кольцо льда"],
["Teleport", "Телепортация"],
["Army of the Dead", "Армия мертвецов"],
["Unconstrained", "Неудержимая сила"],
["Incinerate", "Испепеление"],
["Shatter", "Раскалывание"],
["Esu's Ferocity", "Свирепость Эсу"],
["Blood Mist", "Кровавый туман"],
["Kalan's Edict", "Эдикт Калана"],
["Charge", "Натиск"],
["Rallying Cry", "Воодушевляющий клич"],
["Dark Shroud", "Теневая завеса"],
["Pit Fighter", "Боец арены"],
["Ice Blades", "Ледяные клинки"],
["Wrath of the Berserker", "Гнев берсерка"],
["Iron Maiden", "Железная дева"],
["Lunging Strike", "Выпад"],
["Blood Surge", "Волнение крови"],
["Spark", "Искра"],
["Bone Storm", "Буря костей"],
["Rapid Ossification", "Быстрое окостенение"],
["Amplify Damage", "Усиление урона"],
["Frigid Finesse", "Ледяная точность"],
["Challenging Shout", "Подстрекающий крик"],
["Reap", "Жатва"],
["Hemorrhage", "Кровоизлияние"],
["Death's Embrace", "Объятия смерти"],
["Barrage", "Шквальный огонь"],
["Precision", "Точность"],
["Fire Bolt", "Стрела огня"],
["Ice Armor", "Ледяной доспех"],
["Fireball", "Огненный шар"],
["Fueled by Death", "Смерть придает силы"],
["Skeletal Mage Mastery", "Мастер скелетов-магов"],
["Bone Splinters", "Костяные осколки"],
["Golem Mastery", "Мастер големов"],
["Aggressive Resistance", "Яростное сопротивление"],
["Hewed Flesh", "Обрезки плоти"],
["Decompose", "Распад"],
["Deep Freeze", "Глубокая заморозка"],
["Crippling Darkness", "Жестокая тьма"],
["Hydra", "Гидра"],
["Flame Shield", "Пламенный щит"],
["Envenom", "Наполнение ядом"],
["War Cry", "Воинственный клич"],
["Unstable Currents", "Бурный поток"],
["Bestial Rampage", "Звериное буйство"],
["Outburst", "Вспышка гнева"],
["Victimize", "Жестокая расправа"],
["Lightning Spear", "Электрическое копье"],
["Overflowing Energy", "Неудержимая энергия"],
["Ursine Strength", "Медвежья сила"],
["Gloom", "Сумрак"],
["Devouring Blaze", "Всепоглощающее пламя"],
["Vyr's Mastery", "Мастерство Выра"],
["Forceful Arrow", "Стрела силы"],
["Chain Lightning", "Цепная молния"],
["Whirlwind", "Вихрь"],
["Rapid Fire", "Скоростная стрельба"],
["Rathma's Vigor", "Бодрость Ратмы"],
["Trample", "Тяжелый шаг"],
["Warmth", "Тепло"],
["Martial Vigor", "Боевой азарт"],
["Skeletal Warrior Mastery", "Мастер скелетов-воинов"],
["Wolves", "Волки"],
["Shadow Imbuement", "Насыщение тенью"],
["Concealment", "Маскировка"],
["Upheaval", "Выброс земли"],
["Weapon Mastery", "Мастер оружия"],
["Frenzy", "Бешенство"],
["Counteroffensive", "Контрнаступление"],
["Death's Approach", "Приближение смерти"],
["Blood Howl", "Кровавый вой"],
["Unliving Energy", "Неживая энергия"],
["Tough as Nails", "Шипастый щит"],
["Shadow Step", "Шаг сквозь тень"],
["Walking Arsenal", "Живой арсенал"],
["Ball Lightning", "Шаровая молния"],
["Inspiring Leader", "Пример для подражания"],
["Pulverize", "Сокрушение"],
["Imperfectly Balanced", "Хрупкий баланс"],
["Avalanche", "Лавина"],
["Fiery Surge", "Вспышка огня"],
["Frigid Breeze", "Леденящий ветер"],
["Poison Creeper", "Ядовитая лоза"],
["Conjuration Mastery", "Мастер колдовства"],
["Exploit", "Уловка"],
["Firewall", "Стена огня"],
["Sever", "Отсечение"],
["Leap", "Прыжок"],
["Storm Strike", "Удар бури"],
["Wind Shear", "Ветрорез"],
["Arc Lash", "Грозовая плеть"],
["Grim Harvest", "Мрачный урожай"],
["Puncture", "Колющий удар"],
["Spiked Armor", "Шипастый доспех"],
["Petrify", "Окаменение"],
["Dash", "Рывок"],
["Glass Cannon", "Хрупкий разрушитель"],
["Debilitating Roar", "Изнуряющий рев"],
["Flay", "Свежевание"],
["Ice Shards", "Осколки льда"],
["Bone Spear", "Костяное копье"],
["Rend", "Рваные раны"],
["Cold Front", "Холодный фронт"],
["Raid Leader", "Лидер рейда"],
["Poison Imbuement", "Насыщение ядом"],
["Evulsion", "Искоренение"],
["Lightning Storm", "Грозовой шторм"],
["Invigorating Conduit", "Бодрящий проводник"],
["Necrotic Carapace", "Некротический панцирь"],
["Elemental Dominance", "Власть над стихиями"],
["Rabies", "Звериное бешенство"],
["Bone Spirit", "Костяной дух"],
["Rupture", "Разрыв"],
["Tornado", "Смерч"],
["Permafrost", "Вечная мерзлота"],
["Steel Grasp", "Железная хватка"],
["Iron Skin", "Железная кожа"],
["Pressure Point", "Уязвимая точка"],
["Flurry", "Шквал"],
["Frost Bolt", "Ледяная стрела"],
["Ravens", "Вороны"],
["Ground Stomp", "Топот"],
["Abundance", "Изобилие"],
["Ossified Essence", "Окостеневшая эссенция"],
["Bone Prison", "Костяная тюрьма"],
["Shred", "Разрывание"],
["Wallop", "Разгром"],
["Momentum", "Импульс"],
["Hurricane", "Ураган"],
["Blizzard", "Снежная буря"],
["Rain of Arrows", "Град стрел"],
["Inner Flames", "Внутреннее пламя"],
["Penetrating Shot", "Пробивающий выстрел"],
["Twisting Blades", "Вонзающиеся клинки"],
["Heavy Handed", "Тяжелая рука"],
["No Mercy", "Никакой пощады"],
["Concussive", "Фугасный снаряд"],
["Maul", "Трепка"],
["Earthen Bulwark", "Земляной бастион"],
["Smoke Grenade", "Ослепляющий дым"],
["Reaper's Pursuit", "Преследующий жнец"],
["Adrenaline Rush", "Выброс адреналина"],
["Hammer of the Ancients", "Молот Древних"],
["Coalesced Blood", "Сгусток крови"],
["Hoarfrost", "Изморозь"],
["Charged Bolts", "Электрические разряды"],
["Compound Fracture", "Сложный перелом"],
["Innervation", "Прилив энергии"],
["Booming Voice", "Громогласность"],
["Death's Defense", "Защита смерти"],
["Claw", "Удар когтями"],
["Brute Force", "Грубая сила"],
["Stutter Step", "Перебежка"],
["Cut to the Bone", "Порез до кости"],
["Battle Fervor", "Боевое рвение"],
["Gruesome Mending", "Зловещее исцеление"],
["Nature's Fury", "Гнев природы"],
["Sturdy", "Прочность"],
["Meteor", "Метеорит"],
["Guttural Yell", "Утробный рев"],
["Invigorating Strike", "Живительный удар"],
["Trick Attacks", "Коварные удары"],
["Malice", "Злоба"],
["Invigorating Fury", "Бодрящая ярость"],
["Terror", "Устрашение"],
["Quickshift", "Быстрое преображение"],
["Call of the Ancients", "Зов Древних"],
["Shadow Crash", "Теневое сокрушение"],
["Shadow Clone", "Темное отражение"],
["Blood Lance", "Окровавленное копье"],
["Caltrops", "Шипы"],
["Death Blow", "Смертельный удар"],
["Close Quarters Combat", "Ближний бой"],
["Earth Spike", "Шип земли"],
["Bonded in Essence", "Связанные одной эссенцией"],
["Wild Impulses", "Дикие инстинкты"],
["Protection", "Защита"],
["Unbridled Rage", "Необузданная свирепость"],
["Defensive Stance", "Защитная позиция"],
["Slaying Strike", "Разящий удар"],
["Nature's Resolve", "Стойкость природы"],
["Mana Shield", "Щит маны"],
["Alchemical Advantage", "Польза алхимии"],
["Deadly Venom", "Смертельный яд"],
["Cold Imbuement", "Насыщение холодом"],
["Elemental Attunement", "Единство со стихиями"],
["Heightened Senses", "Обостренные чувства"],
["Death Trap", "Смертоносная ловушка"],
["Lacerate", "Раздирание"],
["Iron Maelstrom", "Круговорот стали"],
["Defiance", "Непокорность"],
["Precision Imbuement", "Прицельное насыщение"],
["Cataclysm", "Катаклизм"],
["Clarity", "Ясность"],
["Nature's Reach", "Власть природы"],
["Combustion", "Возгорание"],
["Chilling Weight", "Обременяющий холод"],
["Blood Wave", "Кровавая волна"],
["Siphoning Strikes", "Вытягивающие удары"],
["Devastation", "Опустошение"],
["Call of the Wild", "Зов дикой природы"],
["Soulfire", "Ожог души"],
["Thick Skin", "Плотная кожа"],
["Endless Pyre", "Нескончаемое сожжение"],
["Heart of the Wild", "Сердце дикой природы"],
["Landslide", "Оползень"],
["Precision Magic", "Точная магия"],
["Expose Vulnerability", "Найти слабости"],
["Prolific Fury", "Живительная ярость"],
["Impetus", "Сила движения"],
["Resonance", "Резонанс"],
["Align the Elements", "Баланс стихий"],
["Coursing Currents", "Текучие потоки"],
["Static Discharge", "Статический разряд"],
["Inferno", "Инферно"],
["Tides of Blood", "Волны крови"],
["Duelist", "Дуэлянт"],
["Earthen Might", "Мощь земли"],
["Kick", "Удар ногой"],
["Tempered Fury", "Усмиренная ярость"],
["Blade Shift", "Блуждающий клинок"],
["Poison Trap", "Ловушка с ядом"],
["Debilitating Toxins", "Изнуряющие яды"],
["Drain Vitality", "Иссушение жизненной силы"],
["Icy Touch", "Ледяное прикосновение"],
["Haste", "Спешка"],
["Electrocution", "Электрошок"],
["Predatory Instinct", "Инстинкт хищника"],
["Vigilance", "Бдительность"],
["Boulder", "Глыба"],
["Grizzly Rage", "Ярость гризли"],
["Shocking Impact", "Импульс шока"],
["Stand Alone", "Одиночка"],
["Mending Obscurity", "Целительная пелена"],
["Exposure", "Вредное воздействие"],
["Crushing Earth", "Сокрушающая земля"],
["Provocation", "Провокация"],
["Defensive Posture", "Защитная стойка"],
["Icy Veil", "Ледяная завеса"],
["Toxic Claws", "Ядовитые когти"],
["Perfect Storm", "Буря в разгаре"],
["Serration", "Зазубрины"],
["Potent Warding", "Надежные обереги"],
["Agile", "Изворотливость"],
["Natural Disaster", "Природная катастрофа"],
["Memento Mori", "Помни о смерти"],
["Lupine Ferocity", "Волчья свирепость"],
["Crippling Flames", "Увечащее пламя"],
["Circle of Life", "Круг жизни"],
["Electric Shock", "Электрошок"],
["Aftermath", "Итог"],
["Endless Fury", "Бесконечная ярость"],
["Cyclone Armor", "Ураганный доспех"],
["Ancestral Fortitude", "Стойкость предков"],
["Second Wind", "Второе дыхание"],
["Elemental Exposure", "Сила стихий"],
["Consuming Shadows", "Поглощающие теней"],
["Gushing Wounds", "Кровоточащие раны"],
["Swiftness", "Быстрота"],
["Iron Fur", "Железный мех"],
["Furious Impulse", "Яростный порыв"],
["Alchemist's Fortune", "Удача алхимика"],
["Trap Mastery", "Мастер ловушек"],
["Bad Omen", "Дурное знамение"],
["Neurotoxin", "Нейротоксин"],
["Rapid Gambits", "Быстрые хитрости"],
["Rugged", "Двужильность"],
["Stone Guard", "Каменный страж"],
["Safeguard", "Защитные меры"],
["Convulsions", "Конвульсии"],
["Unrestrained", "Необузданная сила"],
["Thick Hide", "Плотная шкура"],
["Charged Atmosphere", "Атмосферное напряжение"],
["Natural Fortitude", "Природная выносливость"],
["Hamstring", "Подрезание сухожилий"],
["Quick Impulses", "Стремительные инстинкты"],
["Endless Tempest", "Нескончаемый ураган"],
["Transfusion", "Переливание"],
["Snap Freeze", "Мгновенная заморозка"],
["Mending", "Исправление"],
["Reactive Defense", "Защитный импульс"],
["Conduction", "Проводимость"],
                ]);
        }
    }
}
