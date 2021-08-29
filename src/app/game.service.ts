import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { first, map } from "rxjs/operators";
import { Game } from "./models/game.model";
import { UserService } from "./user.service";
import { AngularFirestore, CollectionReference } from '@angular/fire/compat/firestore';

@Injectable({
    providedIn: 'root'
})
export class GameService {

    private games: Game[] = [];

    private games$ = new BehaviorSubject<Game[]>([]);
    // for saving first doc in snapshot of items received
    firstInResponse: any = [];
    // for saving last doc in snapshot of items received
    lastInResponse: any = [];
    // for keeping the array of first docs of previous pages
    prev_start_at: any = [];
    // for maintaining the count of clicks on next prev btn
    pagination_click_count = 0;
    // disable next and prev btns
    private disable_next = new BehaviorSubject<boolean>(false);
    private disable_prev = new BehaviorSubject<boolean>(true);
    
    constructor(
        private usersService: UserService,
        private firestore: AngularFirestore
        ) {}

    getNextBtnState() {
      return this.disable_next.asObservable();
    }

    getPrevBtnState() {
      return this.disable_prev.asObservable();
    }

    getFeaturedGames() {
      return this.searchForGames();
    }

    getConfiguredQueryCallback(ref: CollectionReference<any>, name: string = '', tags: string[] = [], price: number = 0) {
      let finalColRef = ref;
      if (name) {
        finalColRef = finalColRef.where('title', '==', name) as CollectionReference<any>;
      }
      if (tags.length) {
        finalColRef = finalColRef.where('tags', 'array-contains-any', tags) as CollectionReference<any>;
      }
      if (price) {
        finalColRef = finalColRef.where('price', '>=', price) as CollectionReference<any>;
      }
      finalColRef = finalColRef.limit(6) as CollectionReference<any>;
      return finalColRef;
    }

    prevPage(name: string = '', tags: string[] = [], price: number = 0) {
      console.log(`prevPage(price: ${price})`);
        if (this.prev_start_at.length === 1) {
          this.searchForGames();
          this.disable_prev.next(true);
          return;
        }
        this.games = [];
        this.disable_prev.next(true);
        this.firestore.collection('games', ref => this.getConfiguredQueryCallback(ref, name, tags, price)
          .startAt(this.get_prev_startAt())
          .endBefore(this.firstInResponse)
        ).get()
          .subscribe(response => {
            this.firstInResponse = response.docs[0];
            this.lastInResponse = response.docs[response.docs.length - 1];
            
            for (let item of response.docs) {
                const gameData: Object = item.data() as Object;
                const game = {
                    ...gameData,
                    id: item.id
                }
              this.games.push(game as Game);
            }
            //Maintaing page no.
            this.pagination_click_count--;
    
            //Pop not required value in array
            // this.pop_prev_startAt(this.firstInResponse);
            this.prev_start_at.pop();
    
            //Enable buttons again
            this.disable_prev.next(false);
            this.disable_next.next(false);
            this.games$.next(this.games);
          }, error => {
            alert(error.message);
            this.disable_prev.next(true);
          });
      }

    nextPage(name: string = '', tags: string[] = [], price: number = 0) {
      console.log(`nextPage(price: ${price})`);
      if (this.games.length < 6) {
        return;
      }
        this.games = [];
        this.disable_next.next(true);
        this.firestore.collection('games', ref => this.getConfiguredQueryCallback(ref, name, tags, price)
          .startAfter(this.lastInResponse)
        ).get()
          .subscribe(response => {
    
            if (!response.docs.length) {
              this.disable_next.next(true);
              return;
            }
    
            this.firstInResponse = response.docs[0];
    
            this.lastInResponse = response.docs[response.docs.length - 1];
            for (let item of response.docs) {
              this.games.push(item.data() as Game);
            }
    
            this.pagination_click_count++;
    
            this.push_prev_startAt(this.firstInResponse);
    
            this.disable_next.next(false);
            this.disable_prev.next(false);
            this.games$.next(this.games);
          }, error => {
            alert(error.message);
            this.disable_next.next(true);
          });
      }

    //Add document
    // TODO - replace "any" with a proper type
    push_prev_startAt(prev_first_doc: any) {
        this.prev_start_at.push(prev_first_doc);
    }

        //Remove not required document 
    pop_prev_startAt(prev_first_doc: any) {
        this.prev_start_at.forEach((element: any) => {
        if (prev_first_doc.data().id == element.data().id) {
            element = null;
        }
        });
    }

      //Return the Doc rem where previous page will startAt
    get_prev_startAt() {
        if (this.prev_start_at.length > (this.pagination_click_count + 1)) {
            this.prev_start_at.splice(this.prev_start_at.length - 2, this.prev_start_at.length - 1);
        }
        return this.prev_start_at[this.pagination_click_count - 1];
    }

    searchForGames(name: string = '', tags: string[] = [], price: number = 0) {
      this.games = [];
      this.firestore.collection('games', ref => this.getConfiguredQueryCallback(ref, name, tags, price)
      ).snapshotChanges()
      .subscribe(response => {
        if (!response.length) {
          alert("No Data Available");
          return;
        }
        this.firstInResponse = response[0].payload.doc;
        this.lastInResponse = response[response.length - 1].payload.doc;

        // Initialize values
        this.prev_start_at = [];
        this.pagination_click_count = 0;
        this.games = [];
        for (let item of response) {
            const gameData = item.payload.doc.data() as Object;
            const game = {
              ...gameData,
              id: item.payload.doc.id
            }
          this.games.push(game as Game);
        }

        //Push first item to use for Previous action
        this.push_prev_startAt(this.firstInResponse);
        this.games$.next(this.games);
      }, error => {
        alert('Could not find any games');
      });
      return this.games$.asObservable();
    }

    getUsersGames() {
        const user = this.usersService.getUser();
        return user?.games;
    }

    getGameById(gameId: string) {
        return this.firestore.collection('games').doc(gameId).get().pipe(
            map(doc => doc.data() as Game)
        );
    }
}
