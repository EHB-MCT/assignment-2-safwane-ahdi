let racesData, classesData, backgroundsData, selectedSkills = [];

document.addEventListener("DOMContentLoaded", () => {
    const abilityScoreMethodSelect = document.getElementById("abilityScoreMethod");
    const pointBuySystem = document.getElementById("point-buy-system");
    const diceRollSystem = document.getElementById("dice-roll-system");
    const standardArraySystem = document.getElementById("standard-array-system");

    abilityScoreMethodSelect.addEventListener("change", (event) => {
        const selectedMethod = event.target.value;

        pointBuySystem.hidden = true;
        diceRollSystem.hidden = true;
        standardArraySystem.hidden = true;

        switch (selectedMethod) {
            case "pointBuy":
                pointBuySystem.hidden = false;
                break;
            case "diceRoll":
                diceRollSystem.hidden = false;
                break;
            case "standardArray":
                standardArraySystem.hidden = false;
                break;
        }
    });

    fetch("races.json")
        .then(response => response.json())
        .then(races => {
            console.log("Races loaded:", races);
            populateDropdown("race-select", races, "Race");
            document.getElementById("race-select").addEventListener("change", () => {
                updateSubraces(races);
            });
        })
        .catch(error => console.error("Error fetching races:", error));

        fetch("classes.json")
        .then(response => response.json())
        .then(classes => {
            console.log("Classes loaded:", classes);
            classesData = classes;
            populateDropdown("class-select", classes, "Class");
            document.getElementById("class-select").addEventListener("change", () => {
                updateSubclassOptions(classes);
            });
        })
        .catch(error => console.error("Error fetching classes:", error));
    

        fetch("backgrounds.json")
        .then(response => response.json())
        .then(data => {
            console.log("Backgrounds loaded:", data);
            backgroundsData = data.backgrounds; // Use global variable
            populateDropdown("background-select", backgroundsData, "Background");
        })
        .catch(error => console.error("Error loading backgrounds:", error));
    document.getElementById("generate-character-button").addEventListener("click", generateCharacter);
});

document.getElementById("class-select").addEventListener("change", () => {
    const selectedClass = document.getElementById("class-select").value;
    if (selectedClass) {
        populateSkills(selectedClass);
    } else {
        document.getElementById("skills-container").innerHTML = ""; // Clear skills section
    }
});

function populateSkills(className) {
    const classData = classesData[className];
    const skillContainer = document.getElementById("skills-container");

    if (classData && classData.skills) {
        skillContainer.innerHTML = `<p>Select ${classData.skillCount} skills:</p>`;
        const availableSkills = classData.skills;

        availableSkills.forEach(skill => {
            const skillElement = document.createElement("label");
            skillElement.innerHTML = `
                <input type="checkbox" value="${skill}" onchange="updateSelectedSkills('${className}')">
                ${skill}
            `;
            skillContainer.appendChild(skillElement);
        });
    }
}

function updateSelectedSkills(className) {
    const classData = classesData[className];
    const checkboxes = document.querySelectorAll("#skills-container input[type='checkbox']");
    selectedSkills = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (selectedSkills.length > classData.skillCount) {
        alert(`You can only choose ${classData.skillCount} skills.`);
        checkboxes.forEach(checkbox => {
            if (!selectedSkills.includes(checkbox.value)) {
                checkbox.checked = false;
            }
        });
        selectedSkills = selectedSkills.slice(0, classData.skillCount);
    }
}

window.updateSelectedSkills = function (className) {
    const classData = classesData[className];
    const checkboxes = document.querySelectorAll("#skills-container input[type='checkbox']");
    selectedSkills = Array.from(checkboxes)
        .filter(checkbox => checkbox.checked)
        .map(checkbox => checkbox.value);

    if (selectedSkills.length > classData.skillCount) {
        alert(`You can only choose ${classData.skillCount} skills.`);
        checkboxes.forEach(checkbox => {
            if (!selectedSkills.includes(checkbox.value)) {
                checkbox.checked = false;
            }
        });
        selectedSkills = selectedSkills.slice(0, classData.skillCount);
    }
};

function populateDropdown(selectId, data, type) {
    const selectElement = document.getElementById(selectId);
    for (const key in data) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        selectElement.appendChild(option);
    }
}

function updateSubraces(races) {
    const race = document.getElementById("race-select").value;
    const subraceSelect = document.getElementById("subrace-select");
    subraceSelect.innerHTML = '<option value="">Select a Subrace</option>'; // Reset subraces

    if (races[race]?.subraces) {
        const subraces = races[race].subraces;
        for (const subrace in subraces) {
            const option = document.createElement("option");
            option.value = subrace;
            option.textContent = subrace.charAt(0).toUpperCase() + subrace.slice(1);
            subraceSelect.appendChild(option);
        }
        subraceSelect.disabled = false;
    } else {
        subraceSelect.disabled = true;
    }
}

