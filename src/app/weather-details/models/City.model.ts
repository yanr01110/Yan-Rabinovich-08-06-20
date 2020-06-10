export interface CityModel {
  Version: number;
  Key: string;
  Type: string;
  Rank: number;
  LocalizedName: string;
  Country: CountryOrAdministrativeArea;
  AdministrativeArea: CountryOrAdministrativeArea;
}
export interface CountryOrAdministrativeArea {
  ID: string;
  LocalizedName: string;
}
