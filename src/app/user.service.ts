import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { tap } from 'rxjs/operators';

import {User, Friend, FriendRequest} from './models/user.model';
import {Game} from './models/game.model';
import { AngularFirestore } from "@angular/fire/compat/firestore";
import * as firebase from "firebase/app";

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private readonly users$ = new BehaviorSubject<User[]>([]);

    user: User;
    $user = new Subject<User>();
    isUserLoggedIn$ = new BehaviorSubject<boolean>(false);
    friends$ = new Subject<Friend[]>();
    incomingRequests$ = new Subject<FriendRequest[]>();
    outgoingRequests$ = new Subject<FriendRequest[]>();

    constructor(private firestore: AngularFirestore) {}

    login(email: string, password: string) {
        this.firestore.collection('users', 
        ref => ref
            .where('email', '==', email)
            .where('password', '==', password)
        )
        .get()
        .subscribe(response => {
            if (response.docs.length) {
                this.user = response.docs[0].data() as User;
                this.$user.next(this.user);
            } else {
                this.addUser(email, password);
            }
            this.isUserLoggedIn$.next(true);
        });
        return this.$user;
    }

    addUser(email: string, password: string) {
        const userInfo = {email, password};
        this.firestore.collection('users')
            .add(userInfo).then((docRef) => {
                this.user = {...userInfo, id: docRef.id} as User;
                this.$user.next(this.user);
            });
    }

    logoutUser() {
        this.isUserLoggedIn$.next(false);
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
    }

    getUser() {
        return this.user;
    }

    //***************************************************** handling friends
    getUsersFriends(email: string): Observable<Friend[] | undefined> {
        const users = this.users$.getValue();
        return of(users.find((user: User) => {
            return user.email === email;
        })?.friends);
    }

    findPotentialFriends(usernameOrEmail: string) {
        // TODO - filter out users, that are already user's friends OR ARE in his outgoinng requests
        const users = this.users$
            .getValue()
            .filter(
                (user => user.email.includes(usernameOrEmail) || user.userName.includes(usernameOrEmail))
            );
        if (!users.length) {
            return of(users as Friend[]);
        }

        return of(users as Friend[]);
    }

    sugestFriendship(email: string) {
        console.log(`sugestFriendship(${email})`);
        const newRequest = this.appendReqToPotentialFriend(email);
        console.dir(newRequest);
        this.appendRequestToUser(newRequest);
    }

    private appendReqToPotentialFriend(email: string): FriendRequest {
        console.log(`appendReqToPotentialFriend(${email})`);
        const users = this.users$.getValue();
        let index: number = 0;
        for (let i = 0; i < users.length; i++) {
            if (users[i].email === email) {
                index = i;
                break;
            }
        }
        const newOutgoingRequest = {
            user: {
                email: users[index].email,
                userName: users[index].userName ?  users[index].userName : '',
                id: users[index].id
            },
            status: 'pending'
        };

        const incomingRequest = {
            user: {
                email: this.user.email,
                userName: this.user.userName ?  this.user.userName : '',
                id: this.user.id
            },
            status: 'pending'
        };

        users[index].incomingRequests.push(incomingRequest as FriendRequest);

        this.users$.next(users);
        console.table(this.users$.getValue()[index].incomingRequests);
        return newOutgoingRequest as FriendRequest;
    }

    private appendRequestToUser(request: FriendRequest) {
        console.log(`appendRequestToUser()`);
        console.dir(request);
        this.user.outgoingRequests.push(request);
        this.outgoingRequests$.next(this.user.outgoingRequests);
    }

    getUsersIncomingRequests() {
        this.incomingRequests$.next(
            this.user.incomingRequests
        );
        return this.incomingRequests$.asObservable();
    }

    getUsersOutgoingRequests() {
        this.outgoingRequests$.next(
            this.user.outgoingRequests
        );
        return this.outgoingRequests$.asObservable();
    }

    //deleting user from friend list
    deleteUserFromFriendList(email: string) {
        console.log(`deleteUserFromFriendList(${email})`);
        let userToDeleteIndex = 0;
        for (let i = 0; i < this.user.friends.length; i++) {
            if (this.user.friends[i].email === email) {
                userToDeleteIndex = i;
            }
        }
        this.friends$.next(this.user.friends.splice(userToDeleteIndex, 1));
        console.table(this.user.friends);
    }

    // handling user's games
    addGame(game: Game): void {
        // this.firestore.collection('user').doc(this.user.id)
        // .update({
        //     games: 
        // });
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

    // dummyUser = new User('lui@marioland.com', 'theyDontKnowHowToPswrd1', [
    //     new Game('Mario World', 300, 'A good old classic, but better'),
    //     new Game('Mario World 3D', 500, 'An amazing new addition to the classic collection')
    // ]);
    // dummyUsers: User[] = [
    //     new User('yoshi@thenetninja.com', 'veryPr0tected;45%', [
    //         new Game('Mario Bros', 200, 'A good old classic'),
    //         new Game('Mario World', 300, 'A good old classic, but better')
    //     ],
    //     [
    //         {email: 'luigi@underwater.com', id: '34556jb'},
    //     ],
    //     'Yoshi',
    //     56,
    //     [
    //         {user: this.dummyUser as Friend, status: 'pending'}
    //     ]),
    //     new User('mario@marioland.com', 'itsAmeMario!', []),
    //     new User('luigi@underwater.com', 'hereComesALuigi!', [
    //         new Game('Mario Bros', 200, 'A good old classic')
    //     ],
    //     [
    //         {email: 'yoshi@thenetninja.com', id: '34556jb'},
    //     ],),
    //     new User('peach@marioland.com', 'theyDontKnowHowToPswrd', [
    //         new Game('Mario World', 300, 'A good old classic, but better'),
    //         new Game('Mario World 3D', 500, 'An amazing new addition to the classic collection')
    //     ]),
    //     this.dummyUser
    // ];