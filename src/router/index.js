import {createRouter, createWebHashHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: "/",
            name: 'DocumentList',
            component: () => import ('../pages/DocumentList.vue')
        },
        {
            path: "/editor",
            name: 'Editor',
            component: () => import ('../pages/Editor.vue')
        }
    ]
})

export default router
