import { Routes } from '@angular/router';

export const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  {
    path: 'home', 
    loadComponent: () => import('./pages/home/home.component').then((c) => c.HomeComponent)
  },
  {
    path: 'create', 
    loadComponent: () => 
      import('./pages/create-deck/create-deck.component').then((c) => c.CreateDeckComponent)
  },
  {
    path: 'deck-list', 
    loadComponent: () => 
      import('./pages/deck-list/deck-list.component').then((c) => c.DeckListComponent)
  },
  {
    path: 'deck-details/:id', 
    loadComponent: () => 
      import('./pages/deck-details/deck-details.component').then((c) => c.DeckDetailsComponent)
  },
];