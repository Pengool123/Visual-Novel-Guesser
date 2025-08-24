let VNs = [];
let VNs2 = [];
let VNSuggestList;

let currHintAmount = 0;
let currVN;

let currName;
let ero;
let hasAni;
let currID;
let currLang;
let currRating;
let currVoteCount;
let currLength;
let currTags;
let relations;
let bestQuote;
let currImg;

let inputBox;
let suggestBox;

let tagDiv;
let seriesDiv;
let quoteDiv;
let rankDiv;
let popDiv;
let langDiv;
let animeDiv;
let ageDiv;
let lengthDiv;
let imgArea;
let restButton;

let tagsArr;
let needsSetup = true;

function inputEvent(event){
    let inputValue = inputBox.value;

    //on empty, no suggestions
    if (inputValue !== ""){
        suggFilter();
    }else{
        suggestBox.innerHTML = "";
    }

    //input validator
    if (event !== null && event.key === 'Enter'){
        let topRes = suggestBox.firstChild;
        
        //Does the vn exist + auto correct
        if (topRes !== null){
            inputValue = topRes.innerHTML;
            checkVN(inputValue);

            event.currentTarget.value = "";
            suggestBox.innerHTML = "";
        
        }
        
    }
}

//update the suggestions based on certain events
function suggFilter(){
    suggestBox.innerHTML = "";
    let inputValue = inputBox.value;

    VNs.filter(vn => vn.title.toLowerCase().includes(inputValue.toLowerCase()))
    .slice(0,10) //10 VNs for suggestions
    .forEach(vn =>{
        const li = document.createElement("li");
        li.textContent = vn.title;
        li.onclick = () => {
            inputBox.value = vn.title;
            suggestBox.innerHTML = "";
            suggestBox.appendChild(li);
        }
        suggestBox.appendChild(li);
    });
}

function checkVN(enteredVN){
    if (enteredVN.toLowerCase() === currName.toLowerCase()){
        winnerPov();
    }else{
        getTags(enteredVN);
        getRelation(enteredVN);
        giveHint();
    }
}

function winnerPov(){
    for(let i = currHintAmount; i < 9; i++){
        giveHint();
    }
    restButton.style.visibility = "visible";
    getImg("clear");

    alert("You Won!!1!");
}

function giveHint(){
    switch(currHintAmount){
        //get some tags on screen
        case 0:
            imgArea.src = "img/huh.png";
            getTags(5);
            break;
        //get the languages
        case 1:
            getLangs();
            break;
        //ranking
        case 2:
            getRanking();
            break;
        case 3:
            getPop();
            break;
        //age
        case 4:
            getAge();
            break;
        //has anime
        case 5:
            const ani = document.createElement("p");
            ani.style.fontSize = "3vh";
            ani.textContent = hasAni ? "Has an anime" : "Does not have anime";
            animeDiv.appendChild(ani);
            break;
        //length
        case 6:
            getLength();
            break;
        //quote
        case 7:
            const quo = document.createElement("p");
            let tempSize = bestQuote.length >= 50 ? "2vh" : "4vh";
            quo.style.fontSize = tempSize;
            quo.textContent = bestQuote;
            quoteDiv.appendChild(quo);
            break;
        case 8:
            getImg("low");
            imgArea.src = currImg.url;
            break;
        //lose
        default:
            getImg("clear");
            restButton.style.visibility = "visible";
            alert("You lost :(");
            break;
    }
    currHintAmount++;
}

function getRelation(enteredName){
    if(enteredName === ""){
        if(relations.length === 0){
            const p = document.createElement("p");
            p.textContent = "There are no official visual novels related to this one";
            seriesDiv.appendChild(p);
        }
    }else{
        let enteredVN = VNs.find(vn => vn.title === enteredName);
        if (enteredVN !== undefined){
            let relation = relations.find(rel => (rel.id == enteredVN.id));
            if (relation !== undefined){
                const p = document.createElement("p");
                p.textContent = enteredName;
                let bgColor = "gray";
                switch(relation.relation){
                    //alternative version
                    case "alt":
                        bgColor = "yellow";
                    break;
                    //prequel
                    case "preq":
                        bgColor = "red";
                    break;
                    //sequel
                    case "seq":
                        bgColor = "green";
                    break;
                    //fan disc
                    case "fan":
                        bgColor = "pink";
                    break;
                    //same series
                    case "ser":
                        bgColor = "orange";
                    break;
                    //same settings
                    case "set":
                        bgColor = "purple";
                    break;
                    //side story
                    case "side":
                        bgColor = "blue";
                    break;
                    default:
                    break;
                }
                p.style.border = "1vh solid " + bgColor;
                p.style.borderRadius = "1vh";
                seriesDiv.appendChild(p);
            }
        }
    }
     
}

