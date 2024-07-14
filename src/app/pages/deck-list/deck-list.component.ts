import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IgxAvatarModule, IgxIconButtonDirective, IgxIconModule, IgxRippleModule } from 'igniteui-angular';
import { AlertService } from 'src/app/core/services/alert.service';
import { DeckService } from 'src/app/core/services/deck.service';
import { Deck } from 'src/app/shared/models/deck.model';

@Component({
  selector: 'app-deck-list',
  standalone: true,
  imports: [
    CommonModule,
    IgxIconModule,
    IgxRippleModule,
    IgxIconButtonDirective,
    IgxAvatarModule
  ],
  templateUrl: './deck-list.component.html',
  styleUrl: './deck-list.component.scss'
})
export class DeckListComponent implements OnInit {

  decks: Deck[] = [];
  loading: boolean = false;

  constructor(private router: Router,
    private deckService: DeckService,
    private alertService: AlertService) { }

  ngOnInit(): void {
    this.loadDecks();
  }

  loadDecks() {
    this.loading = true;
    this.deckService.getMyDecks().subscribe((decks: Deck[]) => {
      this.decks = decks;
      this.loading = false;
    })
  }

  openDeckDetails(deckId: string) {
    this.router.navigate([`/deck-details/${deckId}`]);
  }

  delete(deck: Deck) {
    this.deckService.deleDeckById(deck.id);
    this.alertService.showSuccess(
      `Baralho <strong> ${deck.name} </strong> deletado com sucesso!`,
      ''
    );
    this.loadDecks();
  }

  back() {
    this.router.navigate(['/home']);
  }

}
