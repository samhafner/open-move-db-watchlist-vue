<script setup lang="ts">
import { onMounted, onBeforeMount, ref, watch } from 'vue';
import { networkRequest } from '../composables'
import { Movie, OmdbResponseById } from '../interfaces';
import { useRoute, } from 'vue-router'
import { useLocalStorage } from '@vueuse/core';

const route = useRoute()
const apikey = useLocalStorage('apikey', '')
const { id } = route.params
const movie = ref({} as OmdbResponseById)

const watchlist = useLocalStorage('watchlist', [] as Movie[])
const inWatchlist = ref(false)

watch(inWatchlist, (bool) => {
    if (!bool) {
        watchlist.value = watchlist.value.filter((entry) => entry.imdbID !== movie.value.imdbID)
    } else {
        if (!watchlist.value.some((entry) => entry.imdbID === movie.value.imdbID)) {
            if (movie.value.Title && movie.value.Year && movie.value.imdbID && movie.value.Type && movie.value.Poster) {
                watchlist.value.push({
                    Title: movie.value.Title,
                    Year: movie.value.Year,
                    imdbID: movie.value.imdbID,
                    Type: movie.value.Type,
                    Poster: movie.value.Poster
                })
            }
        }

    }
})


const watched = ref(false)


watch(watched, (bool) => {
    // if the movie is not in the watchlist, add it
    if (!inWatchlist.value) {
        inWatchlist.value = true
    }

    if (!bool) {
        // set unwatched
        watchlist.value = watchlist.value.map((entry) => {
            if (entry.imdbID === movie.value.imdbID) {
                entry.watched = false
            }
            return entry
        })
    } else {
        // set watched
        watchlist.value = watchlist.value.map((entry) => {
            if (entry.imdbID === movie.value.imdbID) {
                entry.watched = true
            }
            return entry
        })
    }

})


onBeforeMount(async () => {
    const data = await getMovieById(id as string)
    if (data) {
        movie.value = data
        inWatchlist.value = watchlist.value.some((entry) => entry.imdbID === movie.value.imdbID)
    }

    // check if the movie is in the watchlist. If it is, set the watched value to the value in the watchlist
    if (watchlist.value.some((entry) => entry.imdbID === movie.value.imdbID)) {
        watched.value = watchlist.value.some((entry) => entry.imdbID === movie.value.imdbID && entry.watched)
    }
})

async function getMovieById(id: string) {
    const response = await networkRequest({
        method: 'GET',
        url: 'http://www.omdbapi.com/',
        params: {
            apikey: apikey.value,
            i: id,
            r: 'json',
            plot: 'full'
        }
    })

    if (response && response?.data) {
        if (response.data.Response === 'True') {
            return response.data
        }
        else {
            console.log('Error with retrieving title by id:', response.data.Error);
        }
    }
    else {
        console.log('Error with retrieving title by id: No response or data');
    }
}

function capitalizeFirstLetter(str: string) {
    if (!str) return str;
    return str.charAt(0).toLocaleUpperCase() + str.slice(1);
}

function convertToHrsMins(time: string | undefined): string {
    if (!time) return '';
    const [minutesStr, label] = time.split(" ");
    const minutes = parseInt(minutesStr);

    if (label !== "min" || isNaN(minutes)) {
        return time;
    }

    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;

    return `${hours}h ${remainingMinutes}m`;
}

function formatVotes(str: string): string {
    const num = parseInt(str.replace(',', ''));
    if (num >= 1000) {
        return `${Math.round(num / 1000)}K`;
    }
    return str;
}

function colorMetascore(type: string, score: string): string {
    if (type === 'game') {
        if (parseInt(score) >= 75) {
            return 'bg-green-600'
        }
        else if (parseInt(score) >= 50) {
            return 'bg-yellow-500'
        }
        else {
            return 'bg-red-600'
        }
    }
    else {
        if (parseInt(score) >= 61) {
            return 'bg-green-600'
        }
        else if (parseInt(score) >= 40) {
            return 'bg-yellow-500'
        }
        else {
            return 'bg-red-600'
        }
    }
}

</script>

