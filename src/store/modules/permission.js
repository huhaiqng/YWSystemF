import { constantRoutes } from '@/router'
import { getMenus } from '@/api/dashboard'
import Layout from '@/layout'
// import Vue from 'vue'

/**
 * Use meta.role to determine if the current user has permission
 * @param roles
 * @param route
 */
// function hasPermission(roles, route) {
//   if (route.meta && route.meta.roles) {
//     return roles.some(role => route.meta.roles.includes(role))
//   } else {
//     return true
//   }
// }

/**
 * Filter asynchronous routing tables by recursion
 * @param routes asyncRoutes
 * @param roles
 */

const state = {
  routes: [],
  addRoutes: []
}

const mutations = {
  SET_ROUTES: (state, routes) => {
    state.addRoutes = routes
    state.routes = constantRoutes.concat(routes)
  }
}

export function generaMenu(routes, data) {
  data.forEach(l1menu => {
    var menu = {
      path: l1menu.path,
      component: Layout,
      redirect: l1menu.redirect,
      children: [],
      name: l1menu.name,
      meta: { title: l1menu.title, icon: l1menu.icon }
    }

    l1menu.children.forEach(l2menu => {
      var cmenu = {
        path: l2menu.path,
        component: resolve => require([`@/views${l2menu.component}`], resolve),
        redirect: l2menu.redirect,
        name: l2menu.name,
        meta: { title: l2menu.title }
      }
      menu.children.push(cmenu)
    })
    routes.push(menu)
  })
}

const actions = {
  generateRoutes({ commit }) {
    return new Promise(resolve => {
      const loadMenuData = []
      getMenus().then(response => {
        var data = response
        Object.assign(loadMenuData, data)
        var tempAsyncRoutes = []
        generaMenu(tempAsyncRoutes, loadMenuData)
        var accessedRoutes = tempAsyncRoutes
        commit('SET_ROUTES', accessedRoutes)
        resolve(accessedRoutes)
      }).catch(error => {
        console.log(error)
      })
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}
