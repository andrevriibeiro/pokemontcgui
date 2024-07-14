export class Card {
    constructor(
        public id: string,
        public name: string,
        public supertype: string,
        public types: string[],
        public images: CardImage) {
    }
}

export class CardImage {
    constructor(
        public large: string,
        public small: string) {
    }
}