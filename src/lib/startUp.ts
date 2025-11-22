import { VisualNovel, RelatedVN } from './classes/visualNovel';
import { Language, Length, Relation } from './enums';
import {reset} from './gameMech';
import { getCookie, setCookie } from './cookie';
import Tag from './classes/tag';
import Img from './classes/img';

const apiUrl: string = "https://api.vndb.org/kana/vn";

//for making related VN's more optimized
//map id to vn
export let VNMap = new Map<string, VisualNovel>();

//for auto-complete
export let VNList: VisualNovel[] = [];

function itemToVN(item:any){
    //jank way of getting if it has ero or not
        const aliasList: string[] = [];
        const relatedList: RelatedVN[] = [];
        const languageList : Language[] = [];

        const img: Img = new Img({
            imgUrl: item.image.url,
            imgS: item.image.sexual,
            imgV: item.image.violence
        });

        //get all aliases
        item.titles.map((titles:any) => {
            if(!item.titles.includes(titles)){
                aliasList.push(titles.title);
            }
        });
        
        item.aliases.forEach((alias:string) => {
            if(!item.titles.includes(alias)){
                aliasList.push(alias);
            }
        });

        //initial map of relations
        item.relations.forEach((vn:any) => {
            if(vn.relation_official === true
                && vn.relation != "char"){
                
                let relStatus: Relation = Relation.Sequel;
                switch(vn.relation){
                    case "alt":
                        relStatus = Relation.Alternative;
                        break;
                    case "preq":
                        relStatus = Relation.Prequel;
                        break;
                    case "seq":
                        relStatus = Relation.Sequel;
                        break;
                    case "fan":
                        relStatus = Relation.FanDisc;
                        break;
                    case "ser":
                        relStatus = Relation.SameSeries;
                        break;
                    case "set":
                        relStatus = Relation.SameSetting;
                        break;
                    case "side":
                        relStatus = Relation.SideStory;
                        break;
                    case "orig":
                        relStatus = Relation.Original;
                        break;
                    case "par":
                        relStatus = Relation.Parent;
                        break;
                }

                const visualNovel = new RelatedVN({
                    id: vn.id,
                    connection: relStatus
                });

                relatedList.push(visualNovel);
            }
        });

        //languages
        item.languages.forEach((lang:any) => {
            switch(lang){
                case "en":
                    languageList.push(Language.Eng);
                    break;
                case "es":
                    languageList.push(Language.Spanish);
                    break;
                case "ja":
                    languageList.push(Language.JP);
                    break;
                case "ko":
                    languageList.push(Language.KR);
                    break;
                case "zh-Hans":
                case "zh-Hant":
                    if(languageList.indexOf(Language.CN) === -1){languageList.push(Language.CN);}
                    break;
                default:
                    if(languageList.indexOf(Language.Other) === -1){languageList.push(Language.Other);}
                    break;
            }
        });

        //length
        let length: Length = item.length-1;

        const vn: VisualNovel = new VisualNovel({
                id: item.id,
                title: item.title,
                aliases: aliasList,
                relatedTitles: relatedList,
                rating: item.rating / 10,
                popularity: item.votecount,
                length: length,
                image: img,
                languages: languageList
            });
        
        //tags
        let eroCount: number = 0;
        const spoilerCap:number = getCookie("showSpoil") as number ?? 0;
        const eroTag: boolean = getCookie("eroTag") as boolean ?? false ;
        item.tags.forEach((tag:any) => {
            if(tag.category !== "tech"
               && tag.spoiler <= spoilerCap
               && (tag.category === "ero" ? eroTag : true)){

                const tempTag = new Tag({
                    name: tag.name,
                    ero: tag.category==="ero",
                    spoiler: tag.spoiler,
                    id: tag.id,
                    rating: (tag.rating).toFixed(1)
                });
                
                if(tempTag.rating >= 1){
                    vn.insertTag(tempTag);
                }
            }
            if(tag.category === "ero"){eroCount++;}
        });
        vn.hasEro = eroCount >= 5;
        
        VNMap.set(item.id, vn);
        return vn;
}

export async function StartUp(){
    VNMap = new Map<string, VisualNovel>();
    let VNTemp1: VisualNovel[] = [];
    let VNTemp2: VisualNovel[] = [];
    cookieSetUp();

    const reqOptions = {
        "fields": "title, titles.title, aliases, rating, votecount, relations.relation, relations.relation_official, tags.name, tags.rating, tags.category, tags.spoiler, languages, length, image.url, image.sexual, image.violence",
        "sort": "votecount",
        "reverse": true,
        "results": 100,
        "page": 1
    };

    
    const reqOptions2 = {
        "fields": "title, titles.title, aliases, rating, votecount, relations.relation, relations.relation_official, tags.name, tags.rating, tags.category, tags.spoiler, languages, length, image.url, image.sexual, image.violence",
        "sort": "votecount",
        "reverse": true,
        "results": 100,
        "page": 2
    };
    

    let response = await fetch(apiUrl,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions)
    });
    
    if(!response){
        throw new Error('Error in resp 1');
    }
    
    let response2 = await fetch(apiUrl,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions2)
    });
    

    if(!response){
        throw new Error('Error in resp 2');
    }

    const data = await response.json();
    const data2 = await response2.json();

    //simply make the list first before getting all relations
    VNTemp1 = data.results.map((item: any) => {
        return itemToVN(item);
    });

    
    VNTemp2 = data2.results.map((item:any)=>{
        return itemToVN(item);
    });
    
    VNList = VNTemp1.concat(VNTemp2);
    //get all relationships
    for (let i = 0; i < VNList.length; i++){
        let mainVN: VisualNovel = VNList[i];
        let relVNList: RelatedVN[] = mainVN.relatedTitles;
        if(relVNList.length !== 0){
            let j = 0;

            //pseudo stack / new list
            let newRelVNList: RelatedVN[] = [];

            //only get it if it's in the top 200
            relVNList.forEach((vn:RelatedVN)=>{
                let vnFull = VNMap.get(vn.id);
                if(vnFull !== undefined){
                    newRelVNList.push(new RelatedVN({
                        title: vnFull?.title,
                        id: vn.id,
                        connection: vn.connection
                    }));
                }
            });

            while(j < newRelVNList.length){
                //get the VN from the related list, go through its relations
                const tempVN: any = VNMap.get(newRelVNList[j].id);

                //exists in the top 200
                if(tempVN !== undefined){
                    //prequels get more prequels
                    if(newRelVNList[j].connection === Relation.Prequel){
                        tempVN.relatedTitles.forEach((relVn:RelatedVN) => {
                            const temp:any = VNMap.get(relVn.id);
                            if(relVn.connection === Relation.Prequel && newRelVNList.indexOf(relVn) === -1 && temp !== undefined){
                                newRelVNList.push(new RelatedVN({
                                    title: temp.title,
                                    id: temp.id,
                                    connection: Relation.Prequel
                                }))
                            }
                        });
                    }
                    //sequels get more sequels
                    if(newRelVNList[j].connection === Relation.Sequel){
                        tempVN.relatedTitles.forEach((relVn:RelatedVN) => {
                            const temp:any = VNMap.get(relVn.id);
                            if(relVn.connection === Relation.Sequel && newRelVNList.indexOf(relVn) === -1 && temp !== undefined){
                                newRelVNList.push(new RelatedVN({
                                    title: temp.title,
                                    id: temp.id,
                                    connection: Relation.Sequel
                                }))
                            }
                        });
                    }
                }
                j++;
            }
            mainVN.relatedTitles = newRelVNList;
        }
    }
    
    reset();
    //clean up
    VNMap.clear();
    response = null as any;
    response2 = null as any;
    
    console.log(VNList);
}

//checks if the user has the cookies, if not then feed them yummy cookies
function cookieSetUp(){
    if(getCookie("eroVN") === undefined){
        setCookie("eroVN", true);
    }
    if(getCookie("eroTag") === undefined){
        setCookie("eroTag", false);
    }
    if(getCookie("showSpoil") === undefined){
        setCookie("showSpoil", 0);
    }
    if(getCookie("hImgLvl") === undefined){
        setCookie("hImgLvl", 0);
    }
    if(getCookie("vImgLvl") === undefined){
        setCookie("vImgLvl", 0);
    }
    if(getCookie("skin") === undefined){
        setCookie("skin", 1);
    }
}