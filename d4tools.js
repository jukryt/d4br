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

    static startsWithIgnoreCase(sourceString, searchString, position) {
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

    static escapeRegexChars(sourceString) {
        return sourceString?.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }
}
