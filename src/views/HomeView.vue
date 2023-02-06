<script setup lang="ts">
import { computed, onMounted, Ref, ref, watch } from 'vue';
import { networkRequest } from '../composables'
import Search from '../components/Search.vue';
import MovieCard from '../components/MovieCard.vue';
import { OmdbResponseBySearch } from '../interfaces';
import { useLocalStorage } from '@vueuse/core'
import Pagination from '../components/Pagination.vue';
import ErrorField from '../components/ErrorField.vue';
import { useRouter, useRoute } from 'vue-router'

const router = useRouter()
const route = useRoute()

const RESULTS_PER_PAGE = 10 // defined by API

const apikey = useLocalStorage('apikey', '')
const searchResults = ref({} as OmdbResponseBySearch)
const pages = computed(() => {
    if (!searchResults.value.totalResults) return 0
    return Math.ceil(Number(searchResults.value.totalResults) / RESULTS_PER_PAGE)
})
const currentPage = ref() as Ref<number>
const errorMessage = ref('')
const searchParams = ref({})

watch(searchParams, () => {
    // if search params are not empty, get search results
    // this is to prevent the reset button from triggering a search
    if (searchParams.value && Object.keys(searchParams.value).length > 0) {
        getSearchResults()
    }
})

// set the current page to the query param page if it exists or 1 if it doesn't
if (route.query.page) {
    currentPage.value = Number(route.query.page)
}
else {
    currentPage.value = 1
}

async function getSearchResults() {
    // reset error message to hide the alert area
    errorMessage.value = ''

    // reset search results
    searchResults.value = {} as OmdbResponseBySearch

    if (!apikey.value) {
        const value = prompt('Please enter your Open Movie Database API key')
        if (value) {
            apikey.value = value
            getSearchResults()
        }
        else return
    }
    if (searchParams.value) {
        const response = await networkRequest({
            method: 'GET',
            url: 'https://www.omdbapi.com/',
            params: {
                apikey: apikey.value,
                r: 'json',
                page: currentPage.value,
                ...searchParams.value
            }
        })

        if (response && response?.data) {

            if (response.data.Response === 'True') {
                searchResults.value = response.data
            }
            else {
                console.log(response.data.Error);
                errorMessage.value = response.data.Error
            }
        }
        else {
            console.log("Error with searching: No response or data");
            errorMessage.value = "Something went wrong. Please try again later."

        }
    }

    router.push({ query: { ...searchParams.value, page: currentPage.value } })
}

function nextPage() {
    if (currentPage.value < pages.value) {
        currentPage.value++
        getSearchResults()
    }
}

function prevPage() {
    if (currentPage.value > 1) {
        currentPage.value--
        getSearchResults()
    }
}

function clearFilters() {
    // clear query params
    router.push({ query: {} })

    // reset search params
    searchParams.value = {}

    currentPage.value = 1

    // reset search results
    searchResults.value = {} as OmdbResponseBySearch

    // reset query params
    router.push({ query: {} })

}

</script>

<template>
    <div class="section-max-w">
        <h1 class="text-3xl md:text-4xl font-bold text-center py-8">Open Movie Database Search</h1>
        <Search class="mb-6" :searchParams="searchParams" @update:search-params="(val) => searchParams = val" :filters="true"
            mode="lazy" placeholder="Search for movies, TV series, ..." @reset-filters="clearFilters" />
        <ErrorField :error="errorMessage" />
        <div class="space-y-2">
            <MovieCard v-for="movies in searchResults.Search" :movie="movies" :key="movies.imdbID"
                :total-results="searchResults.totalResults" />
        </div>
        <Pagination :pages="pages" :current-page="currentPage" @next-page="nextPage" @prev-page="prevPage" />
    </div>

</template>

<style scoped>

</style>
