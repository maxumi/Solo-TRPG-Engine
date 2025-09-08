import { Routes } from '@angular/router';
import { SoloManagerComponent } from './solo-manager/solo-manager.component';
import { YesNoComponent } from './solo-manager/components/yes-no/yes-no.component';
import { ElementListComponent } from './solo-manager/components/element-list/element-list.component';
import { RandomEventsComponent } from './solo-manager/components/random-events/random-events.component';

export const routes: Routes = [
  {
    path: '',
    component: SoloManagerComponent,
    children: [
      { path: 'yes-no', component: YesNoComponent },
      { path: 'elements', component: ElementListComponent },
      { path: 'events', component: RandomEventsComponent },
      { path: '', pathMatch: 'full', redirectTo: 'yes-no' }
    ]
  },
  { path: '**', redirectTo: '' }
];