import { Injectable } from "@angular/core";
import { BehaviorSubject, of } from "rxjs";
import { tap } from 'rxjs/operators';

import {User} from './models/user.model';
import {Game} from './models/game.model';

// TODO: replace dummy users object with backend
@Injectable({
    providedIn: 'root'
})
export class UserService {
    dummyUsers: User[] = [
        new User('yoshi@thenetninja.com', 'veryPr0tected;45%', [
            new Game('Mario Bros', 200, 'A good old classic'),
            new Game('Mario World', 300, 'A good old classic, but better')
        ]),
        new User('mario@marioland.com', 'itsAmeMario!', []),
        new User('luigi@underwater.com', 'hereComesALuigi!', [
            new Game('Mario Bros', 200, 'A good old classic')
        ]),
        new User('peach@marioland.com', 'theyDontKnowHowToPswrd', [
            new Game('Mario World', 300, 'A good old classic, but better'),
            new Game('Mario World 3D', 500, 'An amazing new addition to the classic collection')
        ])
    ];
    private readonly users$ = new BehaviorSubject<User[]>(this.dummyUsers);

    user: User;
    isUserLoggedIn$ = new BehaviorSubject<boolean>(false);

    login(email: string, password: string) {
        const users = this.users$.getValue();
        users.forEach(userEl => {
            if (userEl.email === email && userEl.password === password) {
                this.user = userEl;
                this.isUserLoggedIn$.next(true);
                return;
            }
        });
    }

    logoutUser() {
        console.group('logout()');
        console.groupEnd();
    }

    getUserStatus() {
        return this.isUserLoggedIn$.asObservable();
    }

    updateUser$(email: string, password: string, userName: string, age: number) {
        console.dir();
        return of(null)
            .pipe(
                tap(() => {
                    const users = this.users$.getValue().map(user => {
                        if (user.email === email) {
                            return {...user, email, password, userName, age};
                        }
                        return {...user};
                    });
                    this.users$.next(users);
                }),
                tap(() => {console.table(this.users$.getValue())})
                );
        //TODO: use indexed array instead of an ordinary array
    }

    getUser() {
        return this.user;
    }

    getUsersFriends(email: string) {
        console.group('getUsersFriends()');
        console.log(email);
        console.groupEnd();
    }

    addFriend(email: string, friendsUsername: string) {
        console.group('addFriend()');
        console.log(email);
        console.groupEnd();
    }

    addGame(game: Game): void {
        for (let i = 0; i < this.user.games.length; i++) {
            if (game.title === this.user.games[i].title) {
                alert('You have already purchased this game');
                return;
            }
        }
        this.user.games.push(game);
    }

    getUsersGames() {
        return of(this.user.games);
    }
}