export function setupSkillSelection(character) {
    document.getElementById('proficiencies').addEventListener('change', (e) => {
        const selectedProficiencies = Array.from(e.target.selectedOptions).map(option => option.value);
        character.proficiencies = selectedProficiencies;
        character.calculateSkills();
        updateSkillModifiersUI(character);
    });

    document.getElementById('expertise').addEventListener('change', (e) => {
        const selectedExpertise = Array.from(e.target.selectedOptions).map(option => option.value);
        character.expertise = selectedExpertise;
        character.calculateSkills();
        updateSkillModifiersUI(character);
    });
}

function updateSkillModifiersUI(character) {
    Object.keys(character.skills).forEach((ability) => {
        Object.keys(character.skills[ability]).forEach((skill) => {
            const skillId = `${skill.toLowerCase().replace(/_/g, '-')}-modifier`;
            const skillElement = document.getElementById(skillId);
            if (skillElement) {
                skillElement.textContent = character.skills[ability][skill];
            }
        });
    });
}
