import { Component, OnInit } from '@angular/core';

import { Hero } from '../hero';
// we don't have to import HEROES anymore and import HeroService instead
// import { HEROES } from '../mock-heroes';

import { HeroService } from '../hero.service';

//import { MessageService } from '../message.service';

@Component({
  selector: 'app-heroes',
  templateUrl: './heroes.component.html',
  styleUrls: ['./heroes.component.css']
})

export class HeroesComponent implements OnInit {

  // hero: Hero = {
  //   id: 1,
  //   name: 'Windstorm'
  // };

  // heroes = HEROES;
  
  // selectedHero?: Hero; 

  // --->Replace the definition of the heroes property with a declaration
  heroes: Hero[] = [];

  // --->Add a private heroService parameter of type HeroService to the constructor
  constructor(private heroService: HeroService) { }
  // --->The paramter simultaneously defines a private heroService property and identifies it as a HeroService injection site


  // --->getHeroes() method is not a good practice. It certainlty shouldnt call a function that makes HTTP requests to a remote server as a real data service would
  // --->Instead, call getHeroes() inside the ngOnInit lifecycle hook and let Angular call ngOnInit() at an appropriate time after constructing a HeroesComponent intance.
  ngOnInit(): void {
    this.getHeroes();
  }

  // onSelect(hero: Hero): void{
  //   this.selectedHero = hero;
  //   this.messageService.add(`HeroesComponent: Selected hero id=${hero.id}`);
  // }


  // a method is created, to receive or to get the heroes list from the service.
  // -->   this.heroes = this.heroService.getHeroes(); this method used to return Hero[], now it returns an Observable<Hero[]>
  // theory: without Observable, the assignment ,to put array of heroes to the component property, occurs at the same precise time, but
  // it doesnt work in a remote server. so Observable comes to make a role, 
  // Ob. it waits and passes the produced(emitted) array to the callback and it works when Service requests heroes from the server. 
  getHeroes(): void{
    this.heroService.getHeroes()
      .subscribe(heroes => this.heroes = heroes);
  }

  add(name: string): void {
    name = name.trim();
    if (!name) {return; }
    this.heroService.addHero({ name} as Hero)
    .subscribe(hero => {
      this.heroes.push(hero);
    });
  }
  /**
   * when the given name is non-blank, the handler creates a Hero-like object from the name and passes it to the services addHero() method
   * 
   * When addHero() saves successfully, the subscribe() callback receives the new hero and pushes it into the heroes list for display.
   * 
   */

  delete(hero: Hero): void{
    this.heroes = this.heroes.filter(h => h !== hero);
    this.heroService.deleteHero(hero.id).subscribe();
  }
}


/** If you neglect to subscribe(), the service will not send the delete request to the server. As a rule, an Observable does nothing until something subscribes
 */