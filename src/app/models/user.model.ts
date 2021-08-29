import {Game} from './game.model';

type RequestStatus = 'pending' | 'declined' | 'accepted';

export interface Friend {
    email: string,
    userName?: string,
    id: string
}

export interface FriendRequest {
    user: Friend,
    status: RequestStatus
}

export class User {
    constructor(public email: string, 
                public password: string, 
                public games: Game[] = [],
                public friends: Friend[] = [],
                public userName: string = '',
                public age: number | null = null,
                public incomingRequests: FriendRequest[] = [],
                public outgoingRequests: FriendRequest[] = [],
                public id: string = '' + Math.random().toString(36).substr(2, 9)) {}
}