import { Injectable } from '@angular/core';
import {BehaviorSubject, Subject} from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TempToggleService {
  private tempToggle = new BehaviorSubject(true);

  get tempStatus() {
    return this.tempToggle.asObservable();
  }

  toggleTemp(value: boolean) {
    this.tempToggle.next(value);
  }

}
