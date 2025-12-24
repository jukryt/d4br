class ElementBuilder {
    static containerClassName = "d4br_element";

    constructor(textColor) {
        this.textColor = textColor;
    }

    getContainerSelector() {
        return `.${ElementBuilder.containerClassName}`;
    }

    addContainerBefore(sourceNode, className) {
        const nodeStyle = window.getComputedStyle(sourceNode);

        const targetNode = this.createContainerBySource(sourceNode, className);
        targetNode.style.marginTop = nodeStyle.getPropertyValue("margin-top");
        sourceNode.style.marginTop = "0";

        sourceNode.before(targetNode);
        return targetNode;
    }

    createContainerByTag(tagName, className) {
        const targetNode = document.createElement(tagName);

        this.addClasses(targetNode, className);
        targetNode.style.color = this.textColor;

        return targetNode;
    }

    createContainerBySource(sourceNode, className) {
        const targetNode = this.cloneElement(sourceNode);

        this.addClasses(targetNode, className)
        targetNode.style.color = this.textColor;

        return targetNode;
    }

    cloneElement(sourceNode) {
        const nodeStyle = window.getComputedStyle(sourceNode);

        const targetNode = document.createElement(sourceNode.localName);
        targetNode.style.fontFamily = nodeStyle.getPropertyValue("font-family");
        targetNode.style.fontSize = nodeStyle.getPropertyValue("font-size");
        targetNode.style.textAlign = nodeStyle.getPropertyValue("text-align");
        targetNode.style.color = nodeStyle.getPropertyValue("color");

        return targetNode;
    }

    addClasses(node, className) {
        const classList = node.classList;

        if (!classList.contains("d4br_element")) {
            classList.add("d4br_element");
        }

        if (!classList.contains(className)) {
            classList.add(className);
        }
    }
}

class ResourceBuilder {
    constructor(processor) {
        this.processor = processor;
    }

    getSourceItem(resourceName, sourceValue) {
        if (!resourceName || !sourceValue) {
            return null;
        }

        const charClassName = this.processor.getCharClassName();

        const availableItems = this.processor.sourceLanguage.getResource(resourceName).filter(i => {
            return !i.classes || i.classes.length === 0 ||
                (charClassName && i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
        });

        let sourceItems = availableItems.filter(i => StringExtension.equelsIgnoreCase(i.name, sourceValue));

        if (sourceItems.length > 1) {
            const classSourceItems = sourceItems.filter(i => i.classes && charClassName && i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
            if (classSourceItems.length == 1) {
                sourceItems = classSourceItems;
            }
            else {
                const anySourceItems = sourceItems.filter(i => !i.classes || i.classes.length === 0);
                if (anySourceItems.length == 1) {
                    sourceItems = anySourceItems;
                }
            }
        }

        if (sourceItems.length != 1) {
            return null;
        }

        const sourceItem = sourceItems[0];
        if (!sourceItem) {
            return null;
        }

        sourceItem.resourceName = resourceName;
        return sourceItem;
    }

    getTargetItem(sourceItem) {
        if (!sourceItem) {
            return null;
        }

        const targetItem = this.processor.targetLanguage.getResource(sourceItem.resourceName).find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return null;
        }

        targetItem.resourceName = sourceItem.resourceName;
        return targetItem;
    }
}

class SkillBuilder {
    constructor(processor) {
        this.processor = processor;
    }

    getSourceItem(sourceValue) {
        if (!sourceValue) {
            return null;
        }

        const charClassName = this.processor.getCharClassName();
        if (!charClassName) {
            return null;
        }

        const skills = this.processor.sourceLanguage.skills.filter(i => i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
        const sourceItems = skills.filter(s => {
            if (StringExtension.equelsIgnoreCase(s.name, sourceValue)) {
                s.mod = null;
                return true;
            }

            if (!s.isactive || !s.mods || s.mods.length === 0) {
                return false;
            }

            const mods = s.mods.filter(m => StringExtension.equelsIgnoreCase(m.name, sourceValue));
            if (mods.length === 1) {
                s.mod = mods[0];
                return true;
            }
        });

        if (sourceItems.length !== 1) {
            return null;
        }

        return sourceItems[0];
    }

    getTargetItem(sourceItem) {
        if (!sourceItem) {
            return null;
        }

        const targetItem = this.processor.targetLanguage.skills.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return null;
        }

        if (!sourceItem.mod) {
            targetItem.mod = null;
            return targetItem;
        }

        if (targetItem.isactive && targetItem.mods && targetItem.mods.length !== 0) {
            const mods = targetItem.mods.filter(m => m.id === sourceItem.mod.id);
            if (mods.length === 1) {
                targetItem.mod = mods[0];
                return targetItem
            }
        }

        return null;
    }

