<script context="module" lang="ts">
    import {onMount, createEventDispatcher} from 'svelte';
    import {get} from 'svelte/store';
    import {currVN, hintUpdate, hintAmount, maxHints, win, relationCheck} from './gameMech';
    import {VNList} from './startUp';
    import {getCookie} from './cookie';
    import VNDisplay, { tagOverlap } from './VisualNovelDisplay.svelte';

    let hintNumber = 0;
    let tempInput: string = "";
    let recList: string[] = [];
    let inputted: string[] = [];

    let timer;

    let searchBar: HTMLDivElement;
    let sugBox: HTMLDivElement;
    let eroAllowed = true;

    export function resetHintInput(){
        eroAllowed = getCookie("eroVN");
        inputted = [];
    }

    export let inputValue: string;
    const placeholder: string = "Enter Visual Novel Here";
    
    //auto complete
    timer = setInterval(() => {
        if(sugBox){
            if(inputValue !== undefined
            && inputValue !== ""
            && inputValue !== tempInput
            && VNList !== undefined
            && VNList.length > 0){
                sugBox.innerHTML = "";

                recList = VNList.filter((vn:VisualNovel) => {
                    const aliasMatch: boolean = vn.aliases.some(alias =>
                    alias.toLowerCase().includes(inputValue.toLowerCase()))
                    || vn.title.toLowerCase().includes(inputValue.toLowerCase());
                    
                    if(!eroAllowed){
                        return aliasMatch && !vn.hasEro;
                    }
                    return aliasMatch
                })
                .slice(0,10);

                recList.forEach((vn:VisualNovel) => {
                    const p = document.createElement("p");
                    p.textContent = vn.title;
                    if(inputted.includes(vn.title)){
                        p.style.color = "red";
                    }
                    p.onclick = () => {
                        searchBar.value = vn.title;
                        sugBox.innerHTML = "";
                        sugBox.appendChild(p);
                        recList = [];
                        recList.push(vn);
                    };
                    sugBox.appendChild(p);
                });
                tempInput = inputValue;
            }
            //back space to nothing
            if(inputValue === undefined || inputValue === ""){
                try{
                    sugBox.innerHTML = "";
                }catch{
                    console.log("suggestion box is already empty");
                }
                inputted.forEach((title: string) => {
                    const p = document.createElement("p");
                    p.textContent = title;
                    if(title !== get(currVN).title){
                        p.style.color = "red";
                    }else{
                        p.style.color = "green";
                    }
                    sugBox.appendChild(p);
                });
            
            }
        }
        
    }, 250);

    function check(){
        let autoFilled: string = "";
        tempInput = "";
        if(recList.length >= 1){autoFilled = recList[0].title;}
        if(!inputted.includes(autoFilled)){
            inputted.push(autoFilled);
            if(autoFilled === get(currVN).title){
                win();
            }else{
                //in gameMech.ts
                hintUpdate();
                if(recList[0] !== undefined){
                    relationCheck(recList[0]);
                    tagOverlap(recList[0]);
                }
            }
            sugBox.innerHTML = "";
            searchBar.value = "";
            inputValue = "";
            recList = [];
        }
    }
</script>

<script lang="ts">
    const dispatch = createEventDispatcher();

    function handleKeydown(event: KeyboardEvent){
        if(event.key === "Enter"){
            dispatch("enter");
            check();
        }
    }
</script>

<main
class=" w-full flex flex-col items-center">
    <div id="inputBox"
    class="flex flex-row w-[30vw] mr-[min(2vw,2vh)] my-[min(2vw,2vh)]">
        <input 
        type="text"
        bind:value= {inputValue}
        bind:this={searchBar}
        placeholder= {placeholder}
        on:keydown={handleKeydown}
        class=" w-full text-center outline bg-[var(--transp-bg)] mr-[1vw] placeholder:text-center text-[calc(2vw)] lg:text-[calc(2vh)]"
        />

        <button
        class=" text-[var(--text-col)] outline bg-[var(--transp-bg)] p-1 rounded-2xl cursor-pointer"
        on:click={check}>
            check
        </button>
    </div>

    <div id="suggestBox"
    bind:this={sugBox}
    class=" items-center mr-[min(2vw,2vh)]
    [&>*]:text-center [&>*]:text-[calc(min(1.5vw,1.5vh))] [&>*]:lg:text-[calc(min(2vw,2vh))] [&>*]:cursor-pointer [&>*]:my-[1vh] [&>*]:outline [&>*]:bg-[var(--transp-bg)]">
    </div>
</main>