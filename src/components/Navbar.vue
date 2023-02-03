<script setup lang="ts">
import { ref } from 'vue';

import { useLocalStorage } from '@vueuse/core'

const apikey = useLocalStorage('apikey', '')
const apiInput = ref('')

function saveApiKey() {
    apikey.value = apiInput.value
}

</script>

<template>
    <div class="bg-gray-900">
        <div class="flex items-center justify-between section-max-w py-2">
            <div class="flex items-center gap-4">
                <img src="/popcorn.png" alt="Logo" class="h-8">
                <nav class="space-x-3 text-lg">
                    <RouterLink to="/" active-class="font-bold text-blue-400">Search</RouterLink>
                    <RouterLink to="/watchlist" active-class="font-bold text-blue-400">Watchlist</RouterLink>
                </nav>
            </div>

            <div v-if="!apikey">
                <form @submit.prevent="saveApiKey" class="space-x-2 flex items-center">
                    <label for="apikey" class="sr-only">Enter OMDB API Key</label>
                    <input id="apikey" type="text" v-model="apiInput" placeholder="OMDB API Key" class=" text-sm rounded-lg px-2 py-1 bg-gray-700 border border-gray-600 placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500">
                    <button type="submit" class="focus:ring-4 font-medium rounded-lg text-sm px-2 py-1 bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-blue-800">Ok</button>
                </form>
            </div>
            <div v-else class="flex gap-2">
                <p>API Key: {{ apikey }}</p>
                <button @click="apikey = ''" title="Delete key">
                    <i class="bi bi-trash3"></i>
                    <span class="sr-only">Delete key</span>
                </button>
            </div>

        </div>
    </div>

</template>

<style scoped>

</style>
