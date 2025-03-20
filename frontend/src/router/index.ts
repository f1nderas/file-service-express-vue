import Auth from "@/views/Auth.vue";
import Home from "@/views/Home.vue";
import { createRouter, createWebHistory, type RouteRecordRaw } from "vue-router";

const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: 'Home',
        component: Home,
        meta: { requiresAuth: true }
    },
    {
        path: '/auth',
        name: 'Auth',
        component: Auth
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    const token = localStorage.getItem('accessToken')
    if (to.meta.requiresAuth && !token) {
        next('/auth')
    } else {
        next()
    }
})

export { router }