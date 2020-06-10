import {CityModel} from './City.model';
import {WeatherModel} from './Weather.model';
import {FiveDaysModel} from './FiveDays.model';

export class SelectedCityModel {
  constructor(selectedCity: CityModel, todayWeather: WeatherModel, fiveDays: FiveDaysModel) {
    this.selectedCity = selectedCity;
    this.todayWeather = todayWeather;
    this. fiveDays = fiveDays;
  }

  selectedCity: CityModel;
  todayWeather: WeatherModel;
  fiveDays: FiveDaysModel;
}
