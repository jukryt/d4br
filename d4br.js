// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      2.0.0
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

// @resource     aspect_en    https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/en/aspect.json
// @resource     glyph_en     https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/en/glyph.json
// @resource     unq_item_en  https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/en/unq_item.json
// @resource     leg_node_en  https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/en/leg_node.json
// @resource     rune_en      https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/en/rune.json
// @resource     skill_en     https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/en/skill.json
// @resource     temper_en    https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/en/temper.json

// @resource     aspect_ru    https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/ru/aspect.json
// @resource     glyph_ru     https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/ru/glyph.json
// @resource     unq_item_ru  https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/ru/unq_item.json
// @resource     leg_node_ru  https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/ru/leg_node.json
// @resource     rune_ru      https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/ru/rune.json
// @resource     skill_ru     https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/ru/skill.json
// @resource     temper_ru    https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/ru/temper.json

// @require      https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/d4resource.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/d4builds.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/d4maxroll.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/e9e034071b7513e892d300d8f5ca18dd0b16ab6c/d4mobalytics.js

// ==/UserScript==

(function () {
    'use strict';

    AddStyle("@keyframes d4br_show_anim { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }");
    AddStyle(".d4br_show { animation: .7s d4br_show_anim ease; }");

    var MutationObserver = window.MutationObserver || window.WebKitMutationObserver || window.MozMutationObserver;

    const processor = CreateProcessor();
    const observer = new MutationObserver((mutations, observer) => {
        processor.mutationObserverCallback(mutations);
    });
    observer.observe(document, { subtree: true, childList: true, attributes: true });
})();

function CreateProcessor() {
    const host = window.location.host;
    switch (host) {
        case "d4builds.gg":
            return new D4BuildsProcessor();
        case "maxroll.gg":
            return new D4MaxrollProcessor();
        case "mobalytics.gg":
            return new D4MobalyticsProcessor();
    }
}

function AddStyle(css) {
    const name = "d4br_style";
    const style = document.getElementById(name) || (function () {
        const style = document.createElement('style');
        style.type = 'text/css';
        style.id = name;
        document.head.appendChild(style);
        return style;
    })();
    const sheet = style.sheet;
    sheet.insertRule(css, (sheet.rules || sheet.cssRules || []).length);
}
