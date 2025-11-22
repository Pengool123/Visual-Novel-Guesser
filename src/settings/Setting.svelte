<script lang="ts">
    import Header from '../lib/Header.svelte';
    import {setCookie, getCookie} from '../lib/cookie';
    import {writable, get} from 'svelte/store';
    import cssSetup from '../lib/cssChange';
    
    cssSetup();

    const eroVNEnabled = writable<boolean>(getCookie("eroVN"));
    const eroTagEnable = writable<boolean>(getCookie("eroTag"));
    const tagSpoilerLvl = writable<number>(getCookie("showSpoil"));
    const hImgLvl = writable<number>(getCookie("hImgLvl"));
    const vImgLvl = writable<number>(getCookie("vImgLvl"));

    const showDesc = writable<boolean>(false);
    const desc = writable<string>("");

    //bind is string bc yeah
    let skinValue:string = (getCookie("skin") as string).toString();

    function updateEroVN(){
        let temp: boolean = !getCookie("eroVN");
        setCookie("eroVN", temp);
        eroVNEnabled.set(temp);
    }
    
    function updateEroTag(){
        let temp: boolean = !getCookie("eroTag");
        setCookie("eroTag", temp);
        eroTagEnable.set(temp);
    }

    function updateSpoilerTag(){
        let temp: number = getCookie("showSpoil");
        temp = temp+1 > 2 ? 0 : temp+1;
        setCookie("showSpoil", temp);
        tagSpoilerLvl.set(temp);
    }

    function updateHImgLvl(){
        let temp: number = getCookie("hImgLvl");
        temp = temp+1 > 2 ? 0 : temp+1;
        setCookie("hImgLvl", temp);
        hImgLvl.set(temp);
    }

    function updateVImgLvl(){
        let temp: number = getCookie("vImgLvl");
        console.log(temp);
        temp = temp+1 > 2 ? 0 : temp+1;
        setCookie("vImgLvl", temp);
        vImgLvl.set(temp);
        console.log(temp);
    }

    function onDescHover(string: string){
        desc.set(string);
        showDesc.set(true);
    }

    function onDescLeave(){
        showDesc.set(false);
    }

    //makes the next part not look like cancer
    function setCSSVar(name: string, value: string) {
        document.documentElement.style.setProperty(name, value);
    }

    $: {
        setCookie("skin", skinValue);
        cssSetup();
        }
</script>

<main class=" bg-[var(--bg-col)] h-screen w-screen absolute text-[var(--text-col)] justify-center">
    <div class="relative z-2">
        <Header/>
    </div>
    

    <div
    class=" absolute z-0 inset-0"
    style="background-image: var(--bg-img);
    background-position: var(--bg-img-pos);
    background-repeat: no-repeat;">
    </div>

    <div id="box"
    class=" relative z-2 flex bg-[var(--transp-bg)] w-[80vw] h-[80vh] mx-[10vw] my-[5vh] outline justify-center flex-col">
        <div id="top_half"
        class=" flex items-center align-middle justify-center h-1/2 outline
        [&>*]:mx-auto [&>*]:w-1/6 [&>*]:h-1/8 [&>*]:rounded-2xl [&>*]:text-[calc(min(1.5vh,1.5vw))] [&>*]:bg-[var(--intractable-bg)]">
            <button id="enableEroVN"
            class=" cursor-pointer outline"
            on:click={updateEroVN}
            on:mouseenter={()=>onDescHover(`OFF: Does not include any visual Novel that has an NSFW version
            <br> ON: Every visual novel is included`)}
            on:mouseleave={()=>onDescLeave()}>
            Include Eroge Visual Novels: 
                {#if $eroVNEnabled}
                    ON
                {:else}
                    OFF
                {/if}
            </button>

            <button id="enableEroTags"
            class=" cursor-pointer outline"
            on:click={updateEroTag}
            on:mouseenter={()=>onDescHover(`OFF: Does not include sexual tags
            <br>ON: includes sexual tags`)}
            on:mouseleave={()=>onDescLeave()}>
            Include Eroge Tags: 
                {#if $eroTagEnable}
                    ON
                {:else}
                    OFF
                {/if}
            </button>

            <button id="spoilerLvl"
            class=" cursor-pointer outline"
            on:click={updateSpoilerTag}
            on:mouseenter={()=>onDescHover(`No Spoilers: no spoiler tags will show
            <br>Minor Spoilers: all tags that are minor spoilers are included
            <br>Max Spoilers: all tags regardless of spoilers are included`)}
            on:mouseleave={()=>onDescLeave()}>
            Tag Spoiler Level: 
                {#if $tagSpoilerLvl == 2}
                    Max Spoilers
                {:else if $tagSpoilerLvl == 1}
                    Minor Spoilers
                {:else}
                    No Spoilers
                {/if}
            </button>

            <button id="hImgLvl"
            class=" cursor-pointer outline"
            on:click={updateHImgLvl}
            on:mouseenter={()=>onDescHover(`Affects on when the visual novel image is fully shown
            <br>None: the image is blurred if deemed sexual in any way
            <br>Sexual: will show if the image is sexual but not explicit
            <br>Explicit: will show no matter the sexual content`)}
            on:mouseleave={()=>onDescLeave()}>
                Image Sexual Content: 
                {#if $hImgLvl == 2}
                    Explicit
                {:else if $hImgLvl == 1}
                    Sexual
                {:else}
                    None
                {/if}
            </button>

            <button id="vImgLvl"
            class=" cursor-pointer outline"
            on:click={updateVImgLvl}
            on:mouseenter={()=>onDescHover(`Affects on when the visual novel image is fully shown
            <br>None: the image is blurred if deemed violent in any way
            <br>Violent: will show if the image is violent but not gory
            <br>Gory: will show no matter the violence`)}
            on:mouseleave={()=>onDescLeave()}>
                Image Violence Content: 
                {#if $vImgLvl == 2}
                    Gory
                {:else if $vImgLvl == 1}
                    Violent
                {:else}
                    None
                {/if}
            </button>

        </div>

        <div id="bot_half"
        class=" flex align-middle justify-center h-1/2">
            <div id="descBox"
            class=" lg:flex justify-center items-center w-3/4 hidden lg:visible">
                <p 
                class:hidden={!$showDesc}
                class=" text-center lg:text-[calc(min(4vh,4vw))] ">{@html $desc}</p>
            </div>

            <div id="skin"
            class=" flex w-1/4 justify-center items-baseline">
                <p class=" mx-[1vw] text-[3vw] lg:text-[1.5vh]">Skins: </p>
                <select id="skinDropDown" class=" bg-[var(--intractable-bg)] text-center text-[3vw] lg:text-[1.5vh] lg:mr-[2vw]"
                bind:value={skinValue}>
                    <option value=0>Rewrite+ [Kagari] | Black</option>
                    <option value=1>Angelic Serenade [Lasty Farson] | Dark Blue</option>
                </select>
            </div>
        </div>
    </div>

</main>