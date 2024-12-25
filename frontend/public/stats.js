export function setupStatGeneration(character) {
    document.getElementById('point-buy-btn').addEventListener('click', () => {
        document.getElementById('point-buy-container').style.display = 'block';
        document.getElementById('dice-roll-container').style.display = 'none';
    });

    document.getElementById('dice-roll-btn').addEventListener('click', () => {
        document.getElementById('point-buy-container').style.display = 'none';
        document.getElementById('dice-roll-container').style.display = 'block';
    });

    document.getElementById('apply-point-buy').addEventListener('click', () => {
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

    document.getElementById('roll-dice-btn').addEventListener('click', () => {
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
