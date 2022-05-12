export default {
    path: '/a',
    component: ()=> import('@/views/A'),
    meta: {
        title: 'A页面'
    },
    children: []
}