export default [
  {
    path: '/',
    /*
      根路由对应的是一个空 layout 组件，其主要作用是启用 react-dev-inspector(使用 Inspector 包裹 children)
      此模块的作用是可以在开发模式下出现错误提示时直接定位跳转到 ide 的代码位置，方便调试
      所有的路由都嵌套在 blankLayout 下
    */
    component: '../layouts/BlankLayout',
    routes: [
      {
        path: '/user',
        // 登陆界面的基本 Layout（不包括登陆表单界面）
        component: '../layouts/UserLayout',
        routes: [
          {
            name: 'login',
            path: '/user/login',
            // 用户登陆表单组件
            component: './User/login',
          },
        ],
      },
      {
        path: '/',
        // SecurityLayout 的作用是校验用户登陆状态，如果用户未登录则重定向至登录页面
        component: '../layouts/SecurityLayout',
        routes: [
          {
            path: '/',
            // BasicLayout 登陆后的所有界面都会带上这个 Layout
            component: '../layouts/BasicLayout',
            authority: ['admin', 'user'],
            routes: [
              {
                path: '/',
                // 访问根目录会默认重定向到 /welcome
                redirect: '/welcome',
              },
              {
                path: '/welcome',
                name: 'welcome',
                // icon 是显示在 menu 上的图标
                icon: 'smile',
                component: './Welcome',
              },
              {
                path: '/admin',
                name: 'admin',
                icon: 'crown',
                component: './Admin',
                authority: ['admin'],
                routes: [
                  {
                    path: '/admin/sub-page',
                    name: 'sub-page',
                    icon: 'smile',
                    component: './Welcome',
                    authority: ['admin'],
                  },
                ],
              },
              {
                name: 'list.table-list',
                icon: 'table',
                path: '/list',
                component: './TableList',
              },
              {
                // 404 页面
                component: './404',
              },
            ],
          },
          {
            component: './404',
          },
        ],
      },
    ],
  },
  {
    component: './404',
  },
];
