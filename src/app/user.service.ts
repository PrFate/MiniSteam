import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of, Subject } from "rxjs";
import { tap } from 'rxjs/operators';

import {User, Friend, FriendRequest} from './models/user.model';
import {Game} from './models/game.model';
import { AngularFirestore, CollectionReference, DocumentReference } from "@angular/fire/compat/firestore";
import * as fs from "firebase/compat/app";

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
    //firebase user document reference
    userDocRef: DocumentReference<unknown>;

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
                this.user.id = response.docs[0].id;
                this.$user.next(this.user);
                this.userDocRef = response.docs[0].ref;
            } else {
                this.addUser(email, password);
            }
            this.isUserLoggedIn$.next(true);
        });
        return this.$user;
    }

    addUser(email: string, password: string) {
        const newUser = new User(email, password);
        this.firestore.collection('users')
            .add({
                email,
                password
            })
            .then((docRef) => {
                newUser.id = docRef.id;
                this.user = newUser;
                this.$user.next(this.user);
                //setting docRef
                this.userDocRef = docRef;
            });
    }

    logoutUser() {
        this.isUserLoggedIn$.next(false);
        this.$user.next(undefined);
    }

    getUserStatus() {
        return this.isUserLoggedIn$.asObservable();
    }

    updateUser(email: string, password: string, userName: string, age: number) {
        this.userDocRef.update({
            email,
            password,
            userName,
            age
        }).then(() => {
            this.user = {
                email,
                password,
                userName,
                age,
                id: this.user.id
            } as User;
            this.$user.next(this.user);
        });
    }

    getUser() {
        return this.user;
    }

    getUserAsObs() {
        return this.$user.asObservable();
    }

    //***************************************************** handling friends
    getUsersFriends(): Observable<Friend[] | undefined> {
        this.userDocRef
        .get()
        .then(usr => {
            const friends = (usr.data() as User).friends;
            this.friends$.next(friends);
        });
        return this.friends$.asObservable();
    }

    getConfiguredFriendRequest(ref: CollectionReference<any>) {
            let resultRef = ref.where('email', '!=', this.user.email);
            if (!this.user?.friends) {
                return resultRef;
            }
            const userNames = this.user.friends.map(frnd => frnd.userName);
            console.log('getConfiguredFriendRequest()');
            console.log(userNames);
            if (userNames.length) {
                resultRef = resultRef.where('userName', 'not-in', userNames) as CollectionReference<any>;
            }
            resultRef = resultRef.where(
                'email', 
                'not-in', 
                this.user.friends.map(frnd => frnd.email)
            ) as CollectionReference<any>;
            return resultRef;
    }

    findPotentialFriends(usernameOrEmail: string) {
        // TODO - filter out users, that are already user's friends OR ARE in his outgoing requests
        this.firestore.collection('users',
            ref => this.getConfiguredFriendRequest(ref)
            )
        .snapshotChanges()
        .subscribe(response => {
            // response.forEach(val => console.dir(val.payload.doc.data()));
            const friends = response.map(res => {
                const user: Friend = res.payload.doc.data() as User;
                user.id = res.payload.doc.id;
                const friend: Friend = {
                    email: user.email,
                    userName: user.userName,
                    id: user.id
                }
                return friend;
            });
            this.friends$.next(friends);
        });
        return this.friends$.asObservable();
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
        console.group('addGame()');
        console.dir(game);
        console.groupEnd();
        this.userDocRef
        .get()
        .then(doc => {
            const usr = doc.data() as User;
            if (usr.hasOwnProperty('games')) {
                this.userDocRef
                    .update({
                        games: fs.default.firestore.FieldValue.arrayUnion(game)
                    });
            } else {
                this.userDocRef
                .set({
                    games: [game]
                }, {
                    merge: true
                });
            }
        });
    }

    getUsersGames() {
        this.firestore.collection('users')
        .doc(this.user.id)
        .valueChanges()
        .subscribe(usr => {
            this.user.games = (usr as User).games;
            this.$user.next(this.user);
        });
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