<template>
    <div class="section-max-w my-10">
        <div v-if="!movie">
            <p>Could not find title</p>
        </div>

        <div v-else class="flex ">
            <!-- Poster for bigger screens -->
            <div class="w-[300px] max-h-[500px] flex-shrink-0 hidden md:block">
                <img :src="movie.Poster === 'N/A' ? '/NO-Image-placeholder.webp' : movie.Poster" alt="Poster"
                    class="h-full w-full object-cover object-center">
            </div>
            <!-- Info area -->
            <div class="px-4 flex flex-col gap-4">
                <!-- Movie title -->
                <h1 class="text-3xl font-bold two-lines">{{ movie.Title }}
                    <span class="text-gray-400 font-semibold">{{ '(' + movie.Year + ')' }}</span>
                </h1>
                <!-- Movie info -->
                <div class="flex items-center text-gray-300 flex-wrap">
                    <p class="border border-gray-300 px-1 mr-2">{{ movie.Rated }}</p>
                    <p class="">{{ capitalizeFirstLetter(movie.Type as string) }}</p>
                    <span aria-hidden="true"> <i class="bi bi-dot"></i> </span>
                    <p class="">{{ movie.Released }}</p>
                    <span aria-hidden="true"> <i class="bi bi-dot"></i> </span>
                    <template v-if="movie.Runtime !== 'N/A'">
                        <p class="">{{ convertToHrsMins(movie.Runtime) }}</p>
                        <span aria-hidden="true"> <i class="bi bi-dot"></i> </span>
                    </template>
                    <p class="">{{ movie.Genre }}</p>
                </div>
                <!-- Ratings -->
                <div class="flex gap-4 flex-wrap">
                    <a v-if="movie.imdbRating !== 'N/A'" :href="'https://www.imdb.com/title/' + movie.imdbID"
                        rel="noopener noreferer" target="_blank">
                        <div class="flex gap-1 items-end">
                            <p>IMDb Rating:</p>
                            <p class="font-bold">{{ movie.imdbRating }}</p>/10
                            <p class="text-sm text-gray-300">
                                ({{ movie.imdbVotes ? formatVotes(movie.imdbVotes) : movie.imdbVotes }})</p>
                        </div>
                    </a>
                    <a v-if="movie.Metascore !== 'N/A'" rel="noopener noreferer" target="_blank"
                        :href="`https://www.metacritic.com/search/all/${encodeURI(movie.Title as string)}/results`">
                        <div class="flex gap-1 items-end">
                            <p>Metascore</p>
                            <p class="px-1 rounded-md font-semibold"
                                :class="colorMetascore(movie.Type as string, movie.Metascore as string)">
                                {{ movie.Metascore }}
                            </p>
                        </div>
                    </a>
                </div>

                <div class="flex gap-2">
                    <!-- Watchlist button -->
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

                <!-- Poster for smaller screens -->
                <div class="w-[350px] max-h-[500px] flex-shrink-0 md:hidden mx-auto">
                    <img :src="movie.Poster === 'N/A' ? '/NO-Image-placeholder.webp' : movie.Poster" alt="Poster"
                        class="h-full w-full object-cover object-center">
                </div>

                <!-- Plot -->
                <div>
                    <h2 class="text-lg font-semibold">Overview</h2>
                    <p>
                        {{ movie.Plot }}
                    </p>
                </div>

                <!-- Additional infos (director, etc)-->
                <div>
                    <div class="text-sm text-gray-300 flex gap-1">
                        <p class="font-semibold">Director:</p>
                        <p>{{ movie.Director }}</p>
                    </div>
                    <div class="text-sm text-gray-300 flex gap-1">
                        <p class="font-semibold">Writer:</p>
                        <p>{{ movie.Writer }}</p>
                    </div>
                    <div class="text-sm text-gray-300 flex gap-1">
                        <p class="font-semibold">Actors:</p>
                        <p>{{ movie.Actors }}</p>
                    </div>
                    <div class="text-sm text-gray-300 flex gap-1">
                        <p class="font-semibold">Boxoffice:</p>
                        <p>{{ movie.BoxOffice }}</p>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<style scoped>

</style>
