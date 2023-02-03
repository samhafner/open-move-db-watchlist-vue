<script setup lang="ts">
import { computed, ref, watch } from 'vue';
import { useRoute} from 'vue-router'

const props = defineProps<{
    mode: 'lazy' | 'eager',
    placeholder: string
    searchParams?: { s?: string, type?: string, y?: string },
    filters?: boolean
}>()

const emit = defineEmits<{
    (e: 'update:searchParams', params: { s: string, type?: string, y?: string }): void,
    (e: 'reset-filters'): void,
}>()

const typeFilter = ref('')
const yearFilter = ref('')
const searchQuery = ref('')
const route = useRoute()

if (route.query) {
    if (route.query.s) {
        searchQuery.value = route.query.s as string
    }
    if (route.query.type) {
        typeFilter.value = route.query.type as string
    }
    if (route.query.y) {
        yearFilter.value = route.query.y as string
    }
}

const searchParams = computed(() => {
    let params: any = {}
    if (searchQuery.value) {
        params['s'] = searchQuery.value.trim()	
    }
    if (typeFilter.value) {
        params['type'] = typeFilter.value
    }
    if (yearFilter.value) {
        params['y'] = yearFilter.value
    }
    return params
})

watch(searchParams, (params) => {
    if (params['s']) {
        emit('update:searchParams', params)
    }
    if (props.mode === 'eager') {
        emit('update:searchParams', params)
    }
}, { immediate: true})


</script>

<template>

    <div>
        <form @submit.prevent="" class="">
            <!-- Search bar -->
            <label for="movie-search" class="sr-only ">Search</label>
            <div class="relative">
                <div class="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <svg aria-hidden="true" class="w-5 h-5 text-gray-400 hidden sm:block" fill="none"
                        stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                </div>
                <input v-if="mode === 'lazy'" type="search" id="movie-search" v-model.lazy="searchQuery"
                    class="block w-full p-4 sm:pl-10 pr-24 text-sm rounded-lg bg-gray-800 border border-gray-500 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="placeholder" required>
                <input v-else type="search" id="movie-search" v-model="searchQuery"
                    class="block w-full p-4 sm:pl-10 pr-24 text-sm rounded-lg bg-gray-800 border border-gray-500 placeholder-gray-400  focus:ring-blue-500 focus:border-blue-500"
                    :placeholder="placeholder" required>
                <button type="submit"
                    class="text-white absolute right-2.5 bottom-2.5 focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-2 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Search</button>
            </div>
            <!-- Filter -->
            <div v-if="filters" class="flex space-x-4 mt-3">
                <div>
                    <label for="filter-type" class="sr-only">Select type to filter</label>
                    <select id="filter-type" v-model="typeFilter"
                        class=" border text-sm rounded-lg focusblock px-2 py-1 bg-gray-800 border-gray-500 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500">
                        <option value="">Type</option>
                        <option value="movie">Movie</option>
                        <option value="series">Series</option>
                        <option value="episode">Episode</option>
                    </select>
                </div>
                <div>
                    <label for="filter-year" class="sr-only">Year</label>
                    <input type="number" id="filter-year" min="1900" max="2100" v-model.lazy="yearFilter"
                        class="w-20 text-sm rounded-lg  block  px-2 py-1 bg-gray-800 border border-gray-500 placeholder-gray-400 text-white focus:ring-blue-500 focus:border-blue-500"
                        placeholder="Year">
                </div>
                <button type="submit"
                    class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-1 bg-blue-600 hover:bg-blue-700 focus:ring-blue-800">Apply</button>
                <button type="reset" @click="$emit('reset-filters')"
                class="focus:ring-4 focus:outline-none font-medium rounded-lg text-sm px-4 py-1 bg-blue-600
                hover:bg-blue-700 focus:ring-blue-800">Reset</button>
            </div>

        </form>
    </div>

</template>

<style scoped>

</style>
