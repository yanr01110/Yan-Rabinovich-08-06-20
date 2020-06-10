export class FavoriteModel {
  constructor(ID: number, name: string, currentWeatherCel: string, currentWeatherFar: string, weatherName: string, cityKey: string) {
    this.ID = ID;
    this.name = name;
    this.currentWeatherCel = currentWeatherCel;
    this.currentWeatherFar = currentWeatherFar
    this.weatherName = weatherName;
    this.cityKey = cityKey;
  }

  ID: number;
  name: string;
  currentWeatherCel: string;
  currentWeatherFar: string;
  weatherName: string;
  cityKey: string;
}



