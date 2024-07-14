import { CommonModule } from '@angular/common';
import { Component, OnDestroy, signal } from '@angular/core';
import {
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IgxIconModule, IgxInputGroupModule, IgxPaginatorModule } from 'igniteui-angular';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { Pagination } from 'src/app/shared/models/pagination.model';
import { CardService } from 'src/app/core/services/card.service';
import { AlertService } from 'src/app/core/services/alert.service';
import { Router } from '@angular/router';
import { DeckService } from 'src/app/core/services/deck.service';
import { Deck } from 'src/app/shared/models/deck.model';
import { Card } from 'src/app/shared/models/cards.model';
import { v4 as uuidv4 } from 'uuid';
import { CardComponent } from 'src/app/shared/components/card/card.component';

@Component({
  selector: 'app-create-deck',
  standalone: true,
  imports: [
    CommonModule,
    IgxIconModule,
    IgxPaginatorModule,
    IgxInputGroupModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent,
  ],
  templateUrl: './create-deck.component.html',
  styleUrl: './create-deck.component.scss',
})
export class CreateDeckComponent implements OnDestroy {
  
  public formCreateDeck!: FormGroup;
  public cardPagination: Pagination<Card> = new Pagination(20, 1);
  public itemsPerPage = [5, 10, 20, 30, 50, 100];
  public loading: boolean = false;

  public totalCardCount: number = 0;

  public searchControl = new FormControl();
  public clickCounts: { [key: string]: number } = {};

  private destroy$ = new Subject<void>();

  /**
   * defines signals for handling card actions and opacity conditions.
   */
  addSignal = signal((card: Card) => this.onAddClick(card));
  removeSignal = signal((card: Card) => this.onRemoveClick(card));
  opacitySignal = (name: string) => signal(this.shouldApplyOpacity(name));

  constructor(
    private cardService: CardService,
    private deckService: DeckService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.initializeForm();
    this.loadCards();

    // subscribe to changes in the search control with a debounce of 400ms
    this.searchControl.valueChanges
      .pipe(debounceTime(400), distinctUntilChanged(), takeUntil(this.destroy$))
      .subscribe(() => {
        this.loadCards();
      });
  }

  /**
   * method responsible for initializing form group
   *
   */
  private initializeForm() {
    this.formCreateDeck = this.formBuilder.group({
      deck: this.formBuilder.group({
        name: ['', [Validators.required]],
        cards: [
          [],
          [
            Validators.required,
            Validators.minLength(24),
            Validators.maxLength(60),
          ],
        ],
      }),
    });
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  /**
   * method responsible for loading pokemon cards
   */
  private loadCards() {
    this.loading = true;
    const searchFilterValue = this.searchControl.value;
    this.cardService
      .getCards(this.cardPagination, searchFilterValue)
      .subscribe({
        next: (cards) => {
          this.cardPagination = cards;
          this.loading = false;
        },
        error: () => {
          this.loading = false;
        },
      });
  }

  /**
   * Handles the click event for adding a card to the deck.
   * Shows an error if the deck is full or an info message if the card limit is reached.
   *
   * @param card - The card to be added to the deck.
   * @returns void
   */
  onAddClick(card: Card) {
    if (this.isDeckFull()) {
      this.alertService.showError(
        'Limite de 60 cartas por baralho atingido!',
        ''
      );
      return;
    }

    if (this.canAddCard(card)) {
      this.addCardToDeck(card);
    } else {
      this.alertService.showInfo(
        'Você atingiu o limite de 4 cartas com o mesmo nome!',
        ''
      );
    }
  }

  /**
   * Checks if the deck has reached the maximum number of cards (60).
   *
   * @returns True if the deck is full, otherwise false.
   */
  private isDeckFull(): boolean {
    return this.totalCards() === 60;
  }

  /**
   * Checks if a card can be added to the deck based on the card limit.
   *
   * @param card - The card to be checked.
   * @returns True if the card can be added (less than 4 copies), otherwise false.
   */
  private canAddCard(card: Card): boolean {
    if (!this.clickCounts[card.name]) {
      this.clickCounts[card.name] = 0;
    }
    return this.clickCounts[card.name] < 4;
  }

  /**
   * Adds a card to the deck and updates the card count.
   * @param card - The card to be added to the deck.
   * @returns void
   */
  private addCardToDeck(card: Card): void {
    this.clickCounts[card.name]++;
    const cardsControl = this.cards;
    const currentCards = cardsControl.value;
    currentCards.push(card);
    this.cards.setValue(currentCards);
  }

  onRemoveClick(card: Card) {
    if (this.clickCounts[card.name]) {
      this.clickCounts[card.name]--;
    }

    const cardsControl = this.cards;
    const currentCards = cardsControl.value;
    const index = currentCards.findIndex((c: Card) => c.name === card.name);

    if (index !== -1) {
      currentCards.splice(index, 1);
      this.cards.setValue(currentCards);
    }
  }

  get cards(): FormArray {
    return this.formCreateDeck.get('deck.cards') as FormArray;
  }

  totalCards(): number {
    const form = this.formCreateDeck.get('deck')?.value;
    return form.cards.length;
  }

  shouldApplyOpacity(name: string): boolean {
    return this.clickCounts[name] >= 4;
  }

  onPageChange(event: number) {
    this.cardPagination.page = event + 1;
    this.loadCards();
  }

  perPageChange(event: any) {
    this.cardPagination.pageSize = event;
    this.loadCards();
  }

  save() {
    const deck = this.buildNewDeck();

    if (!this.deckService.checkDeckNameExists(deck.name)) {
      this.deckService.createNewDeck(deck);
      this.alertService.showSuccess(
        `Baralho <strong> ${deck.name} </strong> criado com sucesso!`,
        ''
      );
      this.goToDeckList();
    } else {
      this.alertService.showError(
        'Nome do Baralho ja existe na sua lista de Decks.',
        ''
      );
    }
  }

  private buildNewDeck(): Deck {
    const form = this.formCreateDeck.get('deck')?.value;
    const cards: Card[] = form.cards ? [...form.cards] : [];
    return new Deck(uuidv4(), form.name, cards);
  }

  isSaveButtonEnabled(): boolean {
    return this.formCreateDeck.valid;
  }

  back() {
    this.router.navigate(['/home']);
  }

  goToDeckList() {
    this.router.navigate(['/deck-list']);
  }
}
