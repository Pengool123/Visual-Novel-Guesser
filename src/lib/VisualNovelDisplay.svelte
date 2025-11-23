<script context="module" lang="ts">
    import Tag from './Tag.svelte';
    import {currVN, hintAmount, langFlags, popRange, rankRange, tagList, relatedList, maxHints, reset} from './gameMech';
    import { Length, Relation } from './enums';
    import { writable, get } from 'svelte/store';
    import {getCookie} from './cookie';
    import cssSetup from './cssChange';

    cssSetup();

    let tagContainer: HTMLDivElement;

    type TagData = {
        tagName: string;
        strength: number;
        id: number;
    };

    export function tagOverlap(vn: VisualNovel){
        const tempList: Tag[] = get(currVN).tagCross(vn);
        let newTagList: Tag[] = [];
        tempList.forEach((tag: Tag) => {
            const temp: Tag = get(currVN).getTag(tag);
            if(temp != undefined && !get(tagList).includes(temp)){
                newTagList.push(temp);
            }
        });
        tagList.update(existing => [...existing, ...newTagList]);
    }
    
</script>

<script lang="ts">
    const storeList = writable<boolean>(new Array(Object.keys(Relation).length/2).fill(false));
    const showImg = writable<boolean>(false);
    const lengthList: string[] = ["Very Short", "Short", "Medium", "Long", "Very Long"];


    let vnImg: HTMLImgElement;

    $: if($currVN !== undefined && vnImg !== undefined){
        vnImg.src = $currVN.image.imgUrl;
    }

    $: for (const key in $storeList) {
            $storeList[key] = $relatedList?.[key]?.length > 0;
        }

    let sortedTags: Tag[] = [];
    
    $: sortedTags = [...$tagList].sort((a, b) => {
        if(a.rating !== b.rating){return b.rating - a.rating;}
        return a.name.toLowerCase().localeCompare(b.name.toLowerCase());
    });

    //give the user 5 random tags to start with
    $: if ($hintAmount <= 0 && $currVN !== undefined){
        $tagList = [];
        const visited: number[] = [];
        const tempTagListArr: Tag[] = Array.from(get(currVN).tagList.values());

        for(let i = 0; i < 5; i++){
            let randNum: number = Math.floor(Math.random() * tempTagListArr.length);
            if(visited.indexOf(randNum) === -1){
                visited.push(randNum);
                tagList.update(existing => [...existing, tempTagListArr[randNum]]);
            }else{
                i--;
            }
        }
    }

    $: if ($hintAmount < 5) {
            $showImg = false;
        }else if($hintAmount >= 5 && $hintAmount < $maxHints) {
            $showImg = true;
            vnImg.style.filter = 'blur(12px)';
        }else{
            vnImg.style.filter = 'blur(12px)';
            if (Math.round($currVN.image.imgS) <= getCookie("hImgLvl") &&
                Math.round($currVN.image.imgV) <= getCookie("vImgLvl")){
                vnImg.style.filter = 'none';
            }
            vnImg.onclick = () => {window.open(`https://vndb.org/${$currVN.id}`)};
            $showImg = true;
        }
</script>

