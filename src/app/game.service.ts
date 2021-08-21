import { Injectable } from "@angular/core";
import { BehaviorSubject } from "rxjs";
import { Game } from "./models/game.model";
import { UserService } from "./user.service";

@Injectable({
    providedIn: 'root'
})
export class GameService {
    dummyGames: Game[] = [
        new Game('Mario Bros', 200, 'A good old classic'),
        new Game('Mario World', 300, 'A good old classic, but better'),
        new Game('Mario World 3D', 500, 'An amazing new addition to the classic collection')
      ];
    private games = new BehaviorSubject<Game[]>(this.dummyGames);
    
    constructor(private usersService: UserService) {}

    getFeaturedGames() {
        return this.games.asObservable();
    }

    getUsersGames(email: string) {
        const user = this.usersService.getUser();
        return user?.games;
    }
}