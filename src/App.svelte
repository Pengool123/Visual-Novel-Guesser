<script lang="ts">
  import {fade} from 'svelte/transition';
  import {onMount, onDestroy} from 'svelte';
  import {StartUp, VNList} from './lib/startUp';
  import {Router, Route} from 'svelte-routing';

  import HintInput from './lib/HintInput.svelte';
  import Display from './lib/VisualNovelDisplay.svelte';
  import Header from './lib/Header.svelte';
  import Settings from './settings/Setting.svelte';

  import "./app.css";

  let loading: boolean = true;
  let dots: string = '';

  let timer;

  onMount(async() =>{

      timer = setInterval(() => {
          dots = dots.length < 3 ? dots + '.' : '';
      }, 500);

      try{
        if(VNList.length <= 0){
          await StartUp();
        }
        loading = false;
      }catch(err){
          console.error('start up failed', err);
      }finally{
          clearInterval(timer);
      }
  });

  onDestroy(() =>{
    if(timer !== undefined){
      clearInterval(timer);
    }
  });

</script>

<Router url="{window.location.pathname}">
    <main
    class=" min-h-screen bg-[var(--bg-col)] text-[var(--text-col)]">

      <Route path="/">
        {#if loading}
          <div
          id="load_screen"
          class=" z-12 absolute top-0 left-0 flex h-full w-full bg-black justify-center items-center"
          transition:fade={{duration:800}}>
            <p class=" text-white ">Loading{dots}</p>
          </div>
        {/if}

        <div class="relative z-2">
            <Header/>
        </div>

        <div id='playBox'>
          <div
          class=" absolute z-0 inset-0"
          style="background-image: var(--bg-img);
          background-position: var(--bg-img-pos);
          background-repeat: no-repeat;">
          </div>
          
          <div id="forground"
          class="flex row-auto relative z-10">
            <Display/>

            <HintInput/>
          </div>
        </div>
      </Route>

      <Route path="/settings">
        <Settings/>
      </Route>
    
    </main>

</Router>