import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import {WeatherDetailsComponent} from './weather-details/weather-details.component';
import {FavoritesComponent} from './favorites/favorites.component';
import {PageNotFoundComponent} from './page-not-found/page-not-found.component';


const appRoutes: Routes = [
  { path: '', redirectTo: '/weather', pathMatch: 'full' },
  { path: 'weather', component: WeatherDetailsComponent },
  { path: 'favorites', component: FavoritesComponent },
  { path: 'weather/:city', component: WeatherDetailsComponent },
  { path: 'not-found', component: PageNotFoundComponent },
  { path: '**', redirectTo: '/not-found' }
];

@NgModule({
  imports: [RouterModule.forRoot(appRoutes)],
  exports: [RouterModule]
})
export class AppRoutingModule {

}
