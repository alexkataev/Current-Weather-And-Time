import { Component, OnInit, AfterViewInit, ComponentFactoryResolver, 
    ViewChild, ViewContainerRef } from '@angular/core';

import { CityService }  from '../shared/cities/city.service';

import { TemperatureService } from '../shared/temperature.service';

import { TopBarHomeComponent } from './top-bar-home/top-bar-home.component';
import { TopBarPrefComponent } from './top-bar-pref/top-bar-pref.component';
import { TopBarSearchComponent } from './top-bar-search/top-bar-search.component';
import { Router, NavigationEnd } from '@angular/router';

@Component({
selector: 'top-bar',
templateUrl: './top-bar.component.html',
styleUrls: ['./top-bar.component.css']
})

export class TopBarComponent implements OnInit, AfterViewInit {

// Creating container for 3 top-bar states: home, prefs and search
@ViewChild('topBarContainer', { read: ViewContainerRef }) topBarContainer: ViewContainerRef;

constructor(
   private router: Router,

   private resolver: ComponentFactoryResolver,
   public viewContainerRef: ViewContainerRef,
   
   private cityService: CityService,
   private temperatureService: TemperatureService
) {
}

ngOnInit() {

   this.router.events.subscribe(event => {
       if (event instanceof NavigationEnd) {

           this.topBarContainer.clear();

           if(this.router.url === '/home') {
               let factory = this.resolver.resolveComponentFactory(TopBarHomeComponent);
               let componentRef = this.topBarContainer.createComponent(factory);
               componentRef.instance.curTempUnits = this.temperatureService.getCurTemperatureUnits();
               componentRef.instance.isEmpty = this.cityService.isLSEmpty();
           }

           if(this.router.url === '/preferences') {
               let factory = this.resolver.resolveComponentFactory(TopBarPrefComponent);
               this.topBarContainer.createComponent(factory);
           }

           if(this.router.url === '/search') {
               let factory = this.resolver.resolveComponentFactory(TopBarSearchComponent);
               this.topBarContainer.createComponent(factory);
           }
       }
   });
}

ngAfterViewInit() {
}

ngOnDestroy() {
}

}