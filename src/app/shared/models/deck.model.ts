import { Card } from "./cards.model";

export class Deck {
    constructor(
        public id: string,
        public name: string,
        public cards: Card[] = []) {
    }
}