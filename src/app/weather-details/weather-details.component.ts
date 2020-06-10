import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Observable} from 'rxjs';
import {CityModel} from './models/City.model';
import {WeatherService} from './services/weather.service';
import {WeatherModel} from './models/Weather.model';
import {FiveDaysModel} from './models/FiveDays.model';
import {Store} from '@ngrx/store';
import {FavoriteModel} from '../favorites/models/favorite.model';
import * as FavoritesActions from '../favorites/store/favorites.action';
import * as CityActions from './store/city.action';
import {WeatherIconsModel} from './models/WeatherIcons.model';
import {SelectedCityModel} from './models/selectedCity.model';
import {ActivatedRoute} from '@angular/router';
import {TempToggleService} from '../temp-toggle.service';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-weather-details',
  templateUrl: './weather-details.component.html',
  styleUrls: ['./weather-details.component.css']
})
export class WeatherDetailsComponent implements OnInit {

  searchControl = new FormControl();
  Cities: Observable<CityModel[]>;
  currentWeather: WeatherModel;
  metric: boolean = true;
  fiveDays: FiveDaysModel;
  WeatherIcons: WeatherIconsModel[] = [];
  favoriteStatus: string;
  selectedCity: CityModel;
  private favorites: FavoriteModel[];
  regex = new RegExp('^[a-zA-Z\' ]+$');
  isLoadingCurWeather = false;
  isLoadingFiveDays = false;
  tempCord: boolean;
  celCord = '°C';
  farCord = '°F';

  constructor(private route: ActivatedRoute, private WService: WeatherService, private snackBar: MatSnackBar, private tempService: TempToggleService, private store: Store<{ favoritesList: { favorites: FavoriteModel[] }, selectedCity: { selectedCity: { selectedCity: CityModel, todayWeather: WeatherModel, fiveDays: FiveDaysModel } } }>) {
  }

  ngOnInit() {
    this.initIconsArray();

    this.tempService.tempStatus.subscribe(tempCord => {
      this.tempCord = tempCord;
    });

    this.searchControl.valueChanges.subscribe(value => {
      if (this.regex.test(value)) {
        this.Cities = this.WService.getCitiesByInput(value.trim());
      } else if (value != '') {
        this.snackBar.open('Only English Letters Allowed!', 'Close', {
          duration: 2000
        });
        this.searchControl.setValue(value.slice(0, -1));
      }
    });


    this.store.select('favoritesList').subscribe(fv => {
      this.favorites = fv.favorites;
    });

    this.store.select('selectedCity').subscribe(city => {
      this.currentWeather = city.selectedCity.todayWeather;
      this.fiveDays = city.selectedCity.fiveDays;
      this.selectedCity = city.selectedCity.selectedCity;
      this.favoriteCheck() ? this.favoriteStatus = 'favorite' : this.favoriteStatus = 'favorite_border';
    });

    if (this.route.snapshot.params['city']) {
      this.isLoadingCurWeather = true;
      this.WService.getCitiesByInput(this.route.snapshot.params['city']).subscribe(city => {
        this.isLoadingCurWeather = false;
        this.selectedCity = city[0];
        this.onSelectCity(this.selectedCity);
      });
    } else {
      this.geolocationInit();
    }
  }


  onSelectCity(city: CityModel) {
    this.isLoadingCurWeather = true;
    this.selectedCity = city;
    this.WService.getCurrentCondition(city.Key).subscribe(curWeatherData => {
      this.isLoadingCurWeather = false;
      this.currentWeather = curWeatherData[0];
      this.isLoadingFiveDays = true;
      this.WService.getFiveDaysWeather(city.Key, this.metric).subscribe(fiveDaysData => {
        this.isLoadingFiveDays = false;
        this.fiveDays = fiveDaysData;
        this.store.dispatch(new CityActions.SelectCity(new SelectedCityModel(city, this.currentWeather, this.fiveDays)));
      });
    });
  }

  initIconsArray() {
    var urlNum;
    for (let i = 1; i < 45; i++) {
      if (i < 10) {
        urlNum = '0' + i;
      } else {
        urlNum = i;
      }
      this.WeatherIcons.push(new WeatherIconsModel(i, 'https://developer.accuweather.com/sites/default/files/' + urlNum + '-s.png'));
    }
  }

  geolocationInit() {
    if (!this.selectedCity) {
      if (!navigator.geolocation) {
        this.defaultLocation();
      } else {
        navigator.geolocation.getCurrentPosition(success => {
          this.getByCurrentLocation(success.coords);
        }, geoError => {
          this.defaultLocation();
        });
      }
    }
  }

  defaultLocation() {
    let tlvCity = {
      'Version': 1,
      'Key': '215854',
      'Type': 'City',
      'Rank': 31,
      'LocalizedName': 'Tel Aviv',
      'Country': {'ID': 'IL', 'LocalizedName': 'Israel'},
      'AdministrativeArea': {'ID': 'TA', 'LocalizedName': 'Tel Aviv'}
    };
    this.onSelectCity(tlvCity);
  }

  getByCurrentLocation(coords: Coordinates) {
    this.WService.getCityByGeolocation(coords.latitude.toString(), coords.longitude.toString()).subscribe(geolocationCity => {
      this.onSelectCity(geolocationCity);
    });
  }

  addRemoveFavorite(selectedCity: CityModel) {
    if (this.favoriteCheck()) {
      this.store.dispatch(new FavoritesActions.RemoveFavorite(this.selectedCity.Key));
      this.favoriteStatus = 'favorite_border';
    } else {
      this.store.dispatch(new FavoritesActions.AddFavorite(
        new FavoriteModel(
          this.findMaxID(),
          selectedCity.LocalizedName,
          this.currentWeather.Temperature.Metric.Value.toString(),
          this.currentWeather.Temperature.Imperial.Value.toString(),
          this.currentWeather.WeatherText, selectedCity.Key)));
      this.favoriteStatus = 'favorite';
    }
  }

  favoriteCheck() {
    for (let fv of this.favorites) {
      if (this.selectedCity.Key === fv.cityKey) {
        return true;
      }
    }
    return false;
  }

  findMaxID() {
    if (this.favorites.length === 0) {
      return 1;
    } else {
      let maxID = 0;
      for (let fv of this.favorites) {
        if (fv.ID > maxID) {
          maxID = fv.ID;
        }
      }
      return maxID + 1;
    }
  }

  cToF(celsius) {
    let cTemp = celsius;
    let cToFahr = cTemp * 9 / 5 + 32;
    cToFahr = Math.round(cToFahr);
    return cToFahr;
  }
}
