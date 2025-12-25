class D4MaxrollProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
        this.elementBuilder = new ElementBuilder("darkgray");
        this.resourceBuilder = new ResourceBuilder(this);
        this.skillBuilder = new SkillBuilder(this);
        this.affixBuilder = new AffixBuilder(this, /(?<value>\+\d+) to (?<skillName>.+)/);
        this.temperBuilder = new TemperBulder(this, / ?(?<value>\+? ?[0-9\.,\-% ]+)? ?/);
    }

    mutationObserverCallback(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "attributes") {
                if (mutation.attributeName === "style" &&
                    mutation.target.className.startsWith("_Tooltip__positioner_orqi")) {
                    const positioner = mutation.target;
                    this.fixPopupPosotion(positioner);
                }
            } else if (mutation.type === "childList") {
                if (mutation.target.id === "uitools-tooltip-root") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.className.startsWith("_Tooltip_orqi")) {
                            this.fixPopupStyle(newNode);
                        }

                        // legendary: aspect, affix, temper, leg node, glyph, rune, elixir
                        if (newNode.querySelector("div.d4t-tip-legendary")) {
                            const titleNodes = newNode.querySelectorAll("div.d4t-title");
                            const subTitleNode = newNode.querySelector("div.d4t-sub-title");
                            for (const titleNode of titleNodes) {
                                if (this.legNodeNameProcess(titleNode) ||
                                    this.glyphNameProcess(titleNode) ||
                                    this.runeNameProcess(titleNode) ||
                                    this.elixirNameProcess(titleNode) ||
                                    this.aspectNameProcess(titleNode, subTitleNode)) {
                                    break;
                                }
                            }

                            const affixNodes = newNode.querySelectorAll("li.d4t-list-affix, li.d4t-list-greater");
                            for (const affixNode of affixNodes) {
                                this.affixNameProcess(affixNode);
                            }

                            const temperNodes = newNode.querySelectorAll("li.d4t-list-tempered");
                            for (const temperNode of temperNodes) {
                                this.temperNameProcess(temperNode);
                            }

                            const runeWordNode = newNode.querySelector("div.d4t-socket div.d4t-effect div.d4t-name");
                            if (runeWordNode) {
                                this.runeWordProcess(runeWordNode);
                            }
                        }
                        // common: elixir
                        else if (newNode.querySelector("div.d4t-tip-common")) {
                            const titleNodes = newNode.querySelectorAll("div.d4t-title");
                            for (const titleNode of titleNodes) {
                                if (this.elixirNameProcess(titleNode)) {
                                    break;
                                }
                            }
                        }
                        // rare: glyph, rune, elixir
                        else if (newNode.querySelector("div.d4t-tip-rare")) {
                            const titleNodes = newNode.querySelectorAll("div.d4t-title");
                            for (const titleNode of titleNodes) {
                                if (this.glyphNameProcess(titleNode) ||
                                    this.runeNameProcess(titleNode) ||
                                    this.elixirNameProcess(titleNode)) {
                                    break;
                                }
                            }
                        }
                        // magic: rune, elixir
                        else if (newNode.querySelector("div.d4t-tip-magic")) {
                            const titleNodes = newNode.querySelectorAll("div.d4t-title");
                            for (const titleNode of titleNodes) {
                                if (this.runeNameProcess(titleNode) ||
                                    this.elixirNameProcess(titleNode)) {
                                    break;
                                }
                            }
                        }
                        // unq item
                        else if (newNode.querySelector("div.d4t-tip-unique")) {
                            const titleNode = newNode.querySelector("div.d4t-title");
                            if (titleNode) {
                                this.unqItemNameProcess(titleNode);
                            }

                            const runeWordNode = newNode.querySelector("div.d4t-socket div.d4t-effect div.d4t-name");
                            if (runeWordNode) {
                                this.runeWordProcess(runeWordNode);
                            }
                        }
                        // mythic item
                        else if (newNode.querySelector("div.d4t-tip-mythic")) {
                            const titleNode = newNode.querySelector("div.d4t-title");
                            if (titleNode) {
                                this.unqItemNameProcess(titleNode);
                            }

                            const runeWordNode = newNode.querySelector("div.d4t-socket div.d4t-effect div.d4t-name");
                            if (runeWordNode) {
                                this.runeWordProcess(runeWordNode);
                            }
                        }
                        // skill
                        else if (newNode.querySelector("div.d4t-tip-skill")) {
                            const skillTitleNode = newNode.querySelector("div.d4t-title");
                            if (skillTitleNode) {
                                this.skillNameProcess(skillTitleNode);
                            }
                        }
                    }
                }
            }
        }
    }

    fixPopupStyle(node) {
        // reduce font size for fix disabled scroll

        const mainNode = node.querySelector("div.d4t-GameTooltip");
        if (mainNode) {
            mainNode.style["font-size"] = "16px";
            mainNode.style["min-width"] = "400px";
        }

        const tagNodes = node.querySelectorAll("div.d4t-SkillTagTooltip");
        for (const tagNode of tagNodes) {
            tagNode.style["font-size"] = "14px";
        }
    }

    fixPopupPosotion(node) {
        if (!node || !node.style["top"]) {
            return false;
        }

        const maxHeight = window.innerHeight;
        const nodeRect = node.getBoundingClientRect();
        const currentTop = nodeRect.top;
        let newTop = currentTop;

        if (nodeRect.top > 0 && maxHeight < nodeRect.bottom) {
            newTop = maxHeight - nodeRect.height;

            if (newTop < 0) {
                newTop = 0;
            }
        }
        else if (nodeRect.top < 0 && maxHeight > nodeRect.bottom) {
            newTop = maxHeight - nodeRect.height;

            if (newTop > 0) {
                newTop = 0;
            }
        }

        if (newTop !== currentTop) {
            node.style["top"] = `${newTop}px`;
        }
    }

    getCharClassName() {
        const classNameTitle = document.querySelector("div.d4t-Paperdoll div.d4t-title");
        return classNameTitle?.innerText;
    }

    aspectNameProcess(titleNode, subTitleNode) {
        if (!subTitleNode) {
            return false;
        }

        const className = "d4br_aspect_name";
        const subTitleValue = subTitleNode.innerText;
        // aspect node
        if (subTitleValue === "Legendary Aspect") {
            return this.nodeProcess(titleNode, className, Language.aspects);
        }
        // item node
        else {
            const titleValue = titleNode.innerText;
            const self = this;

            const sourceItem = this.sourceLanguage.aspects.find(i => { return self.aspectNameFilter(i, titleValue); });
            if (!sourceItem) {
                return false;
            }

            const targetItem = this.targetLanguage.aspects.find(i => i.id === sourceItem.id);
            if (!targetItem) {
                return false;
            }

            return this.addTargetValue(titleNode, className, targetItem.name);
        }
    }

    aspectNameFilter(sourceItem, titleValue) {
        const aspectIndex = sourceItem.name.indexOf("Aspect");
        // [Aspect of ...] => [Item_Name of Aspect_Name]
        if (aspectIndex === 0) {
            const aspectName = sourceItem.name.substring(6);
            if (StringExtension.endsWithIgnoreCase(titleValue, aspectName)) {
                return true;
            }
        }
        // [... Aspect] => [Aspect_Name Item_Name]
        else {
            const aspectName = sourceItem.name.substring(0, aspectIndex);
            if (StringExtension.startsWithIgnoreCase(titleValue, aspectName)) {
                return true;
            }
        }

        return false;
    }

    affixNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const affixTargetValue = this.getAffixTargetValue(sourceValue);
        if (!affixTargetValue) {
            return false;
        }

        return this.addAffixNodeTargetValue(node, "d4br_affix_name", affixTargetValue);
    }

    getAffixTargetValue(sourceValue) {
        const fixedAffixValue = sourceValue
            .replace(/\([^\)]+\)/, "") // (text)
            .replace(/\[[0-9\., \-]+\]%?/, "") // [values]
            .trim();

        const sourceItem = this.affixBuilder.getSourceItem(fixedAffixValue);
        const targetItem = this.affixBuilder.getTargetItem(sourceItem);
        const targetValue = this.affixBuilder.buildTargetValue(targetItem);

        return targetValue;
    }

    temperNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const temperTargetValue = this.getTemperTargetValue(sourceValue);
        if (!temperTargetValue) {
            return false;
        }

        return this.addAffixNodeTargetValue(node, "d4br_temper_name", temperTargetValue);
    }

    getTemperTargetValue(sourceValue) {
        const fixedTemperValue = sourceValue
            .replace(/\([^\)]+\)/, "") // (text)
            .replace(/\[[0-9\., \-]+\]%?/, "") // [values]
            .trim();

        const sourceItem = this.temperBuilder.getSourceItem(fixedTemperValue);
        const targetItem = this.temperBuilder.getTargetItem(sourceItem);
        const targetValue = this.temperBuilder.buildValue(targetItem);

        return targetValue;
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems);
    }

    runeWordProcess(node) {
        const sourceValue = node.querySelector("span")?.innerText;
        if (!sourceValue) {
            return false;
        }

        const runeWordMaths = sourceValue.match(/[A-Z][a-z]+/g);
        if (!runeWordMaths) {
            return false;
        }

        const targetValue = runeWordMaths.map(runeName => {
            const sourceItem = this.resourceBuilder.getSourceItem(Language.runes, runeName);
            const targetItem = this.resourceBuilder.getTargetItem(sourceItem);
            return targetItem?.name;
        }).filter(x => x).join(" ");

        if (!targetValue) {
            return false;
        }

        return this.addAffixNodeTargetValue(node, "d4br_runeWord_name", targetValue);
    }

    skillNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const sourceItem = this.skillBuilder.getSourceItem(sourceValue);
        const targetItem = this.skillBuilder.getTargetItem(sourceItem);
        const targetValue = this.skillBuilder.buildTargetValue(targetItem);

        if (!targetValue) {
            return false;
        }

        return this.addTargetValue(node, "d4br_skill_name", targetValue);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", Language.glyphs);
    }

    runeNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes);
    }

    elixirNameProcess(node) {
        return this.nodeProcess(node, "d4br_elixir_name", Language.elixir);
    }

    nodeProcess(node, className, resourceName) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        var sourceItem = this.resourceBuilder.getSourceItem(resourceName, sourceValue);
        const targetItem = this.resourceBuilder.getTargetItem(sourceItem);

        if (!targetItem) {
            return false;
        }

        return this.addTargetValue(node, className, targetItem.name);
    }

    addAffixNodeTargetValue(node, className, targetValue) {
        const affixNode = document.createElement("div");
        affixNode.style.opacity = "0.6";
        affixNode.innerText = targetValue;

        if (node.parentNode.firstChild !== node) {
            affixNode.style.marginTop = "0.3em";
        }

        return this.addTargetValue(node, className, affixNode.outerHTML, true);
    }

    addTargetValue(node, className, targetValue, isHtml = false) {
        if (!targetValue) {
            return false;
        }

        const container = this.elementBuilder.addContainerBefore(node, className);
        if (isHtml) {
            container.innerHTML = targetValue;
        }
        else {
            container.innerText = targetValue;
        }

        return true;
    }
}
