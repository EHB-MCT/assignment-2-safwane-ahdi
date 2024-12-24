const API_BASE_URL = 'https://www.dnd5eapi.co/api';

function populateDropdown(endpoint, dropdownId) {
    fetch(`${API_BASE_URL}/${endpoint}`)
        .then(response => response.json())
        .then(data => {
            const dropdown = document.getElementById(dropdownId);
            console.log(data)
            data.results.forEach(item => {
                const option = document.createElement('option');
                option.value = item.index;
                option.textContent = item.name;
                dropdown.appendChild(option);
            });
        })
        .catch(error => console.error(`Error fetching ${endpoint}:`, error));
}

document.addEventListener('DOMContentLoaded', () => {
    populateDropdown('races', 'race');
    populateDropdown('classes', 'class');
    populateDropdown('subclasses', 'subclass');
    populateDropdown('backgrounds', 'background');
    populateDropdown('proficiencies', 'skills');
    populateDropdown('equipment-categories', 'weapons');
    populateDropdown('spells', 'spells');
    populateDropdown('languages', 'languages');
});