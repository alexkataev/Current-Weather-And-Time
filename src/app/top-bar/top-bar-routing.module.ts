import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { TopBarComponent } from './top-bar.component';

const routes: Routes = [
  {
    path: 'home',
    component: TopBarComponent
  },

];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class TopBarRoutingModule { }