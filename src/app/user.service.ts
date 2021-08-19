import { Injectable } from "@angular/core";
import {User} from './models/user.model';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    // TODO: replace dummy users object with backend
    public users: User[] = [
        new User('yoshi@thenetninja.com', 'veryPr0tected;45%'),
        new User('mario@marioland.com', 'itsAmeMario!'),
        new User('luigi@underwater.com', 'hereComesALuigi!'),
        new User('peach@marioland.com', 'theyDontKnowHowToPswrd')
    ];

    public user: User | undefined;

    login(email: string, password: string) {
        this.user = this.users.find(user => user.email === email && user.password === password);
    }

    edit(user: User) {
        console.dir(user);
    }

    getUser(email: string) {
        console.log(email);
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