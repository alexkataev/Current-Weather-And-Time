import { Component, OnInit } from '@angular/core';

import { CityService }  from '../../shared/cities/city.service';

import { Pending, Status } from '../../shared/cities/city';
import { AutocompletedCity } from '../../shared/cities/city';
import { FormControl, FormGroup, Validators, FormGroupDirective } from '@angular/forms';

@Component({
  selector: 'search-state',
  templateUrl: './search-state.component.html',
  styleUrls: ['./search-state.component.css']
})

export class SearchStateComponent implements OnInit {

    searchStarted: boolean;
    searchForm: FormGroup;

    readonly status = Status;
    cities: Pending<AutocompletedCity>;

    constructor(
        private cityService: CityService
    ) {
        this.searchStarted = false;
    }

    ngOnInit() {

        // input validation
        this.searchForm = new FormGroup({
            'cityNameQuery': new FormControl('', [
                Validators.minLength(4),
                Validators.maxLength(40),
                Validators.pattern("^([a-zA-Z\u0080-\u024F]+(?:(\. )|-| |'))*[a-zA-Z\u0080-\u024F]*$"),
            ])
        });
    }

    get cityNameQuery() { return this.searchForm.get('cityNameQuery'); }

    // Getting autocomplete results on Enter
    onEnter(form: FormGroupDirective) { 

        const value = form.value.cityNameQuery;

        if(value) {
            this.searchStarted = true;
            this.cities = this.cityService.loadAutocompletedCities(value);
        }
    }

    // Running adding city on clicking "+" icon
    onAdd(_city: AutocompletedCity) {
        this.cityService.addNewCity(_city);
    }

}