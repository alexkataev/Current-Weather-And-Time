import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TemperatureService {
  
  curTemperatureUnits: string = "celcius";
  newTemperatureUnits: Subject<string> = new Subject<string>();

  constructor() {

    this.curTemperatureUnits = this.getCurTemperatureUnits();

    this.newTemperatureUnits.subscribe((value) => {
      this.curTemperatureUnits = value;
    });

  }

  // Toggle current temperature units
  toggleTemperatureUnits(_new_value: string) {

    if(_new_value != this.curTemperatureUnits) {
      this.newTemperatureUnits.next(_new_value);
      localStorage.setItem('tempUnits', this.curTemperatureUnits);
      // console.log('⭕️TempService: New Temp Units:', this.curTemperatureUnits);
      
      const tempElems = document.getElementsByClassName('w-temp');

      for (let index = 0; index < tempElems.length; index++) {

        let degreesNum = 0;

        // Update template
        if(_new_value == 'fahrenheit') {
          degreesNum = (parseInt((tempElems[index].textContent)) * 9 / 5 + 32);
        } else {
          degreesNum = ((parseInt((tempElems[index].textContent)) - 32) * 5 / 9);
        }
        
        tempElems[index].textContent = degreesNum.toFixed(0).toString();
      }
    }
  }

  // Convert temperature from Kelvin to Celcius
  kelvinToCelcius(kelvinTemp: string): string {
    return (parseFloat(kelvinTemp) - 273.15).toFixed(0).toString();
  }
  // Convert temperature from Kelvin to Fahrenheit
  kelvinToFahrenheit(kelvinTemp: string): string {
    return ((parseFloat(kelvinTemp) - 273.15) * 9 / 5 + 32).toFixed(0).toString()
  }

  // Save current temp units to the LocalStorage
  setCurTemperatureUnits(degrees: string): void {
    localStorage.setItem('tempUnits', degrees);
  }

  // Get current temp units from the LocalStorage
  // If they have not set yet, set them to default value - Celcius
  getCurTemperatureUnits(): string {

    let tempUnits = localStorage.getItem('tempUnits');

    if(tempUnits) {
      return tempUnits;
    }
    else {
      this.setCurTemperatureUnits('celcius'); // set default value
      return 'celcius'; 
    }
  }
}