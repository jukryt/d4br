class D4MobalyticsProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
        this.elementBuilder = new ElementBuilder("darkgray");
        this.resourceBuilder = new ResourceBuilder(this);
        this.skillBuilder = new SkillBuilder(this);
        this.affixBuilder = new AffixBuilder(this, /Ranks (?:to )?(?<skillName>.+)/);
        this.temperBuilder = new TemperBulder(this, / ?(?:(?:(?:B|b)onus)|(?:(?:R|r)anks)|(?<value>\+))? ?/);
    }

    mutationObserverCallback(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                if (mutation.target.id.startsWith("tippy-")) {
                    const tippyNode = mutation.target;
                    // aspect, affix, temper
                    if (tippyNode.querySelector("div.xb3r6kr img[src*='/aspects/']")) {
                        const aspectNameNode = tippyNode.querySelector("p.x2klb21");
                        if (aspectNameNode) {
                            this.aspectNameProcess(aspectNameNode);
                        }

                        const affisNameNodes = tippyNode.querySelectorAll("li.x1fc57z9:not(:has(span.xkirm3x))");
                        for (const affisNameNode of affisNameNodes) {
                            this.affixNameProcess(affisNameNode);
                        }

                        const temperNameNodes = tippyNode.querySelectorAll("li.x1fc57z9:has(span.xkirm3x)");
                        for (const temperNameNode of temperNameNodes) {
                            this.temperNameProcess(temperNameNode);
                        }

                        const runeNameNodes = tippyNode.querySelectorAll("li.x1fc57z9:has(img[src*='/runes/'])");
                        for (const runeNameNode of runeNameNodes) {
                            this.runeNameInItemProcess(runeNameNode);
                        }
                    }
                    // unq item
                    else if (tippyNode.querySelector("div.xb3r6kr img[src*='/uniques/']")) {
                        const unqItemNameNode = tippyNode.querySelector("p.x2klb21");
                        if (unqItemNameNode) {
                            this.unqItemNameProcess(unqItemNameNode);
                        }

                        const runeNameNodes = tippyNode.querySelectorAll("li.x1fc57z9:has(img[src*='/runes/'])");
                        for (const runeNameNode of runeNameNodes) {
                            this.runeNameInItemProcess(runeNameNode);
                        }
                    }
                    // skill (old)
                    else if (tippyNode.querySelector("div.m-1saunj6")) {
                        const skillNameNode = tippyNode.querySelector("p.m-foqf9j");
                        if (skillNameNode) {
                            this.skillNameProcess(skillNameNode);
                        }
                    }
                    // skill (new)
                    else if (tippyNode.querySelector("div.xb3r6kr img[src*='/skills/'")) {
                        const skillNameNode = tippyNode.querySelector("p.x2klb21");
                        if (skillNameNode) {
                            this.skillNameProcess(skillNameNode);
                        }
                    }
                    // glyph
                    else if (tippyNode.querySelector("div.m-yak0pv")) {
                        const glyphNameNode = tippyNode.querySelector("p.m-pv4zw0");
                        if (glyphNameNode) {
                            this.glyphNameProcess(glyphNameNode);
                        }
                    }
                    // leg node
                    else if (tippyNode.querySelector("div.m-1fwtoiz")) {
                        const legNameNode = tippyNode.querySelector("p.m-1vrrnd3");
                        if (legNameNode) {
                            this.legNodeNameProcess(legNameNode);
                        }
                    }
                    // rune
                    else if (tippyNode.querySelector("div.xb3r6kr img[src*='/runes/']")) {
                        const runeNameNode = tippyNode.querySelector("p.x2klb21");
                        if (runeNameNode) {
                            this.runeNameProcess(runeNameNode);
                        }
                    }
                    // elixir
                    else if (tippyNode.querySelector("div.xb3r6kr img[src*='/elixirs/']")) {
                        const elixirNameNode = tippyNode.querySelector("p.x2klb21");
                        if (elixirNameNode) {
                            this.elixirNameProcess(elixirNameNode);
                        }
                    }
                }
            }
        }
    }

    getCharClassName() {
        const classNameTitle =
            document.querySelector("div.x1xq1gxn:has(img)") ??  // build
            document.querySelector("button#Class span");        // planner

        return classNameTitle?.innerText
            ?.replace("Diablo 4 ", "")
            ?.replace(" Build", "");
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
        const sourceItem = this.affixBuilder.getSourceItem(sourceValue);
        const targetItem = this.affixBuilder.getTargetItem(sourceItem);
        const targetValue = this.affixBuilder.buildTargetValue(targetItem);

        return targetValue;
    }

    temperNameProcess(temperNameNode) {
        const temperName = temperNameNode.innerText;
        if (!temperName) {
            return false;
        }

        let sourceTemperValue;
        const temperNameMath = temperName.match(/(.+): (.+) \((.+)\)/);
        if (temperNameMath) {
            sourceTemperValue = temperNameMath[2];
        }

        if (!sourceTemperValue) {
            return false;
        }

        const temperTargetValue = this.getTemperTargetValue(sourceTemperValue);
        if (!temperTargetValue) {
            return false;
        }

        return this.addAffixNodeTargetValue(temperNameNode, "d4br_temper_name", temperTargetValue);
    }

    getTemperTargetValue(sourceValue) {
        const fixedTemperValue = sourceValue
            .replace("Movement Speed for X Seconds", "Movement Speed for 4 Seconds")
            .replace("Movement Speed for Seconds", "Movement Speed for 4 Seconds");

        const sourceItem = this.temperBuilder.getSourceItem(fixedTemperValue);
        const targetItem = this.temperBuilder.getTargetItem(sourceItem);
        const targetValue = this.temperBuilder.buildValue(targetItem);

        return targetValue;
    }

    unqItemNameProcess(node) {
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems);
    }

    skillNameProcess(node) {
        const sourceValue = node.innerText;
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

        return this.addTargetValue(node, "d4br_skill_name", targetValue);
    }

    glyphNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const glyphMatch = sourceValue.match(/([a-zA-Z ]+) \(Lvl \d+\)/);
        if (!glyphMatch) {
            return false;
        }

        const glyphName = glyphMatch[1];
        const sourceItem = this.sourceLanguage.glyphs.find(i => StringExtension.equelsIgnoreCase(i.name, glyphName));
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.glyphs.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        return this.addTargetValue(node, "d4br_glyph_name", targetItem.name);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes);
    }

    runeNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes);
    }

    runeNameInItemProcess(node) {
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

        return this.addAffixNodeTargetValue(node, "d4br_rune_name", targetValue);
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
        affixNode.style.marginLeft = "25px";
        affixNode.style.marginBottom = "-5px";
        affixNode.style.opacity = "0.6";
        affixNode.innerText = targetValue;

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
