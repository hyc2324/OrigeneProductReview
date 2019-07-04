import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import Table from './views/nav1/Table.vue'
import Approved from './views/nav1/approved.vue'
import Disapproved from './views/nav1/disapproved.vue'
//import Test from './views/Test.vue'


let routes = [
    {
        path: '/login',
        component: Login,
        name: '',
        hidden: true
    },
    {
        path: '/404',
        component: NotFound,
        name: '',
        hidden: true
    },

    //{ path: '/main', component: Main },
    {
        path: '/',
        component: Home,
        name: 'View',
        iconCls: 'el-icon-message',//图标样式class
        children: [
        //    { path: '/test', component: Test, name: 'Test'},
            { path: '/main', component: Main, name: 'HomePage', hidden: true },
            { path: '/table', component: Table, name: 'Waiting for processing' },
            { path: '/approved', component: Approved, name: 'Approved' },
            { path: '/disapproved', component: Disapproved, name: 'Disapproved' },
        ]
    },
    {
        path: '*',
        hidden: true,
        redirect: { path: '/404' }
    }
];

export default routes;
