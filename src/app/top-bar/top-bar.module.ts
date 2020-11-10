import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TopBarRoutingModule } from './top-bar-routing.module';

import { TopBarComponent } from './top-bar.component';
import { TopBarHomeComponent } from './top-bar-home/top-bar-home.component';
import { TopBarPrefComponent } from './top-bar-pref/top-bar-pref.component';
import { TopBarSearchComponent } from './top-bar-search/top-bar-search.component';

@NgModule({
  imports: [
    CommonModule,
    TopBarRoutingModule
  ],
  exports: [
    TopBarComponent,
    TopBarHomeComponent,
    TopBarPrefComponent,
    TopBarSearchComponent
  ],
  declarations: [
    TopBarComponent,
    TopBarHomeComponent,
    TopBarPrefComponent,
    TopBarSearchComponent
  ],
  entryComponents: [
    TopBarHomeComponent,
    TopBarPrefComponent,
    TopBarSearchComponent
  ],
  bootstrap: [TopBarComponent]
})
export class TopBarModule { }
