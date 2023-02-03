<script setup lang="ts">
import Navbar from './components/Navbar.vue';
import Footer from './components/Footer.vue';

</script>

<template>
    <header>
        <Navbar />
    </header>
    <main class="flex-1">
        <RouterView />
    </main>
    <footer class="mt-6">
        <Footer />
    </footer>
  
</template>

<style scoped>

</style>
