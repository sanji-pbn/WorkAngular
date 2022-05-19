import { Injectable } from '@angular/core';

import { Hero } from './hero';   // Get hero data (importing)
// import { HEROES } from './mock-heroes';

// It simulate getting data from the server with RxJs of() function
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
// HttpClient is Angular's mechanism for communicating with a remote server over HTTP
// to catch errors, you "pipe" the observable result from http.get() through an RxJS catchError() operator
import { catchError, map, tap } from 'rxjs/operators';

import { MessageService } from './message.service';


// a provider is something that can create or deliver a service; 
@Injectable({ providedIn: 'root' })

// When you provide the service at the root level, Angular creates a single, shared instance of HeroService and 
// injects into any class that asks for it

export class HeroService {

    // define the heroesUrl of the form :base/:collectionName with the address of the heroes resource
    // on the server. Here base is the resource to which requests are made , and collcetionName is the heroes data object in 
    // the in-memeory-data-service.ts
    private heroesUrl = `api/heroes`;     // URL to web api

   

    // Angular will inject the singleton MessageService into that property when it creates the HeroService
    // inject HttpClient into the constructor in a private property called http
    constructor(
      private messageService: MessageService,
      private http: HttpClient
    ) { }



    // add getHeroes method to return the mock heroes
    // getHeroes() : Hero[]{} is replaced by Observable to get the data from server
    // getHeroes(): Observable<Hero[]> {
    //   // of(HEROES) returns an Observable<Hero[]> that emits a single value, the array of mock heroes
    //   const heroes = of(HEROES);
    //   // to send a message when the heroes are fetched
    //   this.messageService.add('HeroService: fetched heroes');
    //   return heroes;
    // }

    // the getHeroes() uses the RxJS of() function to return an array of mock heroes as an Observable<Hero[]>
    // convert that method to use HttpClient 
    // swapped of() for http.get() and the application keeps working without any other changes because both functions return an Observable<Hero[]>
    
    /**
     * extend the observable result with the pipe() method and give it a catchError() operator
     * the catchError() operator interrcepts an Observable that failed. The operator then passes the error to the error
     * handling function.
     * The following handleError() method reports the error and then returns an innocuous result so that the application
     * keeps working
     */
    getHeroes(): Observable<Hero[]>{
      return this.http.get<Hero[]>(this.heroesUrl)
        .pipe(
          tap( _ => this.log('fetched heroes')),
         catchError(this.handleError<Hero[]>('getHeroes', []))
        );
    }

    /** handleError
     *  Instead of handling the error directly, it returns an error handling function to catchError that it has configured with both
     *  the name of the operation that failed and a safe return value
     */
    /**
     * Handle Http operation that failed
     * Let the app continue
     * 
     * @param operation - name of the operation that failed 
     * @param result - optional value to return as the observable result
     * @returns 
     */

    private handleError<T>(operation = 'operation', result?: T){
      return (error: any): Observable<T> => {

        // TODO: send the error to remote logging infrastructure
        console.error(error); // log to console instead

        // TODO: better job of transforming error for user consumption
        this.log(`${operation} failed: ${error.message}`);

        // Let the app keep running by returning an empty result
        return of(result as T);
      };
    }
    /** After reporting the error to the console, the handler constructs a user friendly message and returns 
     *  a safe value of the application so the application can keep working
     * 
     * Because each service method retuns a different kind of Observable result, handleError() takes a type parameter so it can
     * return the safe value as the type that the application expects.
     * 
     */


