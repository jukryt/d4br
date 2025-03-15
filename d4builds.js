class D4BuildsProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
    }

    mutationObserverCallback(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "attributes") {
                if (mutation.attributeName === "style" &&
                    mutation.target.id.startsWith("tippy-")) {
                    const tippy = mutation.target;
                    this.fixPopupStyleBug(tippy);
                }
            } else if (mutation.type === "childList") {
                if (mutation.target.localName === "body") {
                    for (const newNode of mutation.addedNodes) {
                        if (newNode.id.startsWith("tippy-")) {
                            // aspect, affix, temper
                            if (newNode.querySelector("div.codex__tooltip")) {
                                const aspectNameNode = newNode.querySelector("div.codex__tooltip__name");
                                if (aspectNameNode) {
                                    this.aspectNameProcess(aspectNameNode);
                                }

                                const affixesNode = newNode.querySelector("div.codex__tooltip__stats:not(.codex__tooltip__stats--tempering)");
                                if (affixesNode) {
                                    const affixValueNodes = affixesNode.querySelectorAll("div.codex__tooltip__stat");
                                    for (const affixValueNode of affixValueNodes) {
                                        this.affixNameProcess(affixValueNode);
                                    }
                                }

                                const tempersNode = newNode.querySelector("div.codex__tooltip__stats--tempering");
                                if (tempersNode) {
                                    const temperValueNodes = tempersNode.querySelectorAll("div.codex__tooltip__stat");
                                    for (const temperValueNode of temperValueNodes) {
                                        this.temperNameProcess(temperValueNode);
                                    }
                                }
                            }
                            // generic: affix, temper
                            if (newNode.querySelector("div.generic__tooltip")) {
                                const genericTooltips = newNode.querySelectorAll("div.generic__tooltip");
                                for (const genericTooltip of genericTooltips) {
                                    if (this.genericAffixNameProcess(genericTooltip) ||
                                        this.genericTemperNameProcess(genericTooltip)) {
                                        break;
                                    }
                                }
                            }
                            // unq item
                            else if (newNode.querySelector("div.unique__tooltip")) {
                                const unqItemNameNode = newNode.querySelector("h2.unique__tooltip__name");
                                if (unqItemNameNode) {
                                    this.unqItemNameProcess(unqItemNameNode);
                                }
                            }
                            // skill
                            else if (newNode.querySelector("div.skill__tooltip")) {
                                const skillNameNode = newNode.querySelector("div.skill__tooltip__name");
                                if (skillNameNode) {
                                    this.skillNameProcess(skillNameNode);
                                }
                            }
                            // glyph
                            else if (newNode.querySelector("div.paragon__tile__tooltip__rarity.rare")) {
                                const paragonTitleNode = newNode.querySelector("div.paragon__tile__tooltip__title");
                                if (paragonTitleNode) {
                                    this.glyphNameProcess(paragonTitleNode);
                                }
                            }
                            // leg node
                            else if (newNode.querySelector("div.paragon__tile__tooltip__rarity.legendary")) {
                                const paragonTitleNode = newNode.querySelector("div.paragon__tile__tooltip__title");
                                if (paragonTitleNode) {
                                    this.legNodeNameProcess(paragonTitleNode);
                                }
                            }
                            // gem
                            else if (newNode.querySelector("div.gem__tooltip")) {
                                const gemTitleNode = newNode.querySelector("div.gem__tooltip__name");
                                if (gemTitleNode) {
                                    this.gemNameProcess(gemTitleNode);
                                }
                            }
                        }
                    }
                }
            }
        }
    }

    fixPopupStyleBug(node) {
        return this.transformTranslateProcess(node) ||
            this.transformTranslate3dProcess(node)
    }

    transformTranslateProcess(node) {
        const transformValue = node.style.getPropertyValue("transform");
        if (!transformValue) {
            return false
        }

        const transformMatch = transformValue.match(/translate\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/);
        if (!transformMatch) {
            return false;
        }

        const clientRect = node.getBoundingClientRect();
        const elementTop = clientRect.top;
        if (elementTop >= 0) {
            return true;
        }

        let transformX = +transformMatch[1];
        let transformY = +transformMatch[3];

        transformY = -elementTop + transformY;
        const newTransformValue = `translate(${transformX}px, ${transformY}px)`;
        node.style.setProperty("transform", newTransformValue);

        return true;
    }

    transformTranslate3dProcess(node) {
        const transformValue = node.style.getPropertyValue("transform");
        if (!transformValue) {
            return false
        }

        const transformMatch = transformValue.match(/translate3d\((-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px, (-?\d+(\.\d+)?)px\)/);
        if (!transformMatch) {
            return false;
        }

        const clientRect = node.getBoundingClientRect();
        const elementTop = clientRect.top;
        if (elementTop >= 0) {
            return true;
        }

        let transformX = +transformMatch[1];
        let transformY = +transformMatch[3];
        let transformZ = +transformMatch[5];

        transformY = -elementTop + transformY;
        const newTransformValue = `translate3d(${transformX}px, ${transformY}px, ${transformZ}px)`;
        node.style.setProperty("transform", newTransformValue);

        return true;
    }

    getCharClassName() {
        const classNameHeader =
            document.querySelector("div.builder__header__title h2.builder__header__description") ?? // build
            document.querySelector("button.builder__header__selection h2.builder__header__name");   // planner

        return classNameHeader?.innerText?.replace(" Build", "");
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", Language.aspects, false);
    }

    affixNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const affixTargetName = this.getAffixTargetName(sourceValue);
        if (!affixTargetName) {
            return false;
        }

        return this.setAffixNodeTargetValue(node, "d4br_affix_name", affixTargetName);
    }

    genericAffixNameProcess(node) {
        const className = "d4br_affix_name";

        let existsNode = node.parentNode?.querySelector(`div.${className}`);
        if (existsNode) {
            existsNode.parentNode.remove();
            existsNode = null;
        }

        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const affixTargetName = this.getAffixTargetName(sourceValue);
        if (!affixTargetName) {
            return false;
        }

        const newNode = document.createElement("div");
        newNode.className = "generic__tooltip";
        node.parentNode.insertBefore(newNode, node);

        return this.setTargetValue(newNode, className, affixTargetName, false);
    }

    getAffixTargetName(sourceValue) {
        const charClassName = this.getCharClassName();
        if (!charClassName) {
            return null;
        }

        const skillNameMatch = sourceValue.match(/Ranks (to )?(.+)/);
        if (!skillNameMatch) {
            return null;
        }

        const skillName = skillNameMatch[2];
        const skills = this.sourceLanguage.skills.filter(i => i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
        const sourceItems = skills.filter(i => StringExtension.equelsIgnoreCase(i.name, skillName));
        if (sourceItems.length != 1) {
            return null;
        }

        const sourceItem = sourceItems[0];
        const targetItem = this.targetLanguage.skills.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return null;
        }

        return targetItem.name;
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

        const targetTemperName = this.getTemperTargetName(charClassName, sourceValue);
        if (!targetTemperName) {
            return false;
        }

        return this.setAffixNodeTargetValue(node, "d4br_temper_name", targetTemperName);
    }

    genericTemperNameProcess(node) {
        const className = "d4br_temper_name";

        let existsNode = node.parentNode?.querySelector(`div.${className}`);
        if (existsNode) {
            existsNode.parentNode.remove();
            existsNode = null;
        }

        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const charClassName = this.getCharClassName();
        if (!charClassName) {
            return false;
        }

        const temperNameMatchs = [...sourceValue.matchAll(/\(([^\(\)]+) - ([^\(\)]+)\)/g)];
        if (temperNameMatchs.length === 0) {
            return false;
        }

        const temperNameMatch = temperNameMatchs[temperNameMatchs.length - 1];
        const temperValue = sourceValue.replace(temperNameMatch[0], "").trim();

        const targetTemperName = this.getTemperTargetName(charClassName, temperValue);
        if (!targetTemperName) {
            return false;
        }

        const newNode = document.createElement("div");
        newNode.className = "generic__tooltip";
        node.parentNode.insertBefore(newNode, node);

        return this.setTargetValue(newNode, className, targetTemperName, false);
    }

    getTemperTargetName(charClassName, temperValue) {
        const sourceItem = this.getTemperSourceItem(charClassName, temperValue);
        if (!sourceItem) {
            return null;
        }

        const targetItem = this.targetLanguage.tempers.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return null;
        }

        let targetTemperName = targetItem.name;

        const sourceTemperType = this.sourceLanguage.temperTypes.find(i => i.name === sourceItem.type);
        if (sourceTemperType) {
            const targetTemperType = this.targetLanguage.temperTypes.find(i => i.id === sourceTemperType.id);
            if (targetTemperType) {
                targetTemperName = targetTemperType.name + " - " + targetTemperName;
            }
        }

        return targetTemperName;
    }

    getTemperSourceItem(charClassName, temperValue) {
        const tempers = this.sourceLanguage.tempers.filter(i => i.values && (i.class === charClassName || i.class === "All"));
        let sourceItems = tempers.filter(i => i.values.some(s => {
            const match = temperValue.match(s)
            return match &&
                match.index === 0 &&
                match[0] === temperValue;
        }));

        if (sourceItems.length === 0) {
            return null;
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
                return null;
            }
        }

        return sourceItems[0];
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems, false);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", Language.skills, false);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", Language.glyphs, false);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes, false);
    }

    gemNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes, false);
    }

    setAffixNodeTargetValue(node, className, targetValue) {
        const newNode = document.createElement("div");
        newNode.style["margin-left"] = "25px";
        node.parentNode.insertBefore(newNode, node);

        return this.setTargetValue(newNode, className, targetValue, false);
    }

    nodeProcess(node, className, resourceName, addSourceValue) {
        if (!node.childNodes) {
            return false;
        }

        const sourceValue = node.childNodes[0].data;
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
        return `<div class="d4br_show ${className}" style="color:gray; font-size:15px;">${value}</div>`;
    }
}
