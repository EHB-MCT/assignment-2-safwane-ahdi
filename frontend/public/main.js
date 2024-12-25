import Character from 'character.js';
import { fetchRaces, fetchClasses } from './api.js';
import { setupStatGeneration } from './stats.js';
import { setupSkillSelection } from './skills.js';

const character = new Character('', '', '', '');

document.addEventListener('DOMContentLoaded', async () => {
    const races = await fetchRaces();
    const classes = await fetchClasses();
    populateDropdown('race', races.results);
    populateDropdown('class', classes.results);

    setupStatGeneration(character);
    setupSkillSelection(character);
});

function populateDropdown(dropdownId, options) {
    const dropdown = document.getElementById(dropdownId);
    dropdown.innerHTML = '<option value="">Select an option</option>';
    options.forEach(option => {
        const optionElement = document.createElement('option');
        optionElement.value = option.index;
        optionElement.textContent = option.name;
        dropdown.appendChild(optionElement);
    });
}
