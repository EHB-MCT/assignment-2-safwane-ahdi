import Character from './Character.js';

const character = new Character('', '', '', ''); // Initialize the character object

const API_BASE_URL = 'https://www.dnd5eapi.co/api';

// Helper Functions
function clearDropdown(dropdownId) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">Select an option</option>';
}

function addOption(dropdownId, value, text) {
    const dropdown = document.getElementById(dropdownId);
    const option = document.createElement('option');
    option.value = value;
    option.textContent = text;
    dropdown.appendChild(option);
}

function resetDependentDropdowns(...dropdownIds) {
    dropdownIds.forEach(clearDropdown);
}

function populateDropdown(dropdownId, options, defaultText = "Select an option") {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = `<option value="">${defaultText}</option>`;
    options.forEach(option => addOption(dropdownId, option.index, option.name));
}

// Populate All Dropdowns
async function populateDropdowns() {
    try {
        const [races, classes, subclasses, backgrounds] = await Promise.all([
            fetch(`${API_BASE_URL}/races`).then(res => res.json()),
            fetch(`${API_BASE_URL}/classes`).then(res => res.json()),
            fetch(`${API_BASE_URL}/subclasses`).then(res => res.json()),
            fetch('backgrounds.json').then(res => res.json())
        ]);

        populateDropdown('race', races.results);
        populateDropdown('class', classes.results);
        populateDropdown('subclass', subclasses.results);


        clearDropdown('background');
        backgrounds.forEach(background => {
            addOption('background', background.index, background.name);
        });
    } catch (error) {
        console.error('Error fetching dropdown data:', error);
    }
}

// Update Race Options
function updateRaceOptions() {
    const raceDropdown = document.getElementById('race');
    if (raceDropdown) {
        raceDropdown.addEventListener('change', async () => {
            const race = raceDropdown.value;
            clearDropdown('languages');
            clearDropdown('subclass'); // Reset dependent dropdown
            if (!race) return;

            try {
                const response = await fetch(`${API_BASE_URL}/races/${race}`);
                const data = await response.json();
                data.languages.forEach(language => {
                    addOption('languages', language.index, language.name);
                });

                character.race = race; // Update character's race
                character.updateDerivedStats(); // Recalculate stats
            } catch (error) {
                console.error('Error fetching race data:', error);
            }
        });
    }
}


// Update Class Options
function updateClassOptions() {
    const classDropdown = document.getElementById('class');
    if (classDropdown) {
        classDropdown.addEventListener('change', async () => {
            const selectedClass = classDropdown.value;
            if (!selectedClass) return;

            try {
                const response = await fetch(`${API_BASE_URL}/classes/${selectedClass}`);
                const data = await response.json();
                clearDropdown('weapons');
                clearDropdown('spells');

                data.proficiencies.forEach(proficiency => {
                    if (proficiency.type === 'Weapon') {
                        addOption('weapons', proficiency.index, proficiency.name);
                    }
                });

                if (data.spellcasting) {
                    const spellsResponse = await fetch(`${API_BASE_URL}/classes/${selectedClass}/spells`);
                    const spellsData = await spellsResponse.json();
                    const level1Spells = spellsData.results.filter(spell => spell.level === 1);
                    level1Spells.forEach(spell => {
                        addOption('spells', spell.index, spell.name);
                    });
                }

                character.class = selectedClass; // Update character's class
                character.updateDerivedStats(); // Recalculate stats

                updateSkills(); // Update skills dynamically
            } catch (error) {
                console.error('Error fetching class data:', error);
            }
        });
    }
}

function updateSkills() {
    const skillsDropdown = document.getElementById('skills');
    if (!skillsDropdown) {
        console.error('Skills dropdown element not found.');
        return;
    }
    clearDropdown('skills');

    const classDropdown = document.getElementById('class');
    const selectedClass = classDropdown.value;

    if (selectedClass) {
        fetch(`${API_BASE_URL}/classes/${selectedClass}`)
            .then(response => response.json())
            .then(data => {
                if (data.proficiency_choices && data.proficiency_choices.length > 0) {
                    const from = Array.isArray(data.proficiency_choices[0].from)
                        ? data.proficiency_choices[0].from
                        : [];
                    from.forEach(skill => {
                        addOption('skills', skill.index, skill.name);
                    });
                    skillsDropdown.setAttribute('data-max-selectable', data.proficiency_choices[0].choose);
                } else {
                    console.warn('No proficiency choices available for this class.');
                }
            })
            .catch(error => console.error('Error fetching class skills:', error));
    }
}

// Skill Limit Enforcement
function enforceSkillLimit() {
    const skillsDropdown = document.getElementById('skills');
    if (skillsDropdown) {
        const maxSelectable = parseInt(skillsDropdown.getAttribute('data-max-selectable'), 10);
        const selectedSkills = Array.from(skillsDropdown.options).filter(option => option.selected);

        if (selectedSkills.length > maxSelectable) {
            selectedSkills[selectedSkills.length - 1].selected = false;
            alert(`You can only select up to ${maxSelectable} skills.`);
        }
    }
}

// Stat Generation Handlers
function setupStatGenerationHandlers() {
    document.getElementById('point-buy-btn')?.addEventListener('click', () => {
        document.getElementById('point-buy-container').style.display = 'block';
        document.getElementById('dice-roll-container').style.display = 'none';
    });

    document.getElementById('dice-roll-btn')?.addEventListener('click', () => {
        document.getElementById('point-buy-container').style.display = 'none';
        document.getElementById('dice-roll-container').style.display = 'block';
    });

    document.getElementById('apply-point-buy')?.addEventListener('click', () => {
        const stats = {
            STR: parseInt(document.getElementById('str').value),
            DEX: parseInt(document.getElementById('dex').value),
            CON: parseInt(document.getElementById('con').value),
            INT: parseInt(document.getElementById('int').value),
            WIS: parseInt(document.getElementById('wis').value),
            CHA: parseInt(document.getElementById('cha').value),
        };

        const pointTotal = Object.values(stats).reduce((a, b) => a + b - 8, 0);
        if (pointTotal > 27) {
            alert('You have exceeded 27 points!');
        } else {
            character.stats = stats;
            character.updateDerivedStats();
            alert('Point Buy applied successfully!');
        }
    });

    document.getElementById('roll-dice-btn')?.addEventListener('click', () => {
        const stats = character.rollStats();
        const rolledStatsDiv = document.getElementById('rolled-stats');
        rolledStatsDiv.innerHTML = `
            <p>STR: ${stats.STR}</p>
            <p>DEX: ${stats.DEX}</p>
            <p>CON: ${stats.CON}</p>
            <p>INT: ${stats.INT}</p>
            <p>WIS: ${stats.WIS}</p>
            <p>CHA: ${stats.CHA}</p>
        `;
        character.stats = stats;
        character.updateDerivedStats();
    });
}

// Initialize the Page
document.addEventListener('DOMContentLoaded', () => {
    populateDropdowns();
    updateRaceOptions();
    updateClassOptions();
    setupStatGenerationHandlers();
    document.getElementById('skills')?.addEventListener('change', enforceSkillLimit);
});