//for a) not getting dupes and b) overlapping tags
function getTags(obj){
    let maxTag = 0;
    if (typeof(obj) === "number"){
        for (let i = 0; i < obj; i++){
            //15 failed attempts
            if (maxTag >= 15){
                i=obj;
            }
            let ranNumber = Math.floor(Math.random() * currVN.tags.length)
            let tag = currTags[ranNumber];
            
            if(tagsArr.includes(tag)){
                i--;
                maxTag++;
            }else{

                tagsArr.push(tag);
                const p = document.createElement("p");
                p.textContent = tag.name;
                p.style.border = ".5vh solid black";
                let red = ((3-tag.rating) / 1.5 * 255) >= 0 ? ((3-tag.rating) / 1.5 * 255) : 0;
                p.style.borderColor = "rgb("+ red + ", " + ((tag.rating-1.5) / 1.5 * 255) +", 0)";

                tagDiv.appendChild(p);
            }
        }
    }else{ 
        let found = VNs.find(vn => vn.title === obj);
        found.tags.forEach(tag => {
            if(!tagsArr.includes(tag.name) && currTags.find(temp => temp.name === tag.name)){
                tagsArr.push(tag.name);
                const p = document.createElement("p");
                p.textContent = tag.name;
                p.style.border = ".5vh solid black";
                let red = ((3-tag.rating) / 1.5 * 255) >= 0 ? ((3-tag.rating) / 1.5 * 255) : 0;
                p.style.borderColor = "rgb("+ red + ", " + ((tag.rating-1.5) / 1.5 * 255) +", 0)";
                tagDiv.appendChild(p);
            }
        });
    }
}

function getLangs(){
    let andMore = false;
    let chinese = false;
    let flags = "";

    currLang.forEach(language => {
        switch(language){
            case "ja":
                flags += "🇯🇵";
                break;
            case "en":
                flags += "🇬🇧";
                break;
            case "ko":
                flags += "🇰🇷";
                break;
            case "ru":
                flags += "🇷🇺";
                break;
            case "zh-Hans":
                chinese = true;
                break;
            case "zh-Hant":
                chinese = true;
                break;
            case "es":
                flags += "🇪🇸";
                break;
            case "vi":
                flags += "🇻🇳";
                break;
            default:
                andMore = true;
                break;
        }
    });
    if (chinese){
        flags += "🇨🇳";
    }
    if (andMore){
        flags += "➕";
    }
    const p = document.createElement("p");
    p.textContent = flags;
    p.style.fontSize = "3vh";
    langDiv.appendChild(p);
}

function getRanking(){
    const p = document.createElement("p");
    let rankText = "Ranking : ";
    if(currRating > 90){
        rankText += ">9";
    }else if(currRating >= 85){
        rankText += "9 - 8.5";
    }else if(currRating >= 80){
        rankText += "8.4 - 8";
    }else if(currRating >= 75){
        rankText += "7.9 - 7.5";
    }else if(currRating >= 70){
        rankText += "7.4 - 7";
    }else{
        rankText += "<7";
    }
    p.style.fontSize = "4.5vh";
    p.textContent = rankText;
    rankDiv.appendChild(p);
}

function getPop(){
    const p = document.createElement("p");
    p.style.fontSize = "4.5vh";
    let text = "";
    if (currVoteCount >= 10_000){
        text = ">10,000";
    }else if( currVoteCount >= 8_000){
        text = "9,999 - 8,000";
    }else if (currVoteCount >= 6_000){
        text = "7,999 - 6,000";
    }else if (currVoteCount >= 4_000){
        text = "5,999 - 4,000";
    }else if (currVoteCount >= 3_000){
        text = "3,999 - 3,000";
    }else{
        text = "<3,000";
    }
    p.textContent = text;
    popDiv.appendChild(p);
}

function getAge(){
    const p = document.createElement("p");
    let text;
    if(ero){
        text = "Has Ero";
    }else{
        text = "No Ero";
    }
    p.style.fontSize = "4.5vh";
    p.textContent = text;
    ageDiv.appendChild(p);
}

function getLength(){
    const p = document.createElement("p");
    let text;
    switch(currLength){
        case 1:
            text = "Super Short";
            break;
        case 2:
            text = "Short"
            break;
        case 3:
            text = "Medium";
            break;
        case 4:
            text = "Long"
            break;
        case 5:
            text = "Very Long";
            break;
    }
    p.style.fontSize = "4vh";
    p.textContent = text;
    lengthDiv.appendChild(p);
}

function getImg(qual){
    if (qual === null || qual === "low"){
        imgArea.style.filter = "blur(5vh)";
    }else{
        imgArea.style.filter = "none";
        imgArea.onclick = () =>{
            window.open("https://vndb.org/" + currID);
            main();
        };
    }
}

function getVN(){
    let number = Math.floor(Math.random() * VNs.length);
    currVN = VNs[number];
}

