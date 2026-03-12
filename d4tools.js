class ExternalResource {
    static getStringResource(name) {
        const text = GM_getResourceText(name);
        if (!text) {
            return "";
        }
        return text;
    }

    static getJsonResource(name) {
        const text = ExternalResource.getStringResource(name);
        if (!text) {
            return null;
        }
        return JSON.parse(text);
    }

    static applyCss(name) {
        const css = ExternalResource.getStringResource(name);
        GM_addStyle(css);
    }
}

class StringExtension {
    static equelsIgnoreCase(str1, str2) {
        return str1?.toLowerCase() === str2?.toLowerCase();
    }

    static startsWithIgnoreCase(sourceString, searchString, position) {
        return sourceString && searchString &&
            sourceString.toLowerCase().startsWith(searchString.toLowerCase(), position);
    }

    static endsWithIgnoreCase(sourceString, searchString, position) {
        return sourceString && searchString &&
            sourceString.toLowerCase().endsWith(searchString.toLowerCase(), position);
    }

    static escapeRegexChars(sourceString) {
        return sourceString?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
