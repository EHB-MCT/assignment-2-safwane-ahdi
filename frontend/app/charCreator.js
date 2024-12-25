let racesData, classesData, selectedSkills = [];

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


// Generate Character (Partial Implementation)
function generateCharacter() {
    const selectedClass = document.getElementById("class-select").value;

    const character = {
        class: selectedClass,
        skills: selectedSkills,
    };

    document.getElementById("character-details").textContent = JSON.stringify(character, null, 2);
    document.getElementById("character-summary").style.display = "block";
}

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