document.getElementById("background-select").addEventListener("change", () => {
    const selectedBackground = document.getElementById("background-select").value;
    const descriptionContainer = document.getElementById("background-description");
    const detailsContainer = document.getElementById("background-details");

    if (selectedBackground && backgroundsData[selectedBackground]) {
        descriptionContainer.style.display = "block";
        detailsContainer.textContent = JSON.stringify(backgroundsData[selectedBackground], null, 2);
    } else {
        descriptionContainer.style.display = "none";
        detailsContainer.textContent = "";
    }
});

function updateSubclassOptions(classes) {
    const selectedClass = document.getElementById("class-select").value;
    const subclassSelect = document.getElementById("subclass-select");
    subclassSelect.innerHTML = '<option value="">Select a Subclass</option>'; // Reset options

    if (["cleric", "sorcerer", "warlock"].includes(selectedClass)) {
        const subclasses = classes[selectedClass].subclasses;
        for (const subclass in subclasses) {
            const option = document.createElement("option");
            option.value = subclass;
            option.textContent = subclasses[subclass];
            subclassSelect.appendChild(option);
        }
        subclassSelect.disabled = false; // Enable subclass dropdown
    } else {
        subclassSelect.disabled = true; // Disable subclass dropdown for other classes
    }
}

function generateCharacter() {
    const raceElement = document.getElementById("race-select");
    const classElement = document.getElementById("class-select");
    const subclassElement = document.getElementById("subclass-select");
    const subraceElement = document.getElementById("subrace-select");
    const background = document.getElementById("background-select").value || "No Background";
    const abilityScoreMethod = document.getElementById("abilityScoreMethod").value;

    if (!raceElement || !classElement || !subclassElement || !subraceElement) {
        console.error("Required elements are missing in the DOM.");
        return;
    }

    const selectedRace = raceElement.value || "Unknown Race";
    const selectedSubrace = subraceElement.value || "Unknown Subrace";
    const selectedClass = classElement.value || "Unknown Class";
    const selectedSubclass = subclassElement.value || "Unknown Subclass";

    let abilityScores = {};
    switch (abilityScoreMethod) {
        case "pointBuy":
            abilityScores = getPointBuyScores();
            break;
        case "diceRoll":
            abilityScores = getDiceRollScores();
            break;
        case "standardArray":
            abilityScores = getStandardArrayScores();
            break;
        default:
            console.error("Invalid ability score method selected.");
            return;
    }

    const character = {
        race: selectedRace,
        subrace: selectedSubrace,
        class: selectedClass,
        subclass: selectedSubclass,
        background: background,
        abilities: abilityScores,
        skills: selectedSkills,
    };

    document.getElementById("template-race").textContent = character.race;
    document.getElementById("template-subrace").textContent = character.subrace;
    document.getElementById("template-class").textContent = character.class;
    document.getElementById("template-subclass").textContent = character.subclass;
    document.getElementById("template-background").textContent = character.background;
    document.getElementById("template-strength").textContent = character.abilities.strength || "--";
    document.getElementById("template-dexterity").textContent = character.abilities.dexterity || "--";
    document.getElementById("template-constitution").textContent = character.abilities.constitution || "--";
    document.getElementById("template-intelligence").textContent = character.abilities.intelligence || "--";
    document.getElementById("template-wisdom").textContent = character.abilities.wisdom || "--";
    document.getElementById("template-charisma").textContent = character.abilities.charisma || "--";
    document.getElementById("template-skills").textContent =
        character.skills.length > 0 ? character.skills.join(", ") : "None Selected";

    // Display the summary
    document.getElementById("character-template").style.display = "block";

    document.getElementById("character-details").textContent = JSON.stringify(character, null, 2);
    document.getElementById("character-summary").style.display = "block";
}

function getPointBuyScores() {
    return {
        strength: parseInt(document.getElementById("strength").value, 10),
        dexterity: parseInt(document.getElementById("dexterity").value, 10),
        constitution: parseInt(document.getElementById("constitution").value, 10),
        intelligence: parseInt(document.getElementById("intelligence").value, 10),
        wisdom: parseInt(document.getElementById("wisdom").value, 10),
        charisma: parseInt(document.getElementById("charisma").value, 10),
    };
}

function getDiceRollScores() {
    return {
        strength: roll4d6DropLowest(),
        dexterity: roll4d6DropLowest(),
        constitution: roll4d6DropLowest(),
        intelligence: roll4d6DropLowest(),
        wisdom: roll4d6DropLowest(),
        charisma: roll4d6DropLowest(),
    };
}

function getStandardArrayScores() {
    const standardArray = [15, 14, 13, 12, 10, 8];
    const scores = {};
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];

    abilities.forEach((ability, index) => {
        scores[ability] = standardArray[index];
    });

    return scores;
}

function roll4d6DropLowest() {
    const rolls = Array.from({ length: 4 }, () => Math.floor(Math.random() * 6) + 1);
    rolls.sort((a, b) => a - b); 
    rolls.shift();
    return rolls.reduce((sum, roll) => sum + roll, 0); 
}

document.getElementById("generate-character-button").addEventListener("click", generateCharacter);
