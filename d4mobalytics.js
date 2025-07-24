class D4MobalyticsProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
        this.resourceBuilder = new ResourceBuilder(this);
        this.affixBuilder = new AffixBuilder(this, /Ranks (?:to )?(?<skillName>.+)/);
        this.temperBuilder = new TemperBulder(this, / ?(?:(?:(?:B|b)onus)|(?<value>\+))? ?/);
    }

    mutationObserverCallback(mutations) {
        for (const mutation of mutations) {
            if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
                if (mutation.target.id.startsWith("tippy-")) {
                    const tippyNode = mutation.target;
                    // aspect, affix, temper
                    if (tippyNode.querySelector("div.m-1tii5t")) {
                        const aspectNameNode = tippyNode.querySelector("p.m-foqf9j");
                        if (aspectNameNode) {
                            this.aspectNameProcess(aspectNameNode);
                        }

                        const affisNameNodes = tippyNode.querySelectorAll("span.m-3zcy6z, span.m-y0za0q, span.m-vhsx5y, span.m-14rp55x");
                        for (const affisNameNode of affisNameNodes) {
                            this.affixNameProcess(affisNameNode);
                        }

                        const temperNodes = tippyNode.querySelectorAll("li.m-16l5u8x:has(span.m-1yjh4k8)");
                        for (const temperNode of temperNodes) {
                            const temperNameNode = temperNode.querySelector("span.m-1yjh4k8");
                            const temperValueNode = temperNode.querySelector("span.m-3zcy6z, span.m-14rp55x, span.m-vhsx5y, span.m-y0za0q");
                            this.temperNameProcess(temperNameNode, temperValueNode);
                        }
                    }
                    // unq item
                    else if (tippyNode.querySelector("div.m-mqkczm")) {
                        const unqItemNameNode = tippyNode.querySelector("h4.m-yb0jxq");
                        if (unqItemNameNode) {
                            this.unqItemNameProcess(unqItemNameNode);
                        }
                    }
                    // skill
                    else if (tippyNode.querySelector("div.m-1saunj6")) {
                        const skillNameNode = tippyNode.querySelector("p.m-foqf9j");
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
                    else if (tippyNode.querySelector("div.m-1m5senx")) {
                        const runeNameNode = tippyNode.querySelector("p.m-54521m");
                        if (runeNameNode) {
                            this.runeNameProcess(runeNameNode);
                        }
                    }
                }
            }
        }
    }

    getCharClassName() {
        const classNameTitle =
            document.querySelector("span.m-a53mf3") ??              // build
            document.querySelector("div.m-183mevi span.m-1sjbyfv"); // planner

        return classNameTitle?.innerText
            ?.replace("Diablo 4 ", "")
            ?.replace(" Build", "");
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", Language.aspects, true);
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

        return this.setAffixNodeTargetValue(node, "d4br_affix_name", affixTargetValue);
    }

    getAffixTargetValue(sourceValue) {
        const sourceItem = this.affixBuilder.getSourceItem(sourceValue);
        const targetItem = this.affixBuilder.getTargetItem(sourceItem);
        const targetValue = this.affixBuilder.buildTargetValue(targetItem);

        return targetValue;
    }

    temperNameProcess(temperNameNode, temperValueNode) {
        const temperName = temperNameNode.innerText;
        if (!temperName) {
            return false;
        }

        let sourceTemperValue;
        const temperValueNodeText = temperValueNode?.innerText;
        if (temperValueNodeText) {
            const temperValueEnd = temperValueNodeText.length - temperName.length - 1;
            const temperValueSource = temperValueNodeText.substring(0, temperValueEnd);

            const temperValueMath = temperValueSource.match(/([^:]+): (.+)/);
            if (temperValueMath) {
                sourceTemperValue = temperValueMath[2];
            }
        }

        if (!sourceTemperValue) {
            return false;
        }

        const temperTargetValue = this.getTemperTargetValue(sourceTemperValue);
        if (!temperTargetValue) {
            return false;
        }

        return this.setTemperNodeTargetValue(temperNameNode, "d4br_temper_name", temperTargetValue);
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
        return this.nodeProcess(node, "d4br_unq_item_name", Language.unqItems, true);
    }

    skillNameProcess(node) {
        return this.nodeProcess(node, "d4br_skill_name", Language.skills, true);
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

        return this.setTargetValue(node, "d4br_glyph_name", targetItem.name, true);
    }

    legNodeNameProcess(node) {
        return this.nodeProcess(node, "d4br_leg_node_name", Language.legNodes, true);
    }

    runeNameProcess(node) {
        return this.nodeProcess(node, "d4br_rune_name", Language.runes, true);
    }

    nodeProcess(node, className, resourceName, addSourceValue) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        var sourceItem = this.resourceBuilder.getSourceItem(resourceName, sourceValue);
        const targetItem = this.resourceBuilder.getTargetItem(sourceItem);

        if (!targetItem) {
            return false;
        }

        return this.setTargetValue(node, className, targetItem.name, addSourceValue);
    }

    setAffixNodeTargetValue(node, className, targetValue) {
        const newNode = document.createElement("div");
        newNode.style.opacity = "0.6";
        node.prepend(newNode);

        return this.setTargetValue(newNode, className, targetValue, false);
    }

    setTemperNodeTargetValue(node, className, targetValue) {
        const newNode = document.createElement("div");
        newNode.style.opacity = "0.6";
        node.parentNode.prepend(newNode);

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
        return `<div class="d4br_show ${className}" style="color:darkgray; font-size:15px;">${value}</div>`;
    }
}
