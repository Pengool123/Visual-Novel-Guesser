<script lang="ts">
    export let tagName: string = "Tag Name";
    export let strength: number = 3;
    export let id: string = "g96";
    export let spoil: number = 0;
    export let ero: boolean = false;

    function handleClick(){
        window.open(`https://vndb.org/${id}`)
    }
</script>

<main>
    <div class=" inline-flex flex-row text-center items-baseline mx-1 cursor-pointer"
    style="font-size:calc({strength}/3 * min(1.5vh,1.5vw));
            margin-inline: calc({strength}/3 * 0.5em)">
        <!-- svelte-ignore a11y_click_events_have_key_events -->
        <!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
        <p id="name"
        class=" cursor-pointer"
        on:click={handleClick}>
            {tagName}
            
            {#if ero}
                <span id="ero"
                style="font-size: font-size: calc({strength}/3 * min(2vh,2vw))"
                class=" align-top -tracking-tight relative -left-[calc(min(0.3vw,0.3vh))] -top-1 text-pink-500">
                H
                </span>
            {/if}

            {#if spoil >= 1}
                {#if spoil > 1}
                    <span id="spoiler"
                    style="font-size: font-size: calc({strength}/3 * min(1.5vh,1.5vw))"
                    class=" align-top -tracking-tight relative -left-[calc(min(0.3vw,0.3vh))] -top-1 text-[var(--maSpoil-txt-col)]">
                    S
                    </span>
                {:else}
                    <span id="spoiler"
                    style="font-size: font-size: calc({strength}/3 * min(1.5vh,1.5vw))"
                    class=" align-top -tracking-tight relative -left-[calc(min(0.3vw,0.3vh))] -top-1 text-[var(--miSpoil-txt-col)]">
                    S
                    </span>
                {/if}
                
            {/if}
        </p>

        <p id="strength"
        class=" text-[calc(1vh)] items-end"
        style="font-size: calc({strength}/3 * 1vh); margin-left: calc({strength}/3 * 0.4vh);">
            {strength}
        </p>
    </div>
</main>