import {Action} from '@ngrx/store';
import {CityModel} from '../models/City.model';
import {FiveDaysModel} from '../models/FiveDays.model';
import {WeatherModel} from '../models/Weather.model';
import {SelectedCityModel} from '../models/selectedCity.model';


export const SELECT_CITY = 'SELECT_CITY';



export class SelectCity implements Action {
  readonly type = SELECT_CITY;

  constructor(public payload: SelectedCityModel) {
  }
}




