import { Injectable } from '@angular/core'

@Injectable({
  providedIn: 'root',
})
export class TimeService {

  constructor() {
  }

  // Get current time in 12h-format from timezone offset in seconds 
  getDayAndTime(tz_seconds: number): string[] {

    let _time = new Date();
    const new_minutes: number = _time.getMinutes() + _time.getTimezoneOffset() + tz_seconds / 60;
    _time.setMinutes(new_minutes);
    let res: string[] = [];
    res.push(_time.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true }));
    
    let temp = _time.toLocaleString('en-US', { month: 'short', day: 'numeric' });
    if( new Date().getDate() !== _time.getDate()) {
        res.push(temp);
    } else {
        res.push('Today');
    }
    return res;
  }

  // Start updating time in the main-state template
  startTime(cities: any): number {
    // console.log('🕒TimeService');
    const timeElems = document.getElementsByClassName('city-time');
    const dateElems = document.getElementsByClassName('today');

    return window.setInterval(() => {
      cities.subscribe((res: { timezone: number; }[]) => res.forEach((el: { timezone: number; }, index:number) => {
        timeElems[index].textContent = this.getDayAndTime(el.timezone)[0];
        dateElems[index].textContent =  this.getDayAndTime(el.timezone)[1];
      }));
    }, 1000);
  }

  // Stop updating time in the main-state template
  stopTime(intervalID: number) {
    window.clearInterval(intervalID);
  }

}