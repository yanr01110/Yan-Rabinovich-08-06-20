import {Component, OnInit, Renderer2, ViewEncapsulation} from '@angular/core';
import {Router, RoutesRecognized} from '@angular/router';
import {TempToggleService} from './temp-toggle.service';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  title = 'MedisimWeatherAssignment';
  themeStatus: boolean;
  tempScaleStatus: boolean;
  themeColor: string;
  tempScale: string;


  constructor(private route: Router, private renderer: Renderer2, private tempService: TempToggleService, private snackBar: MatSnackBar) {
  }

  ngOnInit() {
    if (!navigator.onLine) {
      this.snackBar.open('No Internet Connection!', 'Close', {
        duration: 10000
      });
    }
    this.initRouteButtonColor();
    this.initTheme();
    this.initTempScale();
  }

  initTheme() {
    if (!localStorage.getItem('theme')) {
      localStorage.setItem('theme', 'theme-light');
      this.themeStatus = false;
      this.themeColor = 'Light';
    }

    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-dark');
      this.themeStatus = true;
      this.themeColor = 'Dark';
    } else {
      this.setTheme('theme-light');
      this.themeStatus = false;
      this.themeColor = 'Light';
    }
  }

  initTempScale() {
    if (!localStorage.getItem('tempscale')) {
      localStorage.setItem('tempscale', 'c');
      this.tempScaleStatus = false;
      this.tempScale = '°C';
      this.tempService.toggleTemp(false);
    }

    if (localStorage.getItem('tempscale') === 'f') {
      this.tempScaleStatus = true;
      this.tempScale = '°F';
      this.tempService.toggleTemp(true);
    } else {
      this.tempScaleStatus = false;
      this.tempScale = '°C';
      this.tempService.toggleTemp(false);
    }
  }

  initRouteButtonColor() {
    this.route.events.subscribe(route => {
      if (route instanceof RoutesRecognized) {
        if (route.urlAfterRedirects.includes('/weather')) {
          this.renderer.setStyle(document.querySelector('.weather-button'), 'background-color', 'darkgrey');
          this.renderer.setStyle(document.querySelector('.favorites-button'), 'background-color', 'unset');
        } else if (route.urlAfterRedirects === '/favorites') {
          this.renderer.setStyle(document.querySelector('.favorites-button'), 'background-color', 'darkgrey');
          this.renderer.setStyle(document.querySelector('.weather-button'), 'background-color', 'unset');
        }
      }
    });
  }

  setTheme(themeName) {
    let attToRemove = themeName === 'theme-dark' ? 'theme-light' : 'theme-dark';
    localStorage.setItem('theme', themeName);
    this.renderer.addClass(document.querySelector('#main-container'), themeName);
    this.renderer.removeClass(document.querySelector('#main-container'), attToRemove);
  }

  toggleTheme() {
    if (localStorage.getItem('theme') === 'theme-dark') {
      this.setTheme('theme-light');
      this.themeColor = 'Light';
    } else {
      this.setTheme('theme-dark');
      this.themeColor = 'Dark';
    }
  }

  selectTheme() {
    if (!this.themeStatus) {
      localStorage.setItem('theme', 'theme-light');
    } else {
      localStorage.setItem('theme', 'theme-dark');
    }
    this.toggleTheme();
  }

  selectTempScale() {
    if (this.tempScaleStatus) {
      localStorage.setItem('tempscale', 'c');
      this.tempScale = '°C';
      this.tempService.toggleTemp(false);
    } else {
      localStorage.setItem('tempscale', 'f');
      this.tempScale = '°F';
      this.tempService.toggleTemp(true);
    }
  }
}
