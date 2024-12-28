function roll4d6DropLowest() {
    const rolls = [];
    for (let i = 0; i < 4; i++) {
        rolls.push(Math.floor(Math.random() * 6) + 1);
    }
    rolls.sort((a, b) => a - b); 
    rolls.shift(); 
    return rolls.reduce((total, num) => total + num, 0); 
}

function generateDiceRollScores() {
    const abilities = ["strength", "dexterity", "constitution", "intelligence", "wisdom", "charisma"];
    const scores = {};

    abilities.forEach(ability => {
        scores[ability] = roll4d6DropLowest();
    });

    return scores;
}

export { roll4d6DropLowest, generateDiceRollScores };
