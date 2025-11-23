<script>
    import {Link} from "svelte-routing";
</script>

<main class=" min-h-[6vh]">
    <div id="title"
    class=" flex justify-center">
        <h1 class=" text-[2.5vh]">Visual Novel Guesser</h1>
    </div>
    
    <div id="banner"
    class=" bg-[var(--outline)] h-2vh text-[calc(min(1.5vh,1.5vw))] text-center
    [&>*]:mx-[2vw]">
        <a href="/">Home</a>
        <Link to="/settings">Settings</Link>
        <a href="https://github.com/Pengool123">GitHub</a>
    </div>
</main>