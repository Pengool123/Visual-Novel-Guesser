<script lang="ts">
  import {fade} from 'svelte/transition';
  import {onMount, onDestroy} from 'svelte';
  import {StartUp, VNList} from './lib/startUp';

  import HintInput from './lib/HintInput.svelte';
  import Display from './lib/VisualNovelDisplay.svelte';
  import Header from './lib/Header.svelte';

  import "./app.css";

  let loading: boolean = true;
  let dots: string = '';

  let timer;

  onMount(async() =>{
      console.log('starting up');

      timer = setInterval(() => {
          dots = dots.length < 3 ? dots + '.' : '';
      }, 500);

      try{
        if(VNList.length <= 0){
          await StartUp();
        }else{
          console.log('already done before');
        }
        loading = false;
        console.log('started up');
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

<main
class=" min-h-screen bg-[var(--bg-col)] text-[var(--text-col)]">
  
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
  
 
</main>
