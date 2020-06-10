import {FavoriteModel} from '../models/favorite.model';
import {Action} from '@ngrx/store';

import * as FavoritesActions from './favorites.action'

const initialState = {
  favorites: []
};

export function favoritesReducer(
  state = initialState,
  action: FavoritesActions.FavoriteActions) {
  switch (action.type) {
    case FavoritesActions.ADD_FAVORITE:
      return {
        ...state,
        favorites: [...state.favorites, action.payload]
      };
    case FavoritesActions.REMOVE_FAVORITE:
      return {
        ...state,
        favorites: state.favorites.filter((fv) => {
          return fv.cityKey !== action.payload;
        })
      }
    default:
      return state;
  }
}
