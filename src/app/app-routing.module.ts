import { NgModule } from '@angular/core';
// so that the application can have routing functionality
import { RouterModule, Routes } from '@angular/router';
// it will give the Router somewhere to go once you configure the routes
import { HeroesComponent } from './heroes/heroes.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { HeroDetailComponent } from './hero-detail/hero-detail.component';

// Routes tell the Router which view to display when a user clicks a link or pastes a URL into the browser address bar
const routes: Routes = [
  // Add a default route
  // When the application starts, the browser's address bar points to the web site's root. That doesnt match any existing route so the router doesn't navigate anywhere.
  // The space below the <router-outlet> is blank.
  { path: '', redirectTo: '/dashboard', pathMatch: 'full'},
  // The route redirects a URL that fully matches the empty path to the route whose path is '/dashboard'
  { path: 'heroes', component: HeroesComponent},
  { path: 'dashboard', component: DashboardComponent},  
  { path: 'detail/:id', component: HeroDetailComponent}
];

@NgModule({
  // the following line adds the RouterModule to the AppRoutingModule imports array and configures it 
  // with the routes in one step by calling RouterModule.forRoot()
  imports: [RouterModule.forRoot(routes)],
  // exports RouterModule, so it will be available throughout the application
  exports: [RouterModule]
})
export class AppRoutingModule { }

// routing: the process of sending information from one computer systerm to anther.

// Properties     Details
// path           A string that matches the URL in the browser address bar.
// component      The component that the router should create when navigating to this route

// The method is called forRoot() because you configure the router at the application's root level.

