<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { ref, watch } from 'vue';
import { Movie } from '../interfaces';

const props = defineProps<{
    movie: Movie
}>()

function capitalizeFirstLetter(str: string) {
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}

const watchlist = useLocalStorage('watchlist', [] as Movie[])
const inWatchlist = ref(false)
const watched = ref(false)

// check if the movie is in the watchlist. If it is, set the watched value to the value in the watchlist
if (watchlist.value.some((movie) => movie.imdbID === props.movie.imdbID)) {
    watched.value = watchlist.value.some((movie) => movie.imdbID === props.movie.imdbID && movie.watched)
} 
inWatchlist.value = watchlist.value.some((movie) => movie.imdbID === props.movie.imdbID)
watch(inWatchlist, (bool) => {
    if (!bool) {
        watchlist.value = watchlist.value.filter((movie) => movie.imdbID !== props.movie.imdbID)

    } else if (!watchlist.value.some((movie) => movie.imdbID === props.movie.imdbID)) { // if the movie is not in the watchlist, add it
        watchlist.value.push(props.movie)
    }
})
watch(watched, (bool) => {
    // if the movie is not in the watchlist, add it
    if (!inWatchlist.value) {
        inWatchlist.value = true
    }

    if (!bool) {
        // set unwatched
        watchlist.value = watchlist.value.map((movie) => {
            if (movie.imdbID === props.movie.imdbID) {
                movie.watched = false
            }
            return movie
        })
    } else {
        // set watched
        watchlist.value = watchlist.value.map((movie) => {
            if (movie.imdbID === props.movie.imdbID) {
                movie.watched = true
            }
            return movie
        })
    }

})

</script>

<template>
    <div class="h-36 flex rounded-lg overflow-hidden bg-gray-800 shadow-md">
        <div class="w-[100px] flex-shrink-0">
            <RouterLink :to="{ name: 'moviedetails', params: { id: movie.imdbID } }">
                <img loading="lazy" :src="movie.Poster === 'N/A' ? '/NO-Image-placeholder.webp' : movie.Poster"
                    alt="Poster" class="h-full w-full object-cover object-center">
            </RouterLink>
        </div>
        <div class="p-2 pl-3 sm:p-4 flex flex-col justify-between">
            <div>
                <RouterLink :to="{ name: 'moviedetails', params: { id: movie.imdbID } }">
                    <h2 class="sm:text-lg font-bold two-lines">{{ movie.Title }}</h2>
                </RouterLink>
                <div class="flex items-center text-gray-300">
                    <p class="text-sm">{{ capitalizeFirstLetter(movie.Type) }}</p>
                    <span aria-hidden="true"> <i class="bi bi-dot"></i> </span>
                    <p class="text-sm">{{ movie.Year }}</p>
                </div>
            </div>
            <div class="flex gap-2">
                <!-- fav button -->
                <button
                    class="h-7 w-7 rounded-full bg-gray-500 hover:bg-gray-600 transition-colors flex items-center justify-center"
                    @click="inWatchlist ? inWatchlist = false : inWatchlist = true"
                    :title="inWatchlist ? 'Remove from watchlist' : 'Add to watchlist'">
                    <i class="bi text-sm"
                        :class="{ 'bi-star-fill text-yellow-400': inWatchlist, 'bi-star': !inWatchlist }"></i>
                    <span class="sr-only">{{ inWatchlist? 'Remove from watchlist': 'Add to watchlist' }}</span>
                </button>
                <!-- watched button -->
                <button
                    class="h-7 w-7 rounded-full bg-gray-500 hover:bg-gray-600 transition-colors flex items-center justify-center"
                    @click="watched ? watched = false : watched = true"
                    :title="watched ? 'Set unwatched' : 'Set watched'">
                    <i class="bi text-sm" :class="{ 'bi-eye-fill': watched, 'bi-eye-slash-fill': !watched }"></i>
                    <span class="sr-only">{{ watched? 'Set unwatched': 'Set watched' }}</span>
                </button>

            </div>
        </div>

    </div>

</template>

<style scoped>
.two-lines {
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    line-height: 1.5;
    /* fallback */
    max-height: 3;
    /* fallback */
    -webkit-line-clamp: 2;
    /* number of lines to show */
    -webkit-box-orient: vertical;
}
</style>
