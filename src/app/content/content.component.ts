import { Component, OnInit, AfterViewInit, ComponentFactoryResolver, 
    ViewChild, ViewContainerRef } from '@angular/core';

import { Router, NavigationEnd } from '@angular/router';

import { CityService }  from '../shared/cities/city.service';
import { TemperatureService } from '../shared/temperature.service';

import { MainStateComponent } from './main-state/main-state.component';
import { InitStateComponent } from './init-state/init-state.component';
import { SavedStateComponent } from './saved-state/saved-state.component';
import { SearchStateComponent } from './search-state/search-state.component';

@Component({
selector: 'content',
templateUrl: './content.component.html',
styleUrls: ['./content.component.css']
})

export class ContentComponent implements OnInit, AfterViewInit {

    @ViewChild('contentContainer', { read: ViewContainerRef }) contentContainer: ViewContainerRef;

    constructor(
        private resolver: ComponentFactoryResolver,
        public viewContainerRef: ViewContainerRef,
        private cityService: CityService,
        private router: Router,
        private temperatureService: TemperatureService
    ) {
    }

    ngOnInit() {
        
        this.router.events.subscribe(event => {

            if (event instanceof NavigationEnd) {

                if(this.router.url === '/home') {

                    this.contentContainer.clear();

                    if (this.cityService.isLSEmpty() === true) {
                        let factory = this.resolver.resolveComponentFactory(InitStateComponent);
                        this.contentContainer.createComponent(factory);
                    } else {
                        let factory = this.resolver.resolveComponentFactory(MainStateComponent);
                        let componentRef = this.contentContainer.createComponent(factory);
                        componentRef.instance.curTempUnits = this.temperatureService.getCurTemperatureUnits();
                    }
                }

                if(this.router.url === '/preferences') {
                    this.contentContainer.clear();
                    let factory = this.resolver.resolveComponentFactory(SavedStateComponent);
                    this.contentContainer.createComponent(factory);
                }

                if(this.router.url === '/search') {
                    this.contentContainer.clear();
                    let factory = this.resolver.resolveComponentFactory(SearchStateComponent);
                    this.contentContainer.createComponent(factory);
                }
            }
        });

    }

    ngAfterViewInit() {
    }

    ngOnDestroy() {
    }

}