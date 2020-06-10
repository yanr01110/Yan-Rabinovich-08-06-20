import {Action} from '@ngrx/store';

import * as CityAction from './city.action'
import {CityModel} from '../models/City.model';

const initialState = {
  selectedCity: []
};

export function cityReducer(
  state = initialState,
  action: CityAction.SelectCity) {
  switch (action.type) {
    case CityAction.SELECT_CITY:
      return {
        ...state,
        selectedCity: action.payload
      };
    default:
      return state;
  }
}
