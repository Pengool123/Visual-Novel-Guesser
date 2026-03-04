interface TagsConfig{
    name?: string;
    rating?: number;
    spoiler?: number;
    id?: number;
    ero?: boolean;
}

export default class Tag{
    public name: string = "";
    public rating: number = 0;
    public spoiler: number = 0;
    public id: number = 0;
    public ero: boolean = false;
    constructor({name="", rating=0, spoiler=0, id=0, ero=false}:TagsConfig){
        this.name = name;
        this.rating = rating;
        this.spoiler = spoiler;
        this.ero = ero;
        this.id = id;
    }
}