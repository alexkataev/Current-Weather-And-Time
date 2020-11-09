import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { RouterModule } from '@angular/router';

import { HttpClientModule } from '@angular/common/http';

import { MaterialModule } from './material.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { TopBarModule } from './top-bar/top-bar.module';
import { ContentModule } from './content/content.module';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,

    RouterModule.forRoot([]),

    HttpClientModule,

    FormsModule,
    ReactiveFormsModule,
    MaterialModule,

    TopBarModule,
    ContentModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
