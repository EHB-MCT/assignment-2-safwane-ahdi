let racesData, classesData;

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

