class ExternalResource {
    static getJsonResource(name) {
        const text = GM_getResourceText(name);
        if (!text) {
            return null;
        }
        return JSON.parse(text);
    }
}

class StringExtension {
    static equelsIgnoreCase(str1, str2) {
        return str1?.toLowerCase() === str2?.toLowerCase();
    }

    static startswithIgnoreCase(sourceString, searchString, position) {
        return sourceString && searchString &&
            sourceString.toLowerCase().startsWith(searchString.toLowerCase(), position);
    }

    static endsWithIgnoreCase(sourceString, searchString, position) {
        return sourceString && searchString &&
            sourceString.toLowerCase().endsWith(searchString.toLowerCase(), position);
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

        this.aspects = ExternalResource.getJsonResource("aspect_en");
        this.glyphs = ExternalResource.getJsonResource("glyph_en");
        this.unqItems = ExternalResource.getJsonResource("unq_item_en");
        this.legNodes = ExternalResource.getJsonResource("leg_node_en");
        this.runes = ExternalResource.getJsonResource("rune_en");
        this.skills = ExternalResource.getJsonResource("skill_en");
        this.tempers = ExternalResource.getJsonResource("temper_en");
        this.temperTypes = [
            { id: 1, name: "Weapons" },
            { id: 2, name: "Offensive" },
            { id: 3, name: "Defensive" },
            { id: 4, name: "Utility" },
            { id: 5, name: "Mobility" },
            { id: 6, name: "Resource" },
        ];
    }
}

class RussianLanguage extends Language {
    constructor() {
        super();

        this.aspects = ExternalResource.getJsonResource("aspect_ru");
        this.glyphs = ExternalResource.getJsonResource("glyph_ru");
        this.unqItems = ExternalResource.getJsonResource("unq_item_ru");
        this.legNodes = ExternalResource.getJsonResource("leg_node_ru");
        this.runes = ExternalResource.getJsonResource("rune_ru");
        this.skills = ExternalResource.getJsonResource("skill_ru");
        this.tempers = ExternalResource.getJsonResource("temper_ru");
        this.temperTypes = [
            { id: 1, name: "Оружие" },
            { id: 2, name: "Атака" },
            { id: 3, name: "Защита" },
            { id: 4, name: "Поддержка" },
            { id: 5, name: "Подвижность" },
            { id: 6, name: "Ресурсы" },
        ];
    }
}
