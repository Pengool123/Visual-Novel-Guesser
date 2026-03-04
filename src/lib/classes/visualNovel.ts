import Tag from './tag';
import Img from './img';
import {Language, Length, Relation} from '../enums';

export interface VisualNovelConfig{
    title?: string;
    relatedTitles?: RelatedVN[];
    connection?: Relation;
    id?: string;
    aliases?: string[];
    rating?: number;
    length?: Length;
    popularity?: number;
    hasEro?: boolean;
    image?: Img;
    languages?: Language[];
    tagList?: Tag[];
    bestQuote?: string;
    hasAnime?: boolean;
}

export class VisualNovel{
    public id: string = 'v1';
    public title: string = '';
    public aliases: string[] = [];
    public relatedTitles: RelatedVN[] = [];
    public rating: number = 0;
    public length: Length = Length.VeryLong;
    public popularity: number = 0;
    public hasEro: boolean = false;
    public image!: Img;
    public languages: Language[] = [];
    public tagList: Map<string, Tag>;
    public bestQuote: string;

    constructor({
        id='v1',
        title='Untitled VN',
        relatedTitles=[],
        aliases=[],
        rating=0,
        popularity=0,
        length=Length.VeryLong,
        hasEro=false,
        image,
        languages=[]
    }: VisualNovelConfig
    ){
        this.id = id;
        this.title = title;
        this.relatedTitles = relatedTitles;
        this.aliases = aliases;
        this.rating = rating;
        this.popularity = popularity;
        this.length = length;
        this.hasEro = hasEro;
        
        if(image){this.image = image}
        else{this.image = new Img({})}
        
        this.languages = languages;
        this.tagList = new Map<string, Tag>();
        this.bestQuote = "";
    }

    insertTag(tag: Tag){
        this.tagList.set(tag.name, tag);
    }

    getTag(tag: Tag): Tag | undefined{
        if(this.tagList.has(tag.name)){
            return this.tagList.get(tag.name);
        }else{
            return undefined;
        }
    }
    
    tagCross(inputted: VisualNovel): Tag[]{
        let tagList: Tag[] = [];
        inputted.tagList.forEach((tag: Tag)=>{
            const grabbedTag = this.getTag(tag);
            if(grabbedTag){
                tagList.push(grabbedTag);
            }
        });
        return tagList;
    }
}

export class RelatedVN{
    id: string = 'v1';
    title: string = '';
    connection: Relation = Relation.Sequel;
    constructor({id='v1', title = 'Untitled VN', connection = Relation.Sequel}: VisualNovelConfig){
        this.id = id;
        this.title = title;
        this.connection = connection;
    }
}