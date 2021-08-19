import {Game} from './game.model';

export class User {
    public userName: string | null;
    public age: number | null;
    public friends: User[] | null;
    public games: Game[] | null;

    constructor(public email: string, public password: string) {}
}