    buildTargetValue(targetItem) {
        if (!targetItem) {
            return null;
        }

        if (!targetItem.mod) {
            return targetItem.name;
        }

        return targetItem.mod.name;
    }
}

class AffixBuilder {
    constructor(processor, skillRankRegex) {
        this.processor = processor;
        this.skillRankRegex = skillRankRegex;
    }

    getSourceItem(sourceValue) {
        if (!sourceValue) {
            return null;
        }

        const charClassName = this.processor.getCharClassName();
        if (!charClassName) {
            return null;
        }

        const sourceValueMatch = sourceValue.match(this.skillRankRegex);
        if (!sourceValueMatch) {
            return null;
        }

        const skillName = sourceValueMatch.groups?.skillName;
        const value = sourceValueMatch.groups?.value;

        if (!skillName) {
            return null;
        }

        const fixSkillName = skillName.trim();

        const skills = this.processor.sourceLanguage.skills.filter(i => i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
        const sourceItems = skills.filter(i => StringExtension.equelsIgnoreCase(i.name, fixSkillName));
        if (sourceItems.length != 1) {
            return null;
        }

        const sourceItem = sourceItems[0];

        sourceItem.value = value?.trim();
        return sourceItem;
    }

    getTargetItem(sourceItem) {
        if (!sourceItem) {
            return null;
        }

        const targetItem = this.processor.targetLanguage.skills.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return null;
        }

        targetItem.value = sourceItem.value;
        return targetItem;
    }

    buildTargetValue(targetItem) {
        if (!targetItem) {
            return null;
        }

        return this.processor.targetLanguage.getSkillAffixValue(targetItem)
    }
}

class TemperBulder {
    static temperValueMacros = " X ";

    constructor(processor, valueRegex) {
        this.processor = processor;
        this.valueRegex = valueRegex;
    }

    getSourceItem(sourceValue) {
        if (!sourceValue) {
            return null;
        }

        const charClassName = this.processor.getCharClassName();
        if (!charClassName) {
            return null;
        }

        const tempers = this.processor.sourceLanguage.tempers
            .filter(i => {
                return !i.classes || i.classes.length === 0 ||
                    (charClassName && i.classes.find(c => StringExtension.equelsIgnoreCase(c, charClassName)));
            })
            .filter(i => i.details);

        let sourceItems = tempers.filter(t => {
            const details = t.details.filter(d => {
                const names = d.names.filter(n => {
                    const valueRegex = this._buildValueRegex(n);
                    const valueMatch = sourceValue.match(valueRegex);

                    if (valueMatch &&
                        valueMatch.index === 0 &&
                        valueMatch[0] === sourceValue) {
                        const value = valueMatch.groups?.value;
                        d.value = value?.trim();
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

    getTargetItem(sourceItem) {
        if (!sourceItem) {
            return null;
        }

        const targetItem = this.processor.targetLanguage.tempers.find(i => i.id === sourceItem.id);
        if (!targetItem) {
            return null;
        }

        const detail = targetItem.details.find(v => v.id === sourceItem.detail.id);
        if (!detail) {
            return null;
        }

        detail.value = sourceItem.detail.value;

        targetItem.detail = detail;
        return targetItem;
    }

    buildValue(temperItem) {
        if (!temperItem) {
            return null;
        }

        const names = [temperItem.type];

        if (temperItem.detail && temperItem.detail.names.length > 0) {
            let detailName = temperItem.detail.names[0];

            if (temperItem.detail.value) {
                detailName = detailName.replace(TemperBulder.temperValueMacros, ` ${temperItem.detail.value} `);
            }

            names.push(detailName.trim());
        }

        return names.join(" ● ");
    }

    _buildValueRegex(value) {
        const valueRegex = this.valueRegex?.source ?? this.valueRegex;
        return StringExtension.escapeRegexChars(value)
            .replace(TemperBulder.temperValueMacros, valueRegex);
    }
}
