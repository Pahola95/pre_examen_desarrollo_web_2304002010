import { Routes } from '@angular/router';

export const routes: Routes = [
	{ path: '', redirectTo: 'exchange', pathMatch: 'full' },
	{
		path: 'exchange',
		loadComponent: () =>
			import('./components/exchange/exchange.component').then((m) => m.ExchangeComponent),
	},
	{
		path: 'movies',
		loadComponent: () =>
			import('./components/movies/movies.component').then((m) => m.MoviesComponent),
	},
];
