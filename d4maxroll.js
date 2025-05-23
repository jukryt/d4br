class D4MaxrollProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
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

                        // legendary: aspect, affix, temper, leg node, glyph, rune
                        if (newNode.querySelector("div.d4t-tip-legendary")) {
                            const titleNodes = newNode.querySelectorAll("div.d4t-title");
                            const subTitleNode = newNode.querySelector("div.d4t-sub-title");
                            for (const titleNode of titleNodes) {
                                if (this.legNodeNameProcess(titleNode) ||
                                    this.glyphNameProcess(titleNode) ||
                                    this.runeNameProcess(titleNode) ||
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
                        }
                        // rare: glyph, rune
                        else if (newNode.querySelector("div.d4t-tip-rare")) {
                            const titleNodes = newNode.querySelectorAll("div.d4t-title");
                            for (const titleNode of titleNodes) {
                                if (this.glyphNameProcess(titleNode) ||
                                    this.runeNameProcess(titleNode)) {
                                    break;
                                }
                            }
                        }
                        // magic: rune
                        else if (newNode.querySelector("div.d4t-tip-magic")) {
                            const titleNodes = newNode.querySelectorAll("div.d4t-title");
                            for (const titleNode of titleNodes) {
                                if (this.runeNameProcess(titleNode)) {
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
                        }
                        // mythic item
                        else if (newNode.querySelector("div.d4t-tip-mythic")) {
                            const titleNode = newNode.querySelector("div.d4t-title");
                            if (titleNode) {
                                this.unqItemNameProcess(titleNode);
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
            return this.nodeProcess(titleNode, className, Language.aspects, true);
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

            return this.setTargetValue(titleNode, className, targetItem.name, true);
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
            if (StringExtension.startswithIgnoreCase(titleValue, aspectName)) {
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

        const charClassName = this.getCharClassName();
        if (!charClassName) {
            return false;
        }

        const affixValue = sourceValue
            .replace(/\([^\)]+\)/, "") // (text)
            .replace(/\[[0-9\., \-]+\]%?/, "") // [values]
            .trim();

        const skillNameMatch = affixValue.match(/(\+\d+) to (.+)/);
        if (!skillNameMatch) {
            return false;
        }

        const value = skillNameMatch[1];
        const skillName = skillNameMatch[2];

        const skills = this.sourceLanguage.skills.filter(i => i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
        const sourceItems = skills.filter(i => StringExtension.equelsIgnoreCase(i.name, skillName));
        if (sourceItems.length != 1) {
            return false;
        }

        const sourceItem = sourceItems[0];
        const targetItem = this.targetLanguage.skills.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        const targetAffixValue = this.targetLanguage.getSkillAffixValue(targetItem, value);
        return this.setAffixNodeTargetValue(node, "d4br_affix_name", targetAffixValue);
    }

    temperNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const charClassName = this.getCharClassName();
        if (!charClassName) {
            return false;
        }

        const temperValue = sourceValue
            .replace(/\([^\)]+\)/, "") // (text)
            .replace(/\[[0-9\., \-]+\]%?/, "") // [values]
            .trim();

        const sourceItem = this.getTemperSourceItem(charClassName, temperValue);
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.tempers.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        targetItem.detail = targetItem.details.find(v => v.id === sourceItem.detail.id);
        targetItem.detail.value = sourceItem.detail.value;

        const targetTemperValue = this.targetLanguage.getTemperValue(targetItem);
        return this.setAffixNodeTargetValue(node, "d4br_temper_name", targetTemperValue);
    }

    getTemperSourceItem(charClassName, sourceTemperValue) {
        const tempers = this.sourceLanguage.tempers
            .filter(i => {
                return !i.classes || i.classes.length === 0 ||
                    (charClassName && i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
            })
            .filter(i => i.details);

        let sourceItems = tempers.filter(t => {
            const details = t.details.filter(d => {
                var names = d.names.filter(n => {
                    const valueRegex = this.sourceLanguage.buildTemperValueRegex(n);
                    const valueMatch = sourceTemperValue.match(valueRegex);

                    if (valueMatch &&
                        valueMatch.index === 0 &&
                        valueMatch[0] === sourceTemperValue) {
                        d.value = valueMatch[1].trim();
                        return true;
                    }
                });
                return names.length === 1;
            });

            if (details.length === 1) {
                t.detail = details[0];
                return true;
            }
        });

        if (sourceItems.length === 0) {
            return null;
        }

        if (sourceItems.length > 1) {
            if (Array.from(new Set(sourceItems.map(i => i.type))).length === 1) {
                const classItem = sourceItems.find(i => i.classes && i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
                if (classItem) {
                    sourceItems = [classItem];
                } else {
                    sourceItems = [sourceItems[0]];
                }
            }
            else {
                return null;
            }
        }

        return sourceItems[0];
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", Language.skills, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes, true);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", Language.glyphs, true);
    }

    runeNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes, true);
    }

    nodeProcess(node, className, resourceName, addSourceValue) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const charClassName = this.getCharClassName();

        const availableItems = this.sourceLanguage.getResource(resourceName).filter(i => {
            return !i.classes || i.classes.length === 0 ||
                (charClassName && i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
        });

        const sourceItems = availableItems.filter(i => StringExtension.equelsIgnoreCase(i.name, sourceValue));

        if (sourceItems.length != 1) {
            return false;
        }

        const sourceItem = sourceItems[0];
        const targetItem = this.targetLanguage.getResource(resourceName).find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, className, targetItem.name, addSourceValue);
    }

    setAffixNodeTargetValue(node, className, targetValue) {
        const newNode = document.createElement("div");
        newNode.style["margin-top"] = "0.3em";
        newNode.style.opacity = "0.6";
        node.parentNode.insertBefore(newNode, node);

        return this.setTargetValue(newNode, className, targetValue, false);
    }

    setTargetValue(node, className, targetValue, addSourceValue) {
        if (!targetValue) {
            return false;
        }

        let htmlValue = this.buildHtmlValue(className, targetValue);
        if (addSourceValue) {
            htmlValue += node.innerHTML;
        }

        node.innerHTML = htmlValue;
        return true;
    }

    buildHtmlValue(className, value) {
        return `<div class="d4br_show ${className}" style="color:darkgray;">${value}</div>`;
    }
}
