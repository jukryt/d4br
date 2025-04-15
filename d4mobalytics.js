class D4MobalyticsProcessor {
    constructor() {
        this.sourceLanguage = new EnglishLanguage();
        this.targetLanguage = new RussianLanguage();
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

    buildTemperValueRegex(value) {
        return value.replace(Language.temperValueMacros, " ?(Bonus)? ?");
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", Language.aspects, true);
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

        const skillNameMatch = sourceValue.match(/Ranks (to )?(.+)/);
        if (!skillNameMatch) {
            return false;
        }

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

        const targetAffixValue = this.targetLanguage.getSkillAffixValue(targetItem);
        return this.setAffixNodeTargetValue(node, "d4br_affix_name", targetAffixValue);
    }

    temperNameProcess(temperNameNode, temperValueNode) {
        const temperName = temperNameNode.innerText;
        if (!temperName) {
            return false;
        }

        const charClassName = this.getCharClassName();
        if (!charClassName) {
            return false;
        }

        let temperValueSource = "";
        if (temperValueNode) {
            const nodeText = temperValueNode?.innerText;
            const end = nodeText.length - temperName.length - 1;
            temperValueSource = nodeText.substring(0, end);
        }

        const sourceItem = this.getTemperSourceItem(charClassName, temperName, temperValueSource);
        if (!sourceItem) {
            return false;
        }

        const targetItem = this.targetLanguage.tempers.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return false;
        }

        if (sourceItem.detail) {
            targetItem.detail = targetItem.details.find(v => v.id === sourceItem.detail.id);
        }

        const targetTemperValue = this.targetLanguage.getTemperValue(targetItem);
        return this.setTemperNodeTargetValue(temperNameNode, "d4br_temper_name", targetTemperValue);
    }

    getTemperSourceItem(charClassName, temperName, temperValueSource) {
        const fixedTemperName = temperName
            .replace("Wordly", "Worldly")
            .replace(/^Ultimate Efficiency$/, "Ultimate Efficiency - Rogue")
            .replace("Summoning Finesse", "Minion Finesse")
            .replace("Berserking Augments", "Berserking Innovation")
            .replace("Summoning Augments", "Minion Augments");

        let sourceTemperType = "";
        let sourceTemperValue = "";
        if (temperValueSource) {
            const fixedTemperValueSource = temperValueSource
                .replace("Weapon:", "Weapons:")
                .replace("Movement Speed for X Seconds", "Movement Speed for 4 Seconds")
                .replace("Movement Speed for Seconds", "Movement Speed for 4 Seconds");

            const temperValueMath = fixedTemperValueSource.match(/([^:]+): (.+)/);
            if (temperValueMath) {
                sourceTemperType = temperValueMath[1];
                sourceTemperValue = temperValueMath[2];
            }
        }

        const tempers = this.sourceLanguage.tempers
            .filter(i => {
                return !i.classes || i.classes.length === 0 ||
                    (charClassName && i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
            })
            .filter(i => !sourceTemperType || StringExtension.equelsIgnoreCase(i.type, sourceTemperType))
            .filter(i => i.details);

        const sourceItems = tempers.filter(i => StringExtension.equelsIgnoreCase(i.name, fixedTemperName));

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

        const sourceItem = sourceItems[0];

        const sourceDetails = sourceItem.details.filter(d => {
            var names = d.names.filter(n => {
                const valueRegex = this.buildTemperValueRegex(n);
                const valueMatch = sourceTemperValue.match(valueRegex);

                if (valueMatch &&
                    valueMatch.index === 0 &&
                    valueMatch[0] === sourceTemperValue) {
                    return true;
                }
            });
            return names.length === 1;
        });

        if (sourceDetails.length === 1) {
            sourceItem.detail = sourceDetails[0];
        }

        return sourceItem;
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
