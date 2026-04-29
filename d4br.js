// ==UserScript==
// @name         d4builds rus
// @namespace    d4br
// @version      8.0.2
// @description  Перевод для d4builds
// @author       jukryt
// @match        *://d4builds.gg
// @match        *://d4builds.gg/*
// @match        *://maxroll.gg/d4
// @match        *://maxroll.gg/d4/*
// @match        *://mobalytics.gg/diablo-4
// @match        *://mobalytics.gg/diablo-4/*
// @icon         https://www.google.com/s2/favicons?sz=64&domain=d4builds.gg
// @homepageURL  https://github.com/jukryt/d4br
// @updateURL    https://raw.githubusercontent.com/jukryt/d4br/main/d4br.js
// @downloadURL  https://raw.githubusercontent.com/jukryt/d4br/main/d4br.js
// @supportURL   https://github.com/jukryt/d4br/issues
// @grant        GM_getResourceText
// @grant        GM_addStyle

// @resource     aspect_en    https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/aspect.json
// @resource     glyph_en     https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/glyph.json
// @resource     unq_item_en  https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/unq_item.json
// @resource     leg_node_en  https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/leg_node.json
// @resource     rune_en      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/rune.json
// @resource     skill_en     https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/skill.json
// @resource     temper_en    https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/temper.json
// @resource     elixir_en    https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/elixir.json
// @resource     charm_en     https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/en/charm.json

// @resource     aspect_ru    https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/aspect.json
// @resource     glyph_ru     https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/glyph.json
// @resource     unq_item_ru  https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/unq_item.json
// @resource     leg_node_ru  https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/leg_node.json
// @resource     rune_ru      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/rune.json
// @resource     skill_ru     https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/skill.json
// @resource     temper_ru    https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/temper.json
// @resource     elixir_ru    https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/elixir.json
// @resource     charm_ru     https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/ru/charm.json

// @resource     main_style   https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/style/main.css

// @require      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/d4tools.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/d4language.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/d4resource.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/d4builds.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/d4maxroll.js
// @require      https://raw.githubusercontent.com/jukryt/d4br/9d16565cbf71c3142f57d2fc9e790d6f32643e3a/d4mobalytics.js

// ==/UserScript==

(function () {
    'use strict';

    ExternalResource.applyCss("main_style");

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