//load the json and make objs
async function loadData(){
    const apiUrl = "https://api.vndb.org/kana/vn";
    const reqOptions = {
        "fields": "title, rating, votecount, relations.relation, relations.relation_official, tags.name, tags.rating, tags.category, tags.spoiler, languages, length, image.url, image.sexual",
        "sort": "votecount",
        "reverse": true,
        "results": 100,
        "page": 1
    };

    const resp = await fetch(apiUrl,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions)
    });
    const data1 = await resp.json();
    VNs = data1.results.map(item => {
        const eroCount = item.tags.filter(tag => tag.category === "ero").length;
        const hasEro = eroCount >= 3;

        return {
            id: item.id,
            title: item.title,
            langs: item.languages,
            rating: item.rating,
            votecount: item.votecount,
            length: item.length,
            tags: item.tags.filter(tag =>
                tag.category !== "ero" &&
                tag.category !== "tech" &&
                tag.rating >= 1.5 &&
                tag.spoiler == 0
            ),
            relations: item.relations.filter(rel =>
                rel.relation_official &&
                rel.relation !== "char"
            ),
            img: item.image,
            Ero: hasEro
        };
    });

    //page 2
    const reqOptions2 = {
        "fields": "title, rating, votecount, relations.relation, relations.relation_official, tags.name, tags.rating, tags.category, tags.spoiler, languages, length, image.url, image.sexual",
        "sort": "votecount",
        "reverse": true,
        "results": 100,
        "page": 2
    };

    const resp2 = await fetch(apiUrl,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions2)
    });
    const data2 = await resp2.json();
    VNs2 = data2.results.slice(0, 50).map(item => {
        const eroCount = item.tags.filter(tag => tag.category === "ero").length;
        const hasEro = eroCount >= 3;

        return {
            id: item.id,
            title: item.title,
            langs: item.languages,
            rating: item.rating,
            votecount: item.votecount,
            length: item.length,
            tags: item.tags.filter(tag =>
                tag.category !== "ero" &&
                tag.category !== "tech" &&
                tag.rating >= 1.5 &&
                tag.spoiler == 0
            ),
            relations: item.relations.filter(rel =>
                rel.relation_official &&
                rel.relation !== "char"
            ),
            img: item.image,
            Ero: hasEro
        };
    });
}

async function getExtra(){
    //get a quote if it has one
    const apiUrl = "https://api.vndb.org/kana/quote";
    const reqOptions = {
        "fields": "quote,score",
        "filters": [ "vn", "=", [ "id", "=", currID ] ],
        "sort": "score",
        "reverse": true
    };

    const resp = await fetch(apiUrl,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions)
    });
    const data = await resp.json();
    
    if(data.results.length === 0){
        bestQuote = "No quotes from the visual novel";
    }else{
        bestQuote = data.results[0].quote;
    }

    //anime check
    const apiUrl2 = "https://api.vndb.org/kana/vn";
    const reqOptions2 = {
        "filters": ["and", ["has_anime", "=", "1"], ["id", "=", currID] ]
    };

    const resp2 = await fetch(apiUrl2,{
        method: "POST",
        headers: {
            "Content-Type" : "application/json"
        },
        body: JSON.stringify(reqOptions2)
    });
    const data2 = await resp2.json();
    hasAni = data2.results.length >= 1 ? true : false;

}

//stupid thing to make the json loader not break everything
async function main() {
    if(needsSetup){
        await loadData();
        VNs = VNs.concat(VNs2);
    }
    
    getVN();

    currName = currVN.title;
    currID = currVN.id;
    ero = currVN.Ero;
    currLang = currVN.langs;
    currRating = currVN.rating;
    currVoteCount = currVN.votecount;
    currLength = currVN.length;
    currTags = currVN.tags;
    relations = currVN.relations;
    currImg = currVN.img;
    await getExtra();
    
    if(needsSetup){
        tagDiv = document.querySelector(".Tags");
        seriesDiv = document.querySelector(".Series");
        quoteDiv = document.querySelector(".Quotes");
        rankDiv = document.querySelector(".Ranking");
        popDiv = document.querySelector(".Popularity");
        langDiv = document.querySelector(".Lang");
        animeDiv = document.querySelector(".HasAnime");
        ageDiv = document.querySelector(".AgeRating");
        lengthDiv = document.querySelector(".Length");
        imgArea = document.getElementById("vnPic");

        inputBox = document.getElementById("TextBox");
        suggestBox = document.getElementById("VNsuggestions");
        restButton = document.getElementById("RestartB");
        
        needsSetup = false;
    }else{
        currHintAmount = 0;
        imgArea.src = "img/huh.png";
        imgArea.filter = "none";
        imgArea.onclick = "";

        tagDiv.innerHTML = "";
        seriesDiv.innerHTML = "";
        quoteDiv.innerHTML = "";
        rankDiv.innerHTML = "";
        popDiv.innerHTML = "";
        langDiv.innerHTML = "";
        animeDiv.innerHTML = "";
        ageDiv.innerHTML = "";
        lengthDiv.innerHTML = "";
        imgArea.innerHTML = "";

        restButton.style.visibility = "hidden";
    }
    
    getRelation("");

    tagsArr = [];
    giveHint();

}

main();