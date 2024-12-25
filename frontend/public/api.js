const API_BASE_URL = 'https://www.dnd5eapi.co/api';

export async function fetchRaces() {
    const response = await fetch(`${API_BASE_URL}/races`);
    return response.json();
}

export async function fetchClasses() {
    const response = await fetch(`${API_BASE_URL}/classes`);
    return response.json();
}

export async function fetchSubclasses() {
    const response = await fetch(`${API_BASE_URL}/subclasses`);
    return response.json();
}

export async function fetchBackgrounds() {
    const response = await fetch('backgrounds.json');
    return response.json();
}
