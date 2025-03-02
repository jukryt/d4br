class D4MaxrollProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
    }

    mutationObserverCallback(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "childList") {
                if (mutation.target.id === "uitools-tooltip-root") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.className === "uitools-tooltip-frame ui-tooltip-active") {
                            // legendary: aspect, leg node, glyph, rune
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
    }

    getCharClassName() {
        const classNameTitle =
            document.querySelector("div.d4t-PlannerLink div.d4t-title") ??  // guide
            document.querySelector("div.header_Header__buildTitle__WS8cB"); // planner

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
            if (titleValue.endsWith(aspectName)) {
                return true;
            }
        }
        // [... Aspect] => [Aspect_Name Item_Name]
        else {
            const aspectName = sourceItem.name.substring(0, aspectIndex);
            if (titleValue.startsWith(aspectName)) {
                return true;
            }
        }

        return false;
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
            .replace(/\[[0-9\. \-]+\]%?/, "") // [values]
            .trim();

        const tempers = this.sourceLanguage.tempers.filter(i => i.values && (i.class === charClassName || i.class === "All"));
        let sourceItems = tempers.filter(i => i.values.some(s => {
            const match = temperValue.match(s)
            return match &&
                match.index === 0 &&
                match[0] === temperValue;
        }));

        if (sourceItems.length === 0) {
            return false;
        }

        if (sourceItems.length > 1) {
            if (Array.from(new Set(sourceItems.map(i => i.type))).length === 1) {
                const classItem = sourceItems.find(i => i.class === charClassName);
                if (classItem) {
                    sourceItems = [classItem];
                } else {
                    sourceItems = [sourceItems[0]];
                }
            }
            else {
                return false;
            }
        }

        const sourceItem = sourceItems[0];
        const targetItem = this.targetLanguage.tempers.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        let targetTemperName = targetItem.name;

        const sourceTemperType = this.sourceLanguage.temperTypes.find(i => i.name === sourceItem.type);
        if (sourceTemperType) {
            const targetTemperType = this.targetLanguage.temperTypes.find(i => i.id === sourceTemperType.id);
            if (targetTemperType) {
                targetTemperName = targetTemperType.name + " - " + targetTemperName;
            }
        }

        const newNode = document.createElement("div");
        newNode.style["margin-top"] = "5px";
        newNode.style.opacity = "0.6";
        node.parentNode.insertBefore(newNode, node);

        return this.setTargetValue(newNode, "d4br_temper_name", targetTemperName, false);
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
        if (!charClassName) {
            return false;
        }

        const sourceItems = this.sourceLanguage.getResource(resourceName).filter(i => {
            return i.name === sourceValue &&
                (!i.classes || i.classes.length === 0 || i.classes.find(c => c === charClassName))
        });

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
        return `<div class="d4br_show ${className}" style="color:darkgray; font-size:18px;">${value}</div>`;
    }
}
