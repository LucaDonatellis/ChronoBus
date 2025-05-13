<script>
    import { Search } from '@lucide/svelte';

    let { mapOpen = $bindable() } = $props();
</script>

<button class="relative h-max flex-grow transition-all z-2" onclick={() => {mapOpen = !mapOpen}} aria-expanded={mapOpen} aria-label="Expand map" >

    <div class="absolute w-full p-2" hidden={!mapOpen}>
        <label class="input w-full rounded-full">
            <Search/>
            <input type="search" required placeholder="Cerca" class="w-full"/>
            
        </label>
        
    </div>
    <div class="bg-green-400 w-full h-full block">Mappa</div>
</button>