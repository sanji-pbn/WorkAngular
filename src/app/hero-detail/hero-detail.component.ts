import { Component, OnInit, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';

import { Hero } from '../hero';
import { HeroService } from '../hero.service';

@Component({
  selector: 'app-hero-detail',
  templateUrl: './hero-detail.component.html',
  styleUrls: ['./hero-detail.component.css']
})
export class HeroDetailComponent implements OnInit {

  hero: Hero | undefined;
  
  constructor(
    private route: ActivatedRoute,
    private heroService: HeroService,
    private location: Location
  ) { }

  ngOnInit(): void {
    this.getHero();
  }
  
  getHero(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.heroService.getHero(id)
      .subscribe(hero => this.hero = hero);
  }

  goBack(): void{
    this.location.back();
  }

  // add the save() method, which persists hero name changes using the hero service updateHero() method 
  // and navigates back to the previous view
  save(): void {
    if(this.hero){
      this.heroService.updateHero(this.hero)
      .subscribe(() => this.goBack());
    }
  }
}


// The ActivateRoute holds information about the route to this instance of the HeroDetailComponent. 
// This componentis interested in the route's parameters extracted from the URL.

// The HeroService gets hero data from the remote server and this component will use it to get the hero-to-display

// The location is an Angular service for interactin with the browser. 

// The route.snapshot is a static image of the route information shortly after the component was created.
// The paramMap is a dictionary of route parameter values extracted from the URL. "id" key returns the id of the hero to fetch
// Route parameters are always strings. The javascript Number function converts the string to a number, which is what a hero id should be
// The browser refreshes and the application crashes with a compiler error. HeroService doesnot have a getHero(). Add it now