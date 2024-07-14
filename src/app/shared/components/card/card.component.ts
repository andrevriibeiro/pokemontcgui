import { CommonModule } from '@angular/common';
import { Component, Input, Signal, signal } from '@angular/core';
import {
  IgxAvatarModule,
  IgxCardModule,
  IgxIconButtonDirective,
  IgxIconModule,
  IgxInputGroupModule,
  IgxPaginatorModule,
  IgxRippleModule,
} from 'igniteui-angular';
import { Card } from '../../models/cards.model';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [
    IgxIconModule,
    IgxIconButtonDirective,
    IgxAvatarModule,
    CommonModule,
    IgxCardModule,
    IgxIconModule,
    IgxRippleModule,
    IgxIconButtonDirective,
    IgxAvatarModule,
    IgxPaginatorModule,
    IgxInputGroupModule,
  ],
  templateUrl: './card.component.html',
  styleUrl: './card.component.scss',
})
export class CardComponent {

  @Input() displayDeleteCardBtn: boolean = false;

  @Input() card!: Card;
  @Input() index!: number;

  @Input() deleteCardFromDeckSignal!: (index: number) => void;

  /**
   * receives signals from the parent component for opacity, add, and remove actions.
   */
  @Input() shouldApplyOpacity!: Signal<boolean>;
  @Input() addSignal: Signal<(card: Card) => void> | undefined;
  @Input() removeSignal: Signal<(card: Card) => void> | undefined;


  /**
   * emits the add event.
   */
  onAdd() {
    if (this.addSignal) {
      this.addSignal()(this.card);
    }
  }

  /**
   * emits the remove event.
   */
  onRemove() {
    if (this.removeSignal) {
      this.removeSignal()(this.card);
    }
  }

  /**
   * emits the delete event for card from the deck.
   */
  onDeleteCardFromDeck() {
    if (this.deleteCardFromDeckSignal) {
      this.deleteCardFromDeckSignal(this.index);
    }
  }

  /**
   * returns the value of the opacity signal.
   */
  get opacitySignal() {
    return this.shouldApplyOpacity ? this.shouldApplyOpacity() : false;
  }

}
