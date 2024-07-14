import { Component } from '@angular/core';
import { IgxButtonModule, IgxCardModule } from 'igniteui-angular';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { Router } from '@angular/router';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [IgxButtonModule, ScrollingModule, IgxCardModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.scss'
})
export class HomeComponent {

  constructor(private router: Router) { }

  createDeck() {
    this.router.navigate(['/create']);
  }

  myDecks() {
    this.router.navigate(['/deck-list']);
  }

}
