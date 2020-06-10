import {Component, OnInit} from '@angular/core';
import {Store} from '@ngrx/store';
import {FavoriteModel} from './models/favorite.model';
import {TempToggleService} from '../temp-toggle.service';


@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.component.html',
  styleUrls: ['./favorites.component.css']
})
export class FavoritesComponent implements OnInit {
  tempCord: boolean;
  favorites: FavoriteModel[];
  celCord = '°C';
  farCord = '°F';



  constructor(private tempService: TempToggleService,
              private store: Store<{favoritesList: {favorites: FavoriteModel[] } }>) { }

  ngOnInit(): void {
    this.tempService.tempStatus.subscribe( tempCord => {
      this.tempCord = tempCord;
    } )
    this.store.select('favoritesList').subscribe( favorites => {
      this.favorites = favorites.favorites;
    })
  }

}