<main class=" text-[2vw] lg:text-[1.75vh]">
    <div id="topDisplayArea"
    class=" flex justify-center w-[60vw] h-[55vh] lg:mx-[min(2vw,2vh)] my-[min(2vw,2vh)] outline bg-[var(--transp-bg)] overflow-visible flex-col lg:flex-row">
        <div id="picture"
        class=" flex lg:w-1/2 justify-center lg:justify-end items-center">
            
            <div alt="VisualNovelPlaceHolder"
            class:hidden={$showImg}
            class=" flex aspect-[2/3] max-h-9/10 max-w-6/10 h-full w-full object-contain lg:mr-[5%] outline bg-[var(--alt-transp-bg)] text-center items-center justify-center">
                {#if $hintAmount < 5}
                    <p>Hint in {5 - $hintAmount}</p>
                {/if}
            </div>

            <img src="" alt="VisualNovelPicture"
            bind:this={vnImg}
            class:hidden={!$showImg}
            class=" max-h-9/10 max-w-9/10 h-auto w-auto object-contain mr-[5%] outline">
        
        </div>
        <div id="misc"
        class=" flex flex-col lg:w-1/2 justify-center
        [&>*]:flex [&>*]:min-h-1/18 [&>*]:w-max-9/10 [&>*]:mx-[5%]">
            
            <div id="title"
            class=" bg-[var(--alt-transp-bg)]">
                <p id="titleHead"
                class=" flex w-3/10">
                Title</p>

                <div id="titleList"
                class=" max-w-7/10 w-full">
                {#if $hintAmount >= $maxHints}
                    <p>{$currVN.title}</p>
                {/if}
                </div>
            </div>
            
            <div id="aliases">
                <p id="aliasHead"
                class=" flex w-3/10">
                Aliases</p>

                <div id="aliasList"
                class=" max-w-7/10 w-full">
                {#if $currVN !== undefined && $hintAmount >= $maxHints}
                    {#each $currVN.aliases as title}
                        <p>{title}<br></p>
                    {/each}
                {/if}
                </div>
            </div>
            
            <div id="playTime"
            class=" bg-[var(--alt-transp-bg)]">
                <p id="playHead"
                class=" flex w-3/10">
                Length</p>
                <div id="playTimeAns"
                class=" max-w-7/10 w-full">
                    {#if $hintAmount >= 4 && $currVN != undefined}
                        <p>{lengthList[$currVN.length]}</p>
                    {:else}
                        <p>in {4 - $hintAmount} guess{4 - $hintAmount == 1 ? "" : "es"}</p>
                    {/if}    
                </div>
            </div>
            
            <div id="relations">

                <p id="titleHead"
                class=" flex w-3/10">
                Relations</p>

                <div id="relList"
                class=" flex flex-col max-w-7/10 w-full">
                    <div id="noRel"
                    class:hidden={$currVN && $currVN.relatedTitles.length}
                    class="max-w-1/1 w-full [&>*]:break-all [&>*]:text-center">
                        <p>There are no Related Visual Novels<br>
                            (that are in the popularity's top 200)</p>
                    </div>
                    
                    <div id="orig"
                    class:hidden={!$storeList[Relation.Original]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="ogTitleList"
                        class="max-w-1/1 w-full">
                            <p id="ogTitle">Original</p>
                            <div id="ogList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.Original].length}
                                    {#each $relatedList[Relation.Original] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>
                    
                    <div id="alt"
                    class:hidden={!$storeList[Relation.Alternative]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="altTitleList"
                        class="max-w-1/1 w-full">
                            <p id="altTitle">Alternative</p>
                            <div id="altList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.Alternative].length}
                                    {#each $relatedList[Relation.Alternative] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div id="parent"
                    class:hidden={!$storeList[Relation.Parent]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="parTitleList"
                        class="max-w-1/1 w-full">
                            <p id="parTitle">Parent</p>
                            <div id="parList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.Parent].length}
                                    {#each $relatedList[Relation.Parent] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div id="fanDisc"
                    class:hidden={!$storeList[Relation.FanDisc]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="fdTitleList"
                        class="max-w-1/1 w-full">
                            <p id="fdTitle">Fandisc</p>
                            <div id="fdList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.FanDisc].length}
                                    {#each $relatedList[Relation.FanDisc] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div id="preq"
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="preqTitleList"
                        class:hidden={!$storeList[Relation.Prequel]}
                        class="max-w-1/1 w-full">
                            <p id="preqTitle">Prequel</p>
                            <div id="preqList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.Prequel].length}
                                    {#each $relatedList[Relation.Prequel] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>

                    <div id="seq"
                    class:hidden={!$storeList[Relation.Sequel]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="seqTitleList"
                        class="max-w-1/1 w-full">
                            <p id="seqTitle">Sequel</p>
                            <div id="seqList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.Sequel].length}
                                    {#each $relatedList[Relation.Sequel] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    
                    </div>

                    <div id="sameSetting"
                    class:hidden={!$storeList[Relation.SameSetting]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="SetTitleList"
                        class="max-w-1/1 w-full">
                            <p id="SetTitle">Same Setting</p>
                            <div id="SetList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.SameSetting].length}
                                    {#each $relatedList[Relation.SameSetting] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    
                    </div>

                    <div id="sameSeries"
                    class:hidden={!$storeList[Relation.SameSeries]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="SerTitleList"
                        class="max-w-1/1 w-full">
                            <p id="SerTitle">Same Series</p>
                            <div id="SerList" class=" [&>*]:ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.SameSeries].length}
                                    {#each $relatedList[Relation.SameSeries] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    
                    </div>

                    <div id="sideStory"
                    class:hidden={!$storeList[Relation.SideStory]}
                    class="max-w-1/1 w-full [&>*]:break-all">
                        
                        <div id="SSTitleList"
                        class="max-w-1/1 w-full">
                            <p id="SSTitle">Side Story</p>
                            <div id="SSList" class=" [&>*]ml-[5%]">
                                {#if $relatedList && $relatedList[Relation.SideStory].length}
                                    {#each $relatedList[Relation.SideStory] as title}
                                        <p>{title}<br></p>
                                    {/each}
                                {/if}
                            </div>
                        </div>
                    </div>

                </div>
                
            </div>

            <div id="ero"
            class=" bg-[var(--alt-transp-bg)]">
                <p id="titleHead"
                class=" flex w-3/10">
                Has Ero</p>
                    
                <div id="eroAns"
                class=" max-w-7/10 w-full"> 
                    {#if $hintAmount >= 4 && $currVN != undefined}
                        <p>{$currVN.hasEro ? "Has an ero version" : "Doesn't have an ero version"}</p>
                    {:else}
                        <p>in {4 - $hintAmount} guess{4 - $hintAmount == 1 ? "" : "es"}</p>
                    {/if}
                </div>
            </div>
        </div>
    </div>

    <div id="bottomDisplayArea"
    class=" absolute z-0 left-[min(2vw,2vh)] right-[min(2vw,2vh)] my-[min(2vw,2vh)] outline bg-[var(--transp-bg)]
    [&>*]:flex [&>*]:w-max-1/1 [&>*]:justify-center [&>*]:items-center [&>*]:flex-wrap">
        <div id="tagArea"
        class="outline [&>*]:mx-[0.25vw]"
        bind:this={tagContainer}>
            {#if sortedTags.length > 0}
                {#each sortedTags as tag, i (tag.id ?? i)}
                    <Tag tagName={tag.name} strength={tag.rating} id={tag.id} spoil={tag.spoiler} ero={tag.ero}/>
                {/each}
            {/if}
        </div>
        <div id="extras"
        class=" max-w-1/1 text-center">
            <div id="langs"
            class=" w-1/3">
                {#if $hintAmount < 1}
                    <p>Languages: in {1 - $hintAmount} guess{1 - $hintAmount == 1 ? "" : "es"}</p>
                {:else}
                    <p>Languages: {$langFlags}</p>
                {/if}
            </div>
            <div id="popularity"
            class=" w-1/3">
                {#if $hintAmount < 2}
                    <p>Popularity Range: in {2 - $hintAmount} guess{2 - $hintAmount == 1 ? "" : "es"}</p>
                {:else}
                    <p>Popularity Range: {$popRange}</p>
                {/if}
            </div>
            <div id="ranking"
            class=" w-1/3">
                {#if $hintAmount < 3}
                    <p>Ranking Range: in {3 - $hintAmount} guess{3 - $hintAmount == 1 ? "" : "es"}</p>
                {:else}
                    <p>Ranking Range: {$rankRange}</p>
                {/if}
            </div>
        </div>

        <div id="quote"
        class=" flex w-full max-w-full outline">
            {#if $currVN && $hintAmount >= 4}
                <p>{$currVN.bestQuote}</p>
            {:else}
                <p>Quote in {4 - $hintAmount} guess{4 - $hintAmount == 1 ? "" : "es"}</p>
            {/if}
        </div>

    </div>
    
    <div id="restart">
        <button id="restart"
        class:hidden={!($hintAmount >= $maxHints)}
        class=" flex fixed bottom-4 left-1/2 transform -translate-x-1/2 cursor-pointer outline
         text-[calc(min(3vh,3vw))] text-center justify-center items-center bg-[var(--intractable-bg)] rounded-2xl z-5 w-[10vw] h-[4vh]"
        on:click={reset}>
            Play Again
        </button>
    </div>


</main>