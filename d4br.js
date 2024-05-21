// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      0.3
// @description  Перевод для d4builds
// @author       jukryt
// @match        https://d4builds.gg/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d4builds.gg
// @homepageURL  https://github.com/jukryt/d4br
// @updateURL    https://raw.githubusercontent.com/jukryt/d4br/main/d4br.js
// @downloadURL  https://raw.githubusercontent.com/jukryt/d4br/main/d4br.js
// @supportURL   https://github.com/jukryt/d4br/issues
// @grant        GM_getValue
// @grant        GM_setValue
// ==/UserScript==

class D4BuildProcessor {
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

        // https://www.wowhead.com/diablo-4/paragon-glyphs
        this.glyfNameMap = new Map(
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
    }

    mutationObserverCallback(processor, mutationList, observer) {
        for (const mutation of mutationList) {
            if (mutation.type === "childList") {

                // Сработает при открытии билда на вкладке Gear & Skills
                if (mutation.target.className === "builder__gear__info") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.className === "builder__gear__name") {
                            //console.log(mutation);
                            processor.gearNameProcess(newNode, false);
                        }
                    }
                }
                // Сработает при переходе с какой либо вкладки на Gear & Skills
                else if (mutation.target.className === "builder__content") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.className === "builder__gear") {
                            const gearNameNodes = newNode.querySelectorAll("div.builder__gear__name");
                            for (const gearNameNode of gearNameNodes) {
                                processor.gearNameProcess(gearNameNode, true);
                            }
                        }
                    }
                }
                // Сработает для тултипов глифов
                else if (mutation.target.id.startsWith("tippy-")) {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.className === "paragon__tile__tooltip") {
                            const tooltipTitle = newNode.querySelector("div.paragon__tile__tooltip__title");
                            processor.glyfNameProcess(tooltipTitle);
                        }
                    }
                }
            }
        }
    }

    gearNameProcess(node, addOldValue) {
        const oldValue = node.innerText;

        const newValue = this.aspectNameMap.get(oldValue);
        if (!newValue) {
            return;
        }

        let htmlValue = this.buildHtmlValue("builder__gear__name__rus", newValue);

        if (addOldValue) {
            htmlValue += oldValue;
        }

        node.innerHTML = node.innerHTML.replace(oldValue, htmlValue);
    }

    glyfNameProcess(node) {
        const oldValue = node.innerText;

        const glyfMatch = oldValue.match(/([a-zA-Z]+) \(Lvl \d+\)/);
        if (!glyfMatch) {
            return;
        }

        const newValue = this.glyfNameMap.get(glyfMatch[1]);
        if (!newValue) {
            return;
        }

        const htmlValue = this.buildHtmlValue("paragon__glyf__name__rus", newValue);

        node.innerHTML = node.innerHTML.replace(oldValue, htmlValue);
    }

    buildHtmlValue(className, value) {
        return `<div class="${className}" style="color:gray; font-size:15px;">${value}</div>`;
    }
}

(function() {
    'use strict';

    const processor = new D4BuildProcessor();
    const observer = new MutationObserver(function (mutationList, observer) { processor.mutationObserverCallback(processor, mutationList, observer); });

    const builderContent = document.querySelector("body");
    const callbackConfig = { subtree: true, childList: true };
    observer.observe(builderContent, callbackConfig);
})();
