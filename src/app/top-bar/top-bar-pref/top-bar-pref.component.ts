import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'top-bar-pref',
  templateUrl: './top-bar-pref.component.html',
  styleUrls: ['../top-bar.component.css', './top-bar-pref.component.css']
})

export class TopBarPrefComponent implements OnInit {

  constructor(
    router: Router,
    private location: Location
  ) {
  }

  ngOnInit() {
  }

  goBack() {
    this.location.back();
  }
}