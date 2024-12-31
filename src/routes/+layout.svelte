<script lang="ts">
    import '../app.css';
    import Footer from "$lib/components/Footer.svelte";
    import NavBar from "$lib/components/NavBar.svelte";

    let {children} = $props();
</script>


<div class="h-screen">
    <div class="sticky top-5 z-50">
        <NavBar/>
    </div>

    {@render children()}

    <div class="sticky top-[100vh]">
        <Footer/>
    </div>
</div>

