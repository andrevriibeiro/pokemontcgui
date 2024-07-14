import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CreateDeckComponent } from './pages/create-deck/create-deck.component';
import { DeckListComponent } from './pages/deck-list/deck-list.component';
import { DeckDetailsComponent } from './pages/deck-details/deck-details.component';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'create', component: CreateDeckComponent },
  { path: 'deck-list', component: DeckListComponent },
  { path: 'deck-details/:id', component: DeckDetailsComponent },
  { path: '**', redirectTo: '/home' },
];