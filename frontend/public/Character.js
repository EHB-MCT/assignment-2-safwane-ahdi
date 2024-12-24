export default class Character {
    constructor(name, sex, race, charClass) {
        this.name = name;
        this.sex = sex;
        this.race = race;
        this.hp = 0;
        this.class = charClass;
        this.choices = [];
        this.stats = {
            STR: 0,
            DEX: 0,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0,
        };
        this.armorClass = 10;
        this.savingThrows = {
            STR: 0,
            DEX: 0,
            CON: 0,
            INT: 0,
            WIS: 0,
            CHA: 0,
        };
        this.initiative = 0;
        this.senses = {
            PERCEPTION: 0,
            INVESTIGATION: 0,
            INSIGHT: 0,
        };
        this.skills = {
            STR: { Athletics: 0 },
            DEX: { Acrobatics: 0, Sleight_of_Hand: 0, Stealth: 0 },
            INT: { Arcana: 0, History: 0, Investigation: 0, Nature: 0, Religion: 0 },
            WIS: { Animal_Handling: 0, Insight: 0, Medicine: 0, Perception: 0, Survival: 0 },
            CHA: { Deception: 0, Intimidation: 0, Performance: 0, Persuasion: 0 },
        };
    }

    // Populate stats using either dice rolls or another input method
    populateStats(diceResults) {
        Object.keys(this.stats).forEach((key, index) => {
            this.stats[key] = diceResults[index];
        });
    }

    // Choose the stat generation method
    chooseStatGenerationMethod(method) {
        if (method === 'point-buy') {
            this.stats = this.initializePointBuy();
        } else if (method === 'dice-roll') {
            this.stats = this.rollStats();
        } else {
            throw new Error('Invalid stat generation method.');
        }
    }

    // Initialize point buy stats
    initializePointBuy() {
        return { STR: 8, DEX: 8, CON: 8, INT: 8, WIS: 8, CHA: 8 };
    }

    // Roll stats using the 4d6, drop the lowest method
    rollStats() {
        const roll4d6DropLowest = () => {
            const rolls = Array(4)
                .fill(0)
                .map(() => Math.floor(Math.random() * 6) + 1)
                .sort((a, b) => a - b);
            rolls.shift();
            return rolls.reduce((a, b) => a + b, 0);
        };

        return {
            STR: roll4d6DropLowest(),
            DEX: roll4d6DropLowest(),
            CON: roll4d6DropLowest(),
            INT: roll4d6DropLowest(),
            WIS: roll4d6DropLowest(),
            CHA: roll4d6DropLowest(),
        };
    }

    // Apply race modifiers to stats
    applyRaceModifiers() {
        const raceModifiers = {
            dwarf: { CON: 2, WIS: 1 },
            elf: { DEX: 2, INT: 1 },
            halfling: { DEX: 2, CHA: 1 },
            human: { STR: 1, DEX: 1, CON: 1, INT: 1, WIS: 1, CHA: 1 },
            dragonborn: { STR: 2, CHA: 1 },
            gnome: { INT: 2, DEX: 1 },
            halfelf: { CHA: 2 },
            halforc: { STR: 2, CON: 1 },
            tiefling: { CHA: 2, INT: 1 },
        };

        const raceModifier = raceModifiers[this.race];
        if (raceModifier) {
            Object.keys(raceModifier).forEach((key) => {
                this.stats[key] += raceModifier[key];
            });
        }
    }

    // Apply class modifiers to stats
    applyClassModifiers() {
        const classModifiers = {
            barbarian: { STR: 2, CON: 1 },
            bard: { CHA: 2, DEX: 1 },
            cleric: { WIS: 2, STR: 1 },
            druid: { WIS: 2, CON: 1 },
            fighter: { STR: 2, CON: 1 },
            monk: { DEX: 2, WIS: 1 },
            paladin: { STR: 2, CHA: 1 },
            ranger: { DEX: 2, WIS: 1 },
            rogue: { DEX: 2, INT: 1 },
            sorcerer: { CHA: 2 },
            warlock: { CHA: 2, CON: 1 },
            wizard: { INT: 2, DEX: 1 },
        };

        const classModifier = classModifiers[this.class];
        if (classModifier) {
            Object.keys(classModifier).forEach((key) => {
                this.stats[key] += classModifier[key];
            });
        }
    }

    // Update derived stats
    updateDerivedStats() {
        this.calculateSavingThrows();
        this.calculateArmorClass();
        this.calculateInitiative();
        this.calculateSenses();
        this.calculateSkills();
    }

    // Calculate saving throws
    calculateSavingThrows() {
        Object.keys(this.stats).forEach((key) => {
            this.savingThrows[key] = Math.floor((this.stats[key] - 10) / 2);
        });
    }

    // Calculate armor class
    calculateArmorClass() {
        this.armorClass = 10 + this.savingThrows.DEX;
    }

    // Calculate initiative
    calculateInitiative() {
        this.initiative = this.savingThrows.DEX;
    }

    // Calculate senses
    calculateSenses() {
        this.senses.PERCEPTION = this.stats.WIS;
        this.senses.INVESTIGATION = this.stats.INT;
        this.senses.INSIGHT = this.stats.WIS;
    }

    // Calculate skills
    calculateSkills() {
        this.skills.STR.Athletics += this.savingThrows.STR;
        this.skills.DEX.Acrobatics += this.savingThrows.DEX;
        this.skills.DEX.Sleight_of_Hand += this.savingThrows.DEX;
        this.skills.DEX.Stealth += this.savingThrows.DEX;
        this.skills.INT.Arcana += this.savingThrows.INT;
        this.skills.INT.History += this.savingThrows.INT;
        this.skills.INT.Investigation += this.savingThrows.INT;
        this.skills.INT.Nature += this.savingThrows.INT;
        this.skills.INT.Religion += this.savingThrows.INT;
        this.skills.WIS.Animal_Handling += this.savingThrows.WIS;
        this.skills.WIS.Insight += this.savingThrows.WIS;
        this.skills.WIS.Medicine += this.savingThrows.WIS;
        this.skills.WIS.Perception += this.savingThrows.WIS;
        this.skills.WIS.Survival += this.savingThrows.WIS;
        this.skills.CHA.Deception += this.savingThrows.CHA;
        this.skills.CHA.Intimidation += this.savingThrows.CHA;
        this.skills.CHA.Performance += this.savingThrows.CHA;
        this.skills.CHA.Persuasion += this.savingThrows.CHA;
    }

    // Add feat and apply modifiers
    addFeat(feat) {
        this.choices.push(feat);
        if (feat.modifiers) {
            Object.keys(feat.modifiers).forEach((key) => {
                this.stats[key] += feat.modifiers[key];
            });
        }
    }

    // Describe the character
    describe() {
        return `The character ${this.name} is a ${this.sex} ${this.race} ${this.class} and has ${this.hp} HP.`;
    }
}
