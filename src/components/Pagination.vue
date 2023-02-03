<script setup lang="ts">

defineProps<{
    pages: number
    currentPage: number
}>()

defineEmits<{
    (e: 'nextPage'): void,
    (e: 'prevPage'): void,
}>()

</script>

<template>

    <div v-if="pages > 1" class="my-4">
        <div class="flex flex-col items-center">
            <!-- Help text -->
            <span class="text-sm text-gray-400">
                Page <span class="font-semibold text-white">{{ currentPage }}</span> of <span
                    class="font-semibold text-white">{{ pages }}</span>
            </span>
            <!-- Buttons -->
            <div class="inline-flex mt-2 xs:mt-0">
                <button :disabled="currentPage === 1" @click="$emit('prevPage')"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium  rounded-l bg-gray-800 border-gray-700 text-gray-400 hover:enabled:bg-gray-900 hover:enabled:text-white transition-colors disabled:opacity-60 disabled:cursor-not-allowed">
                    <svg aria-hidden="true" class="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M7.707 14.707a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l2.293 2.293a1 1 0 010 1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                    Prev
                </button>
                <button :disabled="currentPage === pages" @click="$emit('nextPage')"
                    class="inline-flex items-center px-4 py-2 text-sm font-medium border-0 border-l rounded-r bg-gray-800 border-gray-700 text-gray-400 hover:bg-gray-900 hover:text-white transition-colors disabled:opacity-60">
                    Next
                    <svg aria-hidden="true" class="w-5 h-5 ml-2" fill="currentColor" viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg">
                        <path fill-rule="evenodd"
                            d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                            clip-rule="evenodd"></path>
                    </svg>
                </button>
            </div>
        </div>

    </div>


</template>

<style scoped>

</style>
