class D4d2coreProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
        this.elementBuilder = new ElementBuilder("gray");
        this.resourceBuilder = new ResourceBuilder(this);
        this.affixBuilder = new AffixBuilder(this, /(?<value>\+\d+) to (?<skillName>.+)/);
        this.temperBuilder = new TemperBulder(this, / ?(?<value>\+? ?[0-9\.,\-% ]+)? ?/);

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
        const childs = node.querySelectorAll(".d4br_element");
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

        var sourceItem = this.resourceBuilder.getSourceItem(resourceName, sourceValue);
        const targetItem = this.resourceBuilder.getTargetItem(sourceItem);

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
