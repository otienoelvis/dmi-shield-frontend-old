import { Routes } from '@angular/router';

// Pages
import { CompositeComponent } from './composite/composite.component';
import { ModifyComponent } from './modify/modify.component';

export const CasesRoutes: Routes = [
  {
    path: '',
    children: [
      {
        path: 'composite',
        component: CompositeComponent,
      }, {
        path: 'modify',
        component: ModifyComponent,
      }
    ],
  },
];
