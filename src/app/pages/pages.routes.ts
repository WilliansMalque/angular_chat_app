import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';



const pagesRoutes: Routes = [
  {
    path: '', children: [
      { path: 'home/:id', component: HomeComponent },
      { path: 'home', component: HomeComponent },
      { path: '', redirectTo: '/home', pathMatch: 'full'},
    ]

  },

];

export const PAGES_ROUTES = RouterModule.forChild( pagesRoutes );
