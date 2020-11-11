import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ContentComponent } from './content.component';

import { SavedStateComponent } from './saved-state/saved-state.component';
import { SearchStateComponent } from './search-state/search-state.component';

const routes: Routes = [
  {
    path: 'home',
    component: ContentComponent
  },
  {
    path: 'preferences',
    component: SavedStateComponent
  },
  {
    path: 'search',
    component: SearchStateComponent
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class ContentRoutingModule { }