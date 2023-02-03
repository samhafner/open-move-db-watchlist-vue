<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { computed, ref } from 'vue';
import Search from '../components/Search.vue';
import MovieCard from '../components/MovieCard.vue';
import { SearchResult } from '../interfaces';

const searchText = ref('')
const watchlist = useLocalStorage('watchlist', [] as SearchResult[])
const watchlistFiltered = computed(() => {
    if (!searchText.value) {
        return watchlist.value
    }
    return watchlist.value.filter(movie => movie.Title.toLowerCase().includes(searchText.value.toLowerCase()))
})

</script>

<template>
    <div class="section-max-w">
        <h1 class="text-3xl md:text-4xl font-bold text-center py-8">My Watchlist</h1>
        <Search class="mb-6" @update:search-params="(val) => searchText = val.s" mode="eager" placeholder="Search your watchlist" @reset-filters="searchText = ''"/>

        <div v-if="watchlistFiltered.length === 0 && searchText !== ''">
            <p>No movies found in your watchlist.</p>
        </div>
        <div v-else-if="watchlistFiltered.length === 0">
            <p>Your watchlist is empty. <RouterLink :to="{ name: 'home' }" class="text-blue-400">Search</RouterLink> for movies and add them to your watchlist.</p>
        </div>
        <div v-else class="space-y-2">
            <MovieCard v-for="movies in watchlistFiltered" :movie="movies" :key="movies.imdbID"/>
        </div>
    </div>



</template>

<style scoped>

</style>
