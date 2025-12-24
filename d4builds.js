class D4BuildsProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
        this.elementBuilder = new ElementBuilder("gray");
        this.resourceBuilder = new ResourceBuilder(this);
        this.skillBuilder = new SkillBuilder(this);
        this.affixBuilder = new AffixBuilder(this, /(?<value>\d+|[X0-9\.,\-% \[\]]+) to (?<skillName>.+)/);
        this.temperBuilder = new TemperBulder(this, / ?(?<value>\+? ?[X0-9\.,\-% \[\]]+)? ?/);
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

        const affixTargetValue = this.getAffixTargetValue(sourceValue);
        if (!affixTargetValue) {
            return false;
        }

        return this.addAffixNodeTargetValue(node, "d4br_affix_name", affixTargetValue);
    }

    getAffixTargetValue(sourceValue) {
        const fixedAffixValue = sourceValue
            .replace("to Heavy Weight", "to Heavyweight");

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
            .replace(/\[([0-9]+)\]/, "$1")
            .replace("Movement Speed for X Seconds", "Movement Speed for 4 Seconds");

        const sourceItem = this.temperBuilder.getSourceItem(fixedTemperValue);
        const targetItem = this.temperBuilder.getTargetItem(sourceItem);
        const targetValue = this.temperBuilder.buildValue(targetItem);

        return targetValue;
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems, true);
    }

    skillNameProcess(node) {
        if (!node.childNodes) {
            return false;
        }

        const sourceValue = node.childNodes[0].data?.trim();
        if (!sourceValue) {
            return false;
        }

        const fixedTemperValue = sourceValue
            .replace("En Guarde", "En Garde")
            .replace("Enhanced Defiance Aura", "Enhanced Defiance")
            .replace("Enhanced Fanaticism Aura", "Enhanced Fanaticism")
            .replace("Enhanced Holy Light Aura", "Enhanced Holy Light");

        const sourceItem = this.skillBuilder.getSourceItem(fixedTemperValue);
        const targetItem = this.skillBuilder.getTargetItem(sourceItem);
        const targetValue = this.skillBuilder.buildTargetValue(targetItem);

        if (!targetValue) {
            return false;
        }

        return this.addTargetValue(node, "d4br_skill_name", targetValue, false, false);
    }

    glyphNameProcess(node) {
        return this.nodeProcess(node, "d4br_glyph_name", Language.glyphs, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes, true);
    }

    gemNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes, false);
    }

    nodeProcess(node, className, resourceName, isIndependent) {
        if (!node.childNodes) {
            return false;
        }

        const sourceValue = node.childNodes[0].data;
        if (!sourceValue) {
            return false;
        }

        var sourceItem = this.resourceBuilder.getSourceItem(resourceName, sourceValue);
        const targetItem = this.resourceBuilder.getTargetItem(sourceItem);
        if (!targetItem) {
            return false;
        }

        return this.addTargetValue(node, className, targetItem.name, false, isIndependent);
    }

    addAffixNodeTargetValue(node, className, targetValue) {
        const affixNode = document.createElement("div");
        affixNode.style.marginLeft = "25px";
        affixNode.innerText = targetValue;

        return this.addTargetValue(node, className, affixNode.outerHTML, true, true);
    }

    addTargetValue(node, className, targetValue, isHtml, isIndependent) {
        if (!targetValue) {
            return false;
        }

        const container = isIndependent
            ? this.elementBuilder.addContainerBefore(node, className)
            : this.elementBuilder.createContainerByTag("div", className);

        if (isHtml) {
            container.innerHTML = targetValue;
        }
        else {
            container.innerText = targetValue;
        }

        if (!isIndependent) {
            node.innerHTML = `${container.outerHTML} ${node.innerHTML}`;
        }

        return true;
    }
}
