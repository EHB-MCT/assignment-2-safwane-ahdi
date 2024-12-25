let racesData, classesData, backgroundsData, selectedSkills = [];

// Load Races
fetch('races.json')
    .then(response => response.json())
    .then(data => {
        racesData = data;
        console.log('Races loaded:', racesData);
    });

// Load Classes
fetch('classes.json')
    .then(response => response.json())
    .then(data => {
        classesData = data;
        console.log('Classes loaded:', classesData);
    });

// Load Backgrounds
fetch('backgrounds.json')
    .then(response => response.json())
    .then(data => {
        backgroundsData = data;
        console.log('Backgrounds loaded:', backgroundsData);
    })
    .catch(error => console.error("Error loading backgrounds:", error));


//##########################################
//##########################################
//##########################################
//##########################################

// Update Skills Dropdown Based on Selected Class
document.getElementById("class-select").addEventListener("change", () => {
    const selectedClass = document.getElementById("class-select").value;
    if (selectedClass) {
        populateSkills(selectedClass);
    } else {
        document.getElementById("skills-container").innerHTML = ""; // Clear skills section
    }
});

// Populate Skills Based on Selected Class
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

// Update Selected Skills
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

// Attach updateSelectedSkills to the global window object
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




document.getElementById("generate-character-button").addEventListener("click", generateCharacter);


document.addEventListener("DOMContentLoaded", () => {
    // Fetch Races and Populate Race Dropdown
    fetch("races.json")
        .then(response => response.json())
        .then(races => {
            populateDropdown("race-select", races, "Race");
            document.getElementById("race-select").addEventListener("change", () => {
                updateSubraces(races);
            });
        })
        .catch(error => console.error("Error fetching races:", error));

    // Fetch Classes and Populate Class Dropdown
    fetch("classes.json")
        .then(response => response.json())
        .then(classes => {
            populateDropdown("class-select", classes, "Class");
        })
        .catch(error => console.error("Error fetching classes:", error));

        // Fetch Backgrounds and Populate Backgrounds Dropdown
        fetch('backgrounds.json')
    .then(response => response.json())
    .then(data => {
        backgroundsData = data.backgrounds;
        populateDropdown("background-select", backgroundsData, "Background");
    })
    .catch(error => console.error("Error loading backgrounds:", error));
});

// Populate Dropdown Utility
function populateDropdown(selectId, data, type) {
    const selectElement = document.getElementById(selectId);
    for (const key in data) {
        const option = document.createElement("option");
        option.value = key;
        option.textContent = key.charAt(0).toUpperCase() + key.slice(1);
        selectElement.appendChild(option);
    }
}

// Update Subraces Dropdown Based on Selected Race
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

document.addEventListener("DOMContentLoaded", () => {
    // Fetch Classes and Populate Class Dropdown
    fetch("classes.json")
        .then(response => response.json())
        .then(classes => {
            populateDropdown("class-select", classes, "Class");
            document.getElementById("class-select").addEventListener("change", () => {
                updateSubclassOptions(classes);
            });
        })
        .catch(error => console.error("Error fetching classes:", error));
});

// Update Subclass Options for Level 1 Classes
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

// Generate Character
function generateCharacter() {
    const raceElement = document.getElementById("race-select");
    const classElement = document.getElementById("class-select");
    const subclassElement = document.getElementById("subclass-select");
    const subraceElement = document.getElementById("subrace-select");
    const background = document.getElementById("background-select").value || "No Background";

    if (!raceElement || !classElement || !subclassElement || !subraceElement) {
        console.error("Required elements are missing in the DOM.");
        return;
    }

    const selectedRace = raceElement.value || "Unknown Race";
    const selectedSubrace = subraceElement.value || "Unknown Subrace";
    const selectedClass = classElement.value || "Unknown Class";
    const selectedSubclass = subclassElement.value || "Unknown Subclass";

    // Check for ability scores
    const abilityScores = {
        strength: document.getElementById("strength")?.value || "8",
        dexterity: document.getElementById("dexterity")?.value || "8",
        constitution: document.getElementById("constitution")?.value || "8",
        intelligence: document.getElementById("intelligence")?.value || "8",
        wisdom: document.getElementById("wisdom")?.value || "8",
        charisma: document.getElementById("charisma")?.value || "8",
    };

    // Build character object
    const character = {
        race: selectedRace,
        subrace: selectedSubrace,
        class: selectedClass,
        subclass: selectedSubclass,
        background: background,
        abilities: abilityScores,
        skills: selectedSkills,
    };

    // Display character
    document.getElementById("character-details").textContent = JSON.stringify(character, null, 2);
    document.getElementById("character-summary").style.display = "block";
}

// Attach event listener
document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("generate-character-button").addEventListener("click", generateCharacter);
});


document.getElementById("generate-character-button").addEventListener("click", generateCharacter);
