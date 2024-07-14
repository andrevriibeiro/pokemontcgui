import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormArray,
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { IgxIconModule, IgxInputGroupModule, IgxPaginatorModule } from 'igniteui-angular';
import { AlertService } from 'src/app/core/services/alert.service';
import { ActivatedRoute, Router } from '@angular/router';
import { DeckService } from 'src/app/core/services/deck.service';
import { Deck } from 'src/app/shared/models/deck.model';
import { CardComponent } from 'src/app/shared/components/card/card.component';

@Component({
  selector: 'app-deck-details',
  standalone: true,
  imports: [
    CommonModule,
    IgxIconModule,
    IgxPaginatorModule,
    IgxInputGroupModule,
    FormsModule,
    ReactiveFormsModule,
    CardComponent
  ],
  templateUrl: './deck-details.component.html',
  styleUrl: './deck-details.component.scss',
})
export class DeckDetailsComponent implements OnInit {

  private activatedRoute = inject(ActivatedRoute);

  deleteCardFromDeckSignal = (index: number) => () => this.delete(index);

  public formEditDeck!: FormGroup;
  public deck!: Deck;
  private deckId!: string;

  /**
   * contains counts for Pokémon, trainers, and card types.
   */
  public pokemonCount: number = 0;
  public trainerCount: number = 0;
  public cardTypeCount: number = 0;

  public loading: boolean = false;

  constructor(
    private deckService: DeckService,
    private alertService: AlertService,
    private formBuilder: FormBuilder,
    private router: Router) {}

  ngOnInit(): void {
    // subscribes to route parameters and loads the deck 
    // or initializes the form based on the presence of deckId.
    this.activatedRoute.params.subscribe((params) => {
      this.deckId = params['id'];
      if (this.deckId) {
        this.loadDeck();
      } else {
        this.initializeForm();
      }
    });
  }

  /**
   * method responsible for initializing form group
   *
   */
  private initializeForm() {
    this.formEditDeck = this.formBuilder.group({
      deck: this.formBuilder.group({
        name: [this.deck ? this.deck.name : '', [Validators.required]],
        cards: [
          this.deck ? this.deck.cards : [],
          [
            Validators.required,
            Validators.minLength(24),
            Validators.maxLength(60),
          ],
        ],
      }),
    });
  }

  loadDeck() {
    this.deckService
      .getDeckById(this.deckId)
      .subscribe((deck: Deck | undefined) => {
        if (deck) {
          this.deck = { ...deck };
          this.initializeForm();
          this.getCardCounts();
          this.getUniqueTypesCount();
        } else {
          this.alertService.showError('Baralho nao encontrado.', '');
        }
      });
  }

  delete(index: number) {
    console.log('index', index);
    const cardsCopy = [...this.deck.cards];
    cardsCopy.splice(index, 1);
    this.deck.cards = cardsCopy;
    this.getCardCounts();
    this.getUniqueTypesCount();
  }

  get cards(): FormArray {
    return this.formEditDeck.get('deck.cards') as FormArray;
  }

  totalCards(): number {
    const form = this.formEditDeck.get('deck')?.value;
    return form.cards.length;
  }

  getCardCounts() {
    this.pokemonCount = this.deck.cards.filter((card) => card.supertype === 'Pokémon').length;
    this.trainerCount = this.deck.cards.filter((card) => card.supertype === 'Trainer').length;
  }

  /**
   * Returns the number of unique types in the deck.
   *
   */
  getUniqueTypesCount() {
    const types = new Set<string>();

    this.deck.cards.forEach((card) => {
      if (card.types) {
        card.types.forEach((type) => types.add(type));
      }
    });

    this.cardTypeCount = types.size;
  }

  update() {
    const deck = this.buildNewDeck();
    this.deckService.updateDeck(deck).subscribe({
      complete: () => this.completeUpdateWithSuccess(),
      error: (erro) => this.alertService.showSuccess(erro, ''),
    });
  }

  completeUpdateWithSuccess() {
    this.alertService.showSuccess('Baralho atualizado com sucesso.', '');
    this.back();
  }

  private buildNewDeck(): Deck {
    const form = this.formEditDeck.get('deck')?.value;
    return new Deck(this.deckId, form.name, this.deck.cards);
  }

  isSaveButtonEnabled(): boolean {
    return this.formEditDeck.valid;
  }

  back() {
    this.router.navigate(['/deck-list']);
  }
}
