import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'             the icon show in the sidebar
    noCache: true                if set true, the page will no be cached(default is false)
    affix: true                  if set true, the tag will affix in the tags-view
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },
  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [
      {
        path: 'dashboard',
        component: () => import('@/views/dashboard/index'),
        name: 'Dashboard',
        meta: { title: '首页', icon: 'dashboard', affix: true }
      }
    ]
  },
  {
    path: '/resource',
    component: Layout,
    redirect: '/resource/host',
    name: 'Resource',
    meta: {
      'title': '资源管理',
      'icon': 'tree'
    },
    children: [
      {
        path: 'host',
        component: () => import('@/views/resource/host'),
        name: 'Host',
        meta: { 'title': '主机' }
      },
      // {
      //   path: 'javaPackage',
      //   component: () => import('@/views/resource/JavaPackage'),
      //   name: 'JavaPackage',
      //   meta: { 'title': 'JAR 包' }
      // },
      // {
      //   path: 'MySQLDB',
      //   component: () => import('@/views/resource/MySQLDB'),
      //   name: 'MySQLDB',
      //   meta: { 'title': 'MySQL DB' }
      // },
      {
        path: 'project',
        component: () => import('@/views/resource/project'),
        name: 'Project',
        meta: { 'title': '项目' }
      }
    ]
  },
  {
    path: '/task-cener',
    component: Layout,
    redirect: '/task-center/task',
    name: 'TaskCenter',
    meta: {
      title: '任务中心',
      icon: 'list'
    },
    children: [
      {
        path: 'task',
        component: () => import('@/views/task-center/task'),
        name: 'Task',
        meta: {
          title: '任务'
        }
      },
      {
        path: 'ExecTask',
        component: () => import('@/views/task-center/ExecTask'),
        name: 'ExecTask',
        meta: {
          title: '执行任务'
        }
      }
    ]
  },
  {
    path: '/account',
    component: Layout,
    redirect: '/account/software',
    name: 'Account',
    meta: {
      title: '账号管理',
      icon: 'peoples'
    },
    children: [
      {
        path: 'software',
        component: () => import('@/views/account/software'),
        name: 'Software',
        meta: {
          title: '账号管理'
        }
      }
    ]
  },
  {
    path: '/redirect',
    component: Layout,
    hidden: true,
    children: [
      {
        path: '/redirect/:path(.*)',
        component: () => import('@/views/redirect/index')
      }
    ]
  },
  {
    path: '/auth-redirect',
    component: () => import('@/views/login/auth-redirect'),
    hidden: true
  },
  {
    path: '/404',
    component: () => import('@/views/error-page/404'),
    hidden: true
  },
  {
    path: '/401',
    component: () => import('@/views/error-page/401'),
    hidden: true
  }
]

/**
 * asyncRoutes
 * the routes that need to be dynamically loaded based on user roles
 */
export const asyncRoutes = [
  {
    path: '/auth_permission',
    component: Layout,
    redirect: '/auth_permission/user',
    name: 'AuthPermission',
    meta: {
      title: '认证权限',
      icon: 'password'
    },
    children: [
      {
        path: 'user',
        component: () => import('@/views/auth-permission/user'),
        name: 'User',
        meta: {
          title: '系统用户'
        }
      },
      {
        path: 'group',
        component: () => import('@/views/auth-permission/group'),
        name: 'Group',
        meta: {
          title: '用户组'
        }
      }
    ]
  }
  // 404 page must be placed at the end !!!
  // { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
