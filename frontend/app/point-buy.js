const maxPoints = 27;
let remainingPoints = maxPoints;

// Cost table for ability scores
const pointCost = {
    8: 0,
    9: 1,
    10: 2,
    11: 3,
    12: 4,
    13: 5,
    14: 7,
    15: 9,
};

// Make adjustScore globally accessible by attaching it to the window object
window.adjustScore = function (ability, change) {
    const input = document.getElementById(ability);
    const currentValue = parseInt(input.value, 10);
    const newValue = currentValue + change;

    if (newValue < 8 || newValue > 15) return; // Ensure within bounds

    const currentCost = pointCost[currentValue];
    const newCost = pointCost[newValue];
    const costDifference = newCost - currentCost;

    if (remainingPoints - costDifference < 0) {
        alert("Not enough points remaining!");
        return;
    }

    // Update points and score
    remainingPoints -= costDifference;
    input.value = newValue;
    document.getElementById("points-remaining").textContent = remainingPoints;
};
