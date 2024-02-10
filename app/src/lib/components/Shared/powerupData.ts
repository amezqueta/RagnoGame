import { writable } from 'svelte/store';

interface Powerup {
    id: number;
    name: string;
    description: string;
}

const powerups: Powerup[] = [
    { id: 0, name: 'Powerup 0', description: 'Nothing' },
    { id: 1, name: 'Powerup 1', description: 'Description of powerup 1' },
    { id: 2, name: 'Powerup 2', description: 'Description of powerup 2' },
    { id: 3, name: 'Powerup 3', description: 'Description of powerup 3' },
    { id: 4, name: 'Powerup 4', description: 'Description of powerup 4' },
    { id: 5, name: 'Powerup 5', description: 'Description of powerup 5' },
    { id: 6, name: 'Powerup 6', description: 'Description of powerup 6' },
    { id: 7, name: 'Powerup 7', description: 'Description of powerup 7' },
    { id: 8, name: 'Powerup 8', description: 'Description of powerup 8' },
    { id: 9, name: 'Powerup 9', description: 'Description of powerup 9' },
    { id: 10, name: 'Powerup 10', description: 'Description of powerup 10' },
];

export const getPowerup = (id: number):Powerup => {
    return powerups[id];
}