    getHeroNo404<Data>(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/?id=${id}`;
      return this.http.get<Hero[]>(url)
      .pipe(
        map(heroes => heroes[0]),
        tap(h => {
          const outcome = h? 'fetched' : 'did not find';
          this.log(`${outcome} hero id=${id}`);
        }),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
    }

    /** Get hero by id
     * most web APIs support a get by id request in the form :baseURL/:id
     * base URL defined in the Heroes and HTTP section (api/heroes) and id  is the n umber of the hero 
     * that yo want to retrieve. Eg: api/heroes/11
    */
    getHero(id: number): Observable<Hero>{
    // For now, assume that a hero with the specified `id` always exists.
    // Error handling will be added in the next step of the tutorial.
      // const hero = HEROES.find(h => h.id === id)!;
      // this.messageService.add(`HeroService: fetched hero id=${id}`);
      // return of(hero);
      const url = `${this.heroesUrl}/${id}`;
      return this.http.get<Hero>(url).pipe(
        tap(_ => this.log(`fetched hero id=${id}`)),
        catchError(this.handleError<Hero>(`getHero id=${id}`))
      );
    }
    /** significant differences of getHero from getHeroes()
     * getHero() constructs a request URL with the desired hero's id
     * the servers should respond with a single hero rather than an array of heroes
     * getHero() reutrns an Obersbable<Hero> rather than an obersvable of hero array
     * 
     */

    
    /** Add HeroService.updateHero()
     * The overall structure of the updateHero() method is similer to that of getHeroes(),
     * but it uses http.put() to persist the changed hero on the server. 
     */
    updateHero(hero: Hero): Observable<any> {
      return this.http.put(this.heroesUrl, hero, this.httpOptions).pipe(
        tap(_ => this.log(`updated hero id=${hero.id}`)),
        catchError(this.handleError<any>('updateHero'))
      );
    }

    /** HttpClient.put() method takes 3 paramter
     * The Url
     * the data to update
     * options
     * The Url is unchanged. The heroes web API knows which hero to update by looking at the hero's id
     * The heroes web API expects a special header in HTTP save requests. That header is in the httpOptions constant defined in the HeroService.
    */

    httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json'})
    };
    /**
     * addHero() differs from updateHero() in two ways
     * it calls HttpClient.post() insted of put()
     * it expects the server to generate an id for the new hero, which it returns in the Obervable<Hero> to the caller
     */
    addHero(hero: Hero): Observable<Hero>{
      return this.http.post<Hero>(this.heroesUrl, hero, this.httpOptions).pipe(
      tap((newHero: Hero) => this.log(`added hero w/ id=${newHero.id}`)),
      catchError(this.handleError<Hero>('addHero'))
      );
    }

    deleteHero(id: number): Observable<Hero> {
      const url = `${this.heroesUrl}/${id}`;

      return this.http.delete<Hero>(url, this.httpOptions).pipe(
        tap(_ => this.log(`deleted hero id=${id}`)),
        catchError(this.handleError<Hero>('deleteHero'))
      )
    }
    /** Notice the following key points:
     * 
     * deleteHero() calls HttpClient.delete()
     * The URL is the heroes resource URL plus the id of the hero to delete
     * you dont send data as you did with put() and post()
     * you still send the httpOptions
     */

    /* GET heroes whose name contains search item */
    searchHeroes(term: string): Observable<Hero[]> {

      if(!term.trim()){
        // if not search item, return empty hero array
        return of([]);
      }
      return this.http.get<Hero[]>(`${this.heroesUrl}/?name=${term}`).pipe(
        tap(x => x.length ?
          this.log(`found heroes matching "${term}"`) :
          this.log(`no heroes matching "${term}"`)),
        catchError(this.handleError<Hero[]>('searchHeroes', []))
      );
    }

   

    // Notice that you keep injectin the MessageService but since you'll call it so frequently, wrap it in a private log() method
    /** Log a HeroService message with the MessageService */
    private log(message : string) {
      this.messageService.add(`HeroService: ${message}`);
    }
}


/** HttpClient methods return one value
 * Http is a request/response protocol. User make a request, it returns a single response.
 * HttpClient.get() call returns an Observable<Hero[]>; that is, "an observable of hero arrays". In practice, it will only return a single hero array
 */

/** HttpClient.get() returns response data
 *  It returns the body of the response as an untyped JSON object by default. Applying the optional type specifier, <Hero[]>, adds TypeScript capabilities,
 *  which reduce errors during compile time.
 *  The server'data API determines the shape of the JSON data. The Tour of Heroes data API returns the hero data as an array
 */

/** Tap into the Observable
 * The HeroService methods will tap into the flow of observable values and send a message, using the log() method,
 * to the message area at the bottom of the page.
 * 
 * They will do that with the RxJS tap() operator, which looks at the observable values, does something with those values, and passes them along. The tap()
 * call back doesnot touch the values themselves.
 */