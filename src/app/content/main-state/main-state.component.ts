import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { Observable } from 'rxjs';

import { CityService }  from '../../shared/cities/city.service';
import { TimeService } from '../../shared/time.service';
import { TemperatureService } from '../../shared/temperature.service';

import { City } from '../../shared/cities/city';


@Component({
  selector: 'main-state',
  templateUrl: './main-state.component.html',
  styleUrls: ['../content.component.css', './main-state.component.css']
})

export class MainStateComponent implements OnInit, AfterViewInit {

    cities$: Observable<City[]>;

    tickingClock: number;

    @Input() curTempUnits: string;

    constructor(
        private cityService: CityService,
        private timeService: TimeService,
        private temperatureService: TemperatureService
    ) {
    }

    ngOnInit() {

        if(!this.cityService.isLSEmpty()) {
            
            this.cities$ = this.cityService.getSaved();
            
            this.cities$.subscribe(res => res.forEach(el => {

                // convert time on the fly
                el.cur_time = this.timeService.getDayAndTime(el.timezone)[0];
                el.cur_date = this.timeService.getDayAndTime(el.timezone)[1];
                
                // convert temperature on the fly
                if(this.curTempUnits === 'celcius') {
                    el.w_temp_kelvin = this.temperatureService.kelvinToCelcius(el.w_temp_kelvin);
                } else {
                    el.w_temp_kelvin = this.temperatureService.kelvinToFahrenheit(el.w_temp_kelvin);
                }
            }));

            this.tickingClock = this.timeService.startTime(this.cities$);
        }
    }

    ngAfterViewInit() {

        // update weather after loading view (if cities exist)
        if(!this.cityService.isLSEmpty()) {
            this.cityService.updateWeather();
        }   
    }

    checkWeather() {
        if(!this.cityService.isLSEmpty()) {
            this.cityService.updateWeather();
        }
    }

    ngOnDestroy() {

        // stop clock after destroying view
        this.timeService.stopTime(this.tickingClock);
    }

}