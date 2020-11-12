import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MaterialModule } from '../material.module';

import { HttpClientModule } from '@angular/common/http';

import { ContentRoutingModule } from './content-routing.module';

import { ContentComponent } from './content.component';

import { MainStateComponent } from './main-state/main-state.component';
import { InitStateComponent } from './init-state/init-state.component';
import { SavedStateComponent } from './saved-state/saved-state.component';
import { SearchStateComponent } from './search-state/search-state.component';


@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    MaterialModule,
    CommonModule,
    
    ContentRoutingModule
  ],
  exports: [
    ContentComponent,

    MainStateComponent,
    InitStateComponent,
    SavedStateComponent,
    SearchStateComponent
  ],
  declarations: [
    ContentComponent,
    
    MainStateComponent,
    InitStateComponent,
    SavedStateComponent,
    SearchStateComponent
  ],
  entryComponents: [
    MainStateComponent,
    InitStateComponent
  ],
  bootstrap: [ContentComponent]
})
export class ContentModule { }
