import { Injectable } from '@angular/core';
import { Observable, of, throwError } from 'rxjs';
import { Deck } from 'src/app/shared/models/deck.model';

@Injectable({
  providedIn: 'root',
})
export class DeckService {

  private decks: Deck[] = [];

  public createNewDeck(deck: Deck) {
    this.decks.push(deck);
  }

  getMyDecks(): Observable<Deck[]> {
    return of(this.decks);
  }

  getDeckById(id: string): Observable<Deck | undefined> {
    const deck = this.decks.find((deck) => deck.id === id);
    return of(deck);
  }

  /**
   * Checks if a deck with the given name already exists.
   *
   * @param {string} name - The name of the deck to check.
   * @returns {boolean} - True if a deck with the given name exists, otherwise false.
   */
  checkDeckNameExists(name: string, id?: string): boolean {
    return this.decks.some((deck) => 
      deck.name.toLowerCase() === name.toLowerCase() && deck.id !== id
    );
  }

  /**
   * Updates a deck if the name is not duplicated.
   *
   * @param {Deck} updatedDeck - The deck to update.
   * @returns {Observable<void>} - An observable that completes if the update was successful or throws an error.
   */
  updateDeck(updatedDeck: Deck): Observable<void> {
    const deckIndex = this.decks.findIndex((deck) => deck.id === updatedDeck.id);

    if (deckIndex === -1) {
      return throwError(() => 'Deck não encontrado.');
    }

    if (this.checkDeckNameExists(updatedDeck.name, updatedDeck.id)) {
      return throwError(() => ('Nome do baralho já existe na sua lista de Decks.'));
    }

    this.decks[deckIndex] = updatedDeck;
    return of(undefined);
  }

  deleDeckById(deckId: string) {
    this.decks = this.decks.filter((deck) => deck.id !== deckId);
  }
}