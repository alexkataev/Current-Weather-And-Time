import { Component, OnInit, Input } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import {CdkDragDrop, moveItemInArray} from '@angular/cdk/drag-drop';

import { CityService }  from '../../shared/cities/city.service';
import { City } from '../../shared/cities/city';


@Component({
  selector: 'saved-state',
  templateUrl: './saved-state.component.html',
  styleUrls: ['./saved-state.component.css']
})

export class SavedStateComponent implements OnInit {
    
    cities$: Observable<City[]>;

    @Input() isEmpty: boolean;

    constructor(
        private cityService: CityService
    ) {
    }

    ngOnInit() {

        // get saved cities only if they exist
        this.isEmpty = this.cityService.isLSEmpty();
        if( !this.isEmpty ) {
            this.cities$ = this.cityService.getSaved();
        }
    }

    // Drag and drop (reordering items in the saved cities list)
    drop(event: CdkDragDrop<string[]>) {
        
        moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);

        this.cities$.pipe(
            map(data => JSON.stringify(data))
        ).subscribe(data => {
            localStorage.setItem('cities', data);
        });
    }

    // Running removing city by ID
    removeCity(id: string) {

        // removing city from localStorage
        this.cityService.removeCityByID(id);

        // removing DOM element
        document.getElementById(id).remove();
    }

}