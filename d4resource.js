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

    static hashCode(sourceString) {
        var hash = 0, i = sourceString.length;
        while (i > 0) {
            hash = (hash << 5) - hash + sourceString.charCodeAt(--i) | 0;
        }
        return hash;
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

    static temperValueMacros = " X ";

    constructor() {
        if (this.constructor == Language) {
            throw new Error("Abstract classes can't be instantiated.");
        };
    }

    _aspects;
    get aspects() {
        return this._aspects ?? [];
    }

    _glyphs;
    get glyphs() {
        return this._glyphs ?? [];
    }

    _unqItems;
    get unqItems() {
        return this._unqItems ?? [];
    }

    _legNodes;
    get legNodes() {
        return this._legNodes ?? [];
    }

    _runes;
    get runes() {
        return this._runes ?? [];
    }

    _skills;
    get skills() {
        return this._skills ?? [];
    }

    _tempers;
    get tempers() {
        return this._tempers ?? [];
    }

    getResource(name) {
        return this[name];
    }

    getSkillAffixValue(skillItem) {
        return skillItem.name;
    }

    buildTemperValueRegex(value) {
        return value
            .replace("$", "\\$")
            .replace("^", "\\^")
            .replace(".", "\\.")
            .replace("+", "\\+")
            .replace("*", "\\*")
            .replace("(", "\\(")
            .replace(")", "\\)")
            .replace("[", "\\[")
            .replace("]", "\\]")
            .replace(Language.temperValueMacros, " ?(\\+? ?[X0-9\\.,\\-% \\[\\]]+) ?");
    }

    getTemperValue(temperItem) {
        const names = [temperItem.type, temperItem.name];

        if (temperItem.detail && temperItem.detail.names.length > 0) {
            let detailName = temperItem.detail.names[0];

            if (temperItem.detail.value) {
                detailName = detailName.replace(Language.temperValueMacros, ` ${temperItem.detail.value} `);
            }

            names.push(detailName.trim());
        }

        return names.join(" ● ");
    }
}

class EnglishLanguage extends Language {
    constructor() {
        super();

        this._aspects = ExternalResource.getJsonResource("aspect_en");
        this._glyphs = ExternalResource.getJsonResource("glyph_en");
        this._unqItems = ExternalResource.getJsonResource("unq_item_en");
        this._legNodes = ExternalResource.getJsonResource("leg_node_en");
        this._runes = ExternalResource.getJsonResource("rune_en");
        this._skills = ExternalResource.getJsonResource("skill_en");
        this._tempers = ExternalResource.getJsonResource("temper_en");
    }

    getSkillAffixValue(skillItem, value) {
        return value
            ? `${value} to ${skillItem.name}`
            : `+ to ${skillItem.name}`;
    }
}

class RussianLanguage extends Language {
    constructor() {
        super();

        this._aspects = ExternalResource.getJsonResource("aspect_ru");
        this._glyphs = ExternalResource.getJsonResource("glyph_ru");
        this._unqItems = ExternalResource.getJsonResource("unq_item_ru");
        this._legNodes = ExternalResource.getJsonResource("leg_node_ru");
        this._runes = ExternalResource.getJsonResource("rune_ru");
        this._skills = ExternalResource.getJsonResource("skill_ru");
        this._tempers = ExternalResource.getJsonResource("temper_ru");
    }

    getSkillAffixValue(skillItem, value) {
        return value
            ? `${skillItem.name}: ${value} к уровню`
            : `${skillItem.name}: + к уровню`;
    }
}
