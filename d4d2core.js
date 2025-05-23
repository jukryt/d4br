class D4d2coreProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
        this.tooltipHash = 0;
        this.mouseClientX = 0;

        document.addEventListener("mousemove", e => this.onMouseMove(e));
    }

    onMouseMove(e) {
        this.mouseClientX = e.clientX;
    }

    mutationObserverCallback(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "attributes") {
                if (mutation.attributeName === "style" &&
                    mutation.target.style["display"] !== "none" &&
                    mutation.target.getAttribute("role") === "dialog") {

                    const tooltip = mutation.target;
                    const tooltipHash = StringExtension.hashCode(tooltip.innerText);
                    if (this.tooltipHash !== tooltipHash) {

                        this.tooltipHash = tooltipHash;

                        // remove old items
                        this.removeOldItems(tooltip);

                        // aspect, affix, temper
                        if (tooltip.querySelector("uni-view.legendary")) {
                            const titleNode = tooltip.querySelector("uni-view.item-title");
                            if (titleNode) {
                                this.aspectNameProcess(titleNode);

                                const affixNodes = tooltip.querySelectorAll("uni-view.line-affix:not(.tempered):not(.star):not(.hide-affix)");
                                for (const affixNode of affixNodes) {
                                    this.affixNameProcess(affixNode);
                                }

                                const temperNodes = tooltip.querySelectorAll("uni-view.line-affix.tempered");
                                for (const temperNode of temperNodes) {
                                    this.temperNameProcess(temperNode);
                                }
                            }
                        }
                        // unq item
                        else if (tooltip.querySelector("uni-view.uniqueItem")) {
                            const titleNode = tooltip.querySelector("uni-view.item-title");
                            if (titleNode) {
                                this.unqItemNameProcess(titleNode);
                            }
                        }
                        // skill
                        else if (tooltip.querySelector("uni-view.skill")) {
                            const titleNode = tooltip.querySelector("uni-view.item-title");
                            if (titleNode) {
                                this.skillNameProcess(titleNode);
                            }
                        }
                        // leg node, glyph
                        else if (tooltip.querySelector("uni-view.paragon")) {
                            const titleNode = tooltip.querySelector("uni-view.item-title");
                            if (titleNode) {
                                const _ =
                                    this.legNodeNameProcess(titleNode) ||
                                    this.glyphNameProcess(titleNode);
                            }
                        }
                        // rune
                        else if (tooltip.querySelector("uni-view.rune")) {
                            const titleNode = tooltip.querySelector("uni-view.item-title");
                            if (titleNode) {
                                this.runeNameProcess(titleNode);
                            }
                        }
                    }

                    this.fixPopupPosotion(tooltip);
                }
            }
        }
    }

    fixPopupPosotion(node) {
        if (!node || !node.style["top"]) {
            return false;
        }

        const minTop = window.scrollY;
        const maxBottom = window.innerHeight + minTop;
        const nodeRect = node.getBoundingClientRect();

        const currentLeft = nodeRect.left;
        const currentTop = nodeRect.top;
        let newLeft = currentLeft;
        let newTop = currentTop;

        if (nodeRect.left <= this.mouseClientX &&
            nodeRect.right >= this.mouseClientX) {
            newLeft = this.mouseClientX + 20;
        }

        if (nodeRect.top > 0 && maxBottom < nodeRect.bottom) {
            newTop = maxBottom - nodeRect.height;

            if (newTop < minTop) {
                newTop = minTop;
            }
        }
        else if (nodeRect.top < 0 && maxBottom > nodeRect.bottom) {
            newTop = maxBottom - nodeRect.height;

            if (newTop > minTop) {
                newTop = minTop;
            }
        }

        if (newLeft !== currentLeft) {
            node.style["left"] = `${newLeft}px`;
        }

        if (newTop !== currentTop) {
            node.style["top"] = `${newTop}px`;
        }
    }

    removeOldItems(node) {
        const childs = node.querySelectorAll(".d4br_item");
        for (const child of childs) {
            child.remove();
        }
    }

    getCharClassName() {
        const gearContainer = document.querySelector("uni-view.gear-content");
        return gearContainer.classList[2];
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", Language.aspects);
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
        return this.addAffixNodeTargetValue(node, "d4br_affix_name", targetAffixValue);
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
        return this.addAffixNodeTargetValue(node, "d4br_temper_name", targetTemperValue);
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
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", Language.skills);
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

    nodeProcess(node, className, resourceName) {
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

        return this.addTargetValue(node, className, targetItem.name);
    }

    addAffixNodeTargetValue(node, className, targetValue) {
        const newNode = document.createElement("div");
        newNode.style["margin-top"] = "0.3em";
        newNode.style["margin-left"] = "25px";
        newNode.style.opacity = "0.8";
        newNode.innerText = targetValue;

        return this.addTargetValue(node, className, newNode.outerHTML, true);
    }

    addTargetValue(node, className, targetValue, isHtml = false) {
        if (!targetValue) {
            return false;
        }

        const nodeStyle = window.getComputedStyle(node);

        const valueNode = document.createElement("div");
        valueNode.className = `d4br_show d4br_item ${className}`;
        valueNode.style["font-family"] = nodeStyle.getPropertyValue("font-family");
        valueNode.style["font-size"] = nodeStyle.getPropertyValue("font-size");
        valueNode.style["text-align"] = nodeStyle.getPropertyValue("text-align");
        valueNode.style["color"] = "gray";

        if (isHtml) {
            valueNode.innerHTML = targetValue;
        }
        else {
            valueNode.innerText = targetValue;
        }

        node.parentNode.insertBefore(valueNode, node);

        valueNode.style["margin-top"] = nodeStyle.getPropertyValue("margin-top");
        valueNode.style["margin-bottom"] = `-${nodeStyle.getPropertyValue("margin-top")}`;

        return true;
    }
}
