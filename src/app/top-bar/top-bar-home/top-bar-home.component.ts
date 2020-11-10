import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { TemperatureService } from '../../shared/temperature.service';

@Component({
  selector: 'top-bar-home',
  templateUrl: './top-bar-home.component.html',
  styleUrls: ['../top-bar.component.css', './top-bar-home.component.css']
})

export class TopBarHomeComponent implements OnInit {

  @Input() isEmpty: boolean;
  @Input() curTempUnits: string;

  constructor(
    private router: Router,
    private temperatureService: TemperatureService
  ) {
  }

  ngOnInit() {
  }

  // Convert current temperature method for template button
  convertTemp(direction:any) {

    if(direction === 'toCelcius') {
      this.curTempUnits = 'celcius';      
    } else {
      this.curTempUnits = 'fahrenheit';
    }

    this.temperatureService.toggleTemperatureUnits(this.curTempUnits);
  }

  ngAfterViewInit() {
  }
}