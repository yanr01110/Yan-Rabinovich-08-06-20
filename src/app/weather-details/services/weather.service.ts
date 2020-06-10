import {Injectable} from '@angular/core';
import {CityModel} from '../models/City.model';
import {HttpClient, HttpErrorResponse} from '@angular/common/http';
import {WeatherModel} from '../models/Weather.model';
import {FiveDaysModel} from '../models/FiveDays.model';
import {GeolocationModel} from '../models/Geolocation.model';
import {catchError, retry} from 'rxjs/operators';
import {throwError} from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class WeatherService {

  private apiKey = 'ARblGdYaHVGqC1AYhm8l2aplC0QTIdgw';
  private autocompleteAPI = 'https://dataservice.accuweather.com/locations/v1/cities/autocomplete?apikey=' + this.apiKey + '&q=';
  private currentConditionAPI = 'https://dataservice.accuweather.com/currentconditions/v1/';
  private fiveDaysAPI = 'https://dataservice.accuweather.com/forecasts/v1/daily/5day/';
  private geolocationAPI = 'https://dataservice.accuweather.com/locations/v1/cities/geoposition/search?apikey=';


  constructor(private http: HttpClient) {
  }

  getCitiesByInput(input: string) {
    return this.http.get<CityModel[]>(this.autocompleteAPI + input)
      .pipe(
        retry(1),
        catchError(this.handleError));
  }

  getCurrentCondition(cityKey: string) {
    return this.http.get<WeatherModel>(this.currentConditionAPI + cityKey + '?apikey=' + this.apiKey)
      .pipe(
        retry(1),
        catchError(this.handleError));
  }

  getFiveDaysWeather(cityKey: string, metric: boolean) {
    return this.http.get<FiveDaysModel>(this.fiveDaysAPI + cityKey + '?apikey=' + this.apiKey + '&metric=' + metric)
      .pipe(
        retry(1),
        catchError(this.handleError));
  }

  getCityByGeolocation(lat: string, lon: string) {
    return this.http.get<GeolocationModel>(this.geolocationAPI + this.apiKey + '&q=' + lat + ',' + lon)
      .pipe(
        retry(1),
        catchError(this.handleError));
  }

  handleError(error) {
    let errorMessage = '';

    if (error.error instanceof ErrorEvent) {
      errorMessage = `Error: ${error.error.message}`;
    } else if(error.status === 0){
      errorMessage = 'AccuWeather api key expired';
    } else {
      errorMessage = error.message;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
  }
}
