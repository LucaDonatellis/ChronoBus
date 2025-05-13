<script>
    import { Search } from '@lucide/svelte';

    let { searchBar } = $props();
</script>
<div class="relative h-max flex-grow">

    <div class="absolute w-full p-2" hidden={!searchBar}>
        <label class="input w-full">
            <Search/>
            <input type="search" required placeholder="Search" class="w-full rounded-b-fulll "/>
        </label>
    </div>
    <div class="bg-green-400 w-full h-full block">Mappa</div>
</div>