export class Game {
    constructor(public title: string, 
                public price: number, 
                public subheading: string,
                public description: string = '',
                public tags: string[] = [],
                public id: string = '' + Math.random().toString(36).substr(2, 9)) {}
}