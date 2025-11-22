import { VNList } from "./startUp";
import { Relation, Language} from "./enums";
import { RelatedVN, VisualNovel } from "./classes/visualNovel";
import { writable, get } from "svelte/store";
import { getCookie } from "./cookie";
import Tag from "./Tag.svelte";
import { tagOverlap } from "./VisualNovelDisplay.svelte";
import { resetInputted } from "./HintInput.svelte";

//for VisualNovelDisplay
export const currVN = writable<VisualNovel>();
export const hintAmount = writable<number>(0);
export const langFlags = writable<string>("");
export const popRange = writable<string>("");
export const rankRange = writable<string>("");
export const hasAni = writable<boolean>(false);
export const tagList = writable<Tag[]>([]);
export const relatedList = writable<string[][]>(new Array(Object.keys(Relation).length/2).fill([]));

export const maxHints = writable(7);

const quoteApiUrl = "https://api.vndb.org/kana/quote";
const aniApiUrl = "https://api.vndb.org/kana/vn";

export function reset(){
    
    let found = false;
    const eroAllowed = getCookie("eroVN");
    let rand: number = 0;
    if(VNList !== undefined){
        while(!found){
            rand = Math.floor(Math.random() * VNList.length);
            if(!eroAllowed && !VNList[rand].hasEro){found = true;}
            if(eroAllowed){found = true;}
        }
        resetInputted();
        currVN.set(VNList[rand]);
        console.log(get(currVN));

        getMisc();
        hintAmount.set(0);
        relatedList.set(new Array(Object.keys(Relation).length/2).fill([]));
    }
}

export function relationCheck(vn: VisualNovel){
    const inputtedName = vn.title;
    get(currVN).relatedTitles.forEach((relVN:RelatedVN) => {
        if(inputtedName === relVN.title){
            relatedList.update(arr => {
                const newArr = [...arr];
                const row = [...newArr[relVN.connection] || []];
                row.push(inputtedName);
                newArr[relVN.connection] = row;
                return newArr;
            });
        }
    });
}

export function hintUpdate(){
    hintAmount.update((n:number) => n+1);
    if(get(hintAmount) >= get(maxHints)){
        showRest();
        alert("you lost :(");
    }
}

export function win(){
    showRest();
    alert("YOU WON!!1!");
}

//show the remaining facts/hints that aren't tied in VisualNovelDisplay.svelte
function showRest(){
    hintAmount.set(get(maxHints));
    get(currVN).relatedTitles.forEach((relVN:RelatedVN)=>{
        console.log(relVN);
        if(!get(relatedList)[relVN.connection].includes(relVN.title)){
            relatedList.update((arr) => {
                const newArr = [...arr];
                const row = [...arr[relVN.connection] || []];
                row.push(relVN.title);
                newArr[relVN.connection] = row;
                return newArr;
            });
        }
    });

    tagOverlap(get(currVN));
}

//calls api so it'll only be done to curr vn to save time
async function getMisc(){
    //has quote? -> get best quote
    const reqOptions = {
        "fields": "quote,score",
        "filters": [ "vn", "=", [ "id", "=", get(currVN).id ] ],
        "sort": "score",
        "reverse": true
    };

    const resp = await fetch(quoteApiUrl,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions)
    });

    if (!resp){
        throw new Error("Error in quotes");
    }

    const data = await resp.json();

    get(currVN).bestQuote = data.results.length > 0 ?
    data.results[0].quote : "No quotes from the visual novel";

    //has anime
    const reqOptions2 = {
        "filters": ["and", ["has_anime", "=", "1"], ["id", "=", get(currVN).id] ]
    };

    const resp2 = await fetch(aniApiUrl,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions2)
    });

    if (!resp2){
        throw new Error("Error in has anime");
    }
    
    const data2 = await resp2.json();
    
    hasAni.set(data2.results.length >= 1 ? true : false);

    let tempLangFlags = "";
    //would do for each but it wont be in order
    if(get(currVN).languages.includes(Language.Eng)){
        tempLangFlags += "🇺🇸";
    }
    if(get(currVN).languages.includes(Language.JP)){
        tempLangFlags += "🇯🇵";
    }
    if(get(currVN).languages.includes(Language.CN)){
        tempLangFlags += "🇨🇳";
    }
    if(get(currVN).languages.includes(Language.KR)){
        tempLangFlags += "🇰🇷";
    }
    if(get(currVN).languages.includes(Language.Spanish)){
        tempLangFlags += "🇪🇸";
    }
    if(get(currVN).languages.includes(Language.Other)){
        tempLangFlags += "➕";
    }
    console.log(tempLangFlags);
    langFlags.set(tempLangFlags);

    popRange.update(() => {
        let range: string = "";
        const vnPop: number = get(currVN).popularity;
        if(vnPop >= 9000 || vnPop <= 2000){
            range = vnPop >= 9000 ? "≥9,000" : "≤2,000";
        }else{
            let lowerBound: number = parseInt((vnPop/1000).toString(), 10);

            //if it's dead x000 on it'll just do the lower bound txt
            //x000's to x499
            if(vnPop >= lowerBound){
                range = `${lowerBound},000 - ${lowerBound},499 ratings`;
            }else{ //x500 to (x+1)000
                range = `${lowerBound},500 - ${lowerBound+1},000 ratings`;
            }
        }

        return range;
    });
    
    rankRange.update(() => {
        let range: string = "";
        let vnRank: number = get(currVN).rating;
        let rounded: number = Math.round(vnRank);

        //lower half
        if(vnRank >= rounded){
            range = `${rounded.toFixed(2)} - ${rounded + .49}`;
        }else{ //upper half
            range = `${(rounded - .5).toFixed(2)} - ${(rounded).toFixed(2)}`;
        }
        console.log(range);

        return range;
    })

}