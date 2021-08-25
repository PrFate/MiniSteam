import { Injectable } from "@angular/core";
import { BehaviorSubject, of, Subject } from "rxjs";
import { first, map } from "rxjs/operators";
import { Game } from "./models/game.model";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    // TODO - replace dummy games with firebase backend
    dummyGames: Game[] = [
        new Game('Mario Bros', 200, 'A good old classic that absolutelu, positevely, ultimately everyone adores',
         'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit.', 
         ['action']),
        new Game('Mario World', 300, 'A good old classic, but better',
         'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam.', 
         ['action', 'adventure']),
        new Game('Mario World 3D', 500, 'An amazing new addition to the classic collection', 'Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam. Lorem ipsum dolor sit amet, consectetur adipisicing elit. Eos eligendi explicabo quidem, veritatis consectetur est beatae dicta provident eveniet quo quos, culpa molestias aliquam autem facere enim quisquam earum ipsam.', ['indie'])
      ];
    private games$ = new BehaviorSubject<Game[]>(this.dummyGames);
    
    constructor(private usersService: UserService) {}

    getFeaturedGames() {
        return this.games$.asObservable();
    }

    searchForGames(name: string = '', tags: string[] = [], price: number = 0) {
        this.games$.next(this.dummyGames.filter(game => {
            return game.title.includes(name) && tags.every(tag => game.tags.includes(tag)) && game.price >= price
        }));
        return this.games$.asObservable();
    }

    getUsersGames(email: string) {
        const user = this.usersService.getUser();
        return user?.games;
    }

    getGameById(gameId: string) {
        return this.games$.pipe(
            map((games: Game[]) => games.find((game: Game) => game.id === gameId)),
            first()
        );
    }
}