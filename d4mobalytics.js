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
                    // aspect and temper
                    if (tippyNode.querySelector("div.m-1tii5t")) {
                        const aspectNameNode = tippyNode.querySelector("p.m-foqf9j");
                        if (aspectNameNode) {
                            this.aspectNameProcess(aspectNameNode);
                        }
                        const temperNameNodes = tippyNode.querySelectorAll("span.m-1yjh4k8");
                        for (const temperNameNode of temperNameNodes) {
                            this.temperNameProcess(temperNameNode);
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
            document.querySelector("span.m-a53mf3") ??                           // build
            document.querySelector("#downshift-0-toggle-button span.m-1sjbyfv"); // planner

        return classNameTitle?.innerText
            ?.replace("Diablo 4 ", "")
            ?.replace(" Build", "");
    }

    aspectNameProcess(node) {
        return this.nodeProcess(node, "d4br_aspect_name", Language.aspects, true);
    }

    temperNameProcess(node) {
        const sourceValue = node.innerText;
        if (!sourceValue) {
            return false;
        }

        const charClassName = this.getCharClassName();

        const sourceItems = this.sourceLanguage.tempers.filter(i => {
            return (i.class === charClassName || i.class === "All") &&
                StringExtension.equelsIgnoreCase(i.name, sourceValue)
        });

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
