import { createRouter, createWebHistory } from 'vue-router'

import HomeView from '../views/HomeView.vue'
import MovieDetailsViewVue from '../views/MovieDetailsView.vue'
import WatchListView from '../views/WatchListView.vue'

const routes = [
    {
        name: 'home',
        path: '/',
        component: HomeView
    },
    {
        name: 'moviedetails',
        path: '/movie/:id',
        component: MovieDetailsViewVue
    },
    {
        name: "watchlist",
        path: "/watchlist",
        component: WatchListView
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router