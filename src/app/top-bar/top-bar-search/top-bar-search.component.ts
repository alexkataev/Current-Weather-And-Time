import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'top-bar-search',
  templateUrl: './top-bar-search.component.html',
  styleUrls: ['../top-bar.component.css', './top-bar-search.component.css']
})

export class TopBarSearchComponent implements OnInit {

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