import {Game} from './game.model';

export class User {
    constructor(public email: string, 
                public password: string, 
                public games: Game[] = [],
                public userName: string = '',
                public age: number | null = null,
                public friends: User[] = [],
                public id: string = '_' + Math.random().toString(36).substr(2, 9)) {}
}