import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
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
    isUserLoggedIn: Observable<boolean> = new BehaviorSubject<boolean>(false);

    login(email: string, password: string) {
        const users = this.users$.getValue();
        users.forEach(userEl => {
            console.table([userEl, {email, password}])
            if (userEl.email === email && userEl.password === password) {
                this.user = userEl;
                this.isUserLoggedIn = new BehaviorSubject<boolean>(true).asObservable();
                return;
            }
        });
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
}