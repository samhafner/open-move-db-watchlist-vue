<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
    error: string
}>()

const errorMessage = computed(() => {
    if (!props.error) return ''
    return 'Error! ' + props.error
})

</script>

<template>
    <div>
        <div class="mb-4 text-sm rounded-lg bg-gray-800 text-red-400" :class="{ 'p-4': errorMessage }" role="alert"
            aria-live="polite">
            <span class="font-medium">{{ errorMessage }}</span>
        </div>
    </div>

</template>

<style scoped>

</style>
