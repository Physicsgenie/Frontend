import Vue from 'vue';
import Router from 'vue-router';
import Home from './views/Home.vue';
import store from './store';

Vue.use(Router);

const router = new Router({
  // mode: 'history',
  base: process.env.BASE_URL,
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
      meta: {requiresAuth: true}
    },
    {
      path: '/register',
      name: "Register",
      component: () => import(/* webpackChunkName: "login" */ './views/Register.vue'),
      meta: {guest: true}
    },
    {
      path: '/password-reset',
      name: "password-reset",
      component: () => import(/* webpackChunkName: "login" */ './views/PasswordReset.vue'),
      meta: {guest: true}
    },
    {
      path: '/login',
      name: "Login",
      component: () => import(/* webpackChunkName: "login" */ './views/Login.vue'),
      meta: {guest: true}
    },
    {
      path: '/play',
      name: 'play',
      component: () => import(/* webpackChunkName: "play" */ './views/Play.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/play/:problem',
      name: 'play-problem',
      component: () => import(/* webpackChunkName: "play" */ './views/Play.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/review',
      name: 'review',
      component: () => import(/* webpackChunkName: "review" */ './views/Review.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/leaderboard',
      name: 'leaderboard',
      component: () => import(/* webpackChunkName: "review" */ './views/Leaderboard.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/setup',
      name: 'setup',
      component: () => import(/* webpackChunkName: "setup" */ './views/Setup.vue'),
      meta: {requiresAuth: true}
    },
    {
      path: '/submit',
      name: 'submit',
      component: () => import(/* webpackChunkName: "submit" */ './views/Submit.vue'),
      meta: {requiresContributor: true}
    },
    {
      path: '/submit-portal',
      name: 'submit-portal',
      component: () => import(/* webpackChunkName: "submit" */ './views/SubmitPortal.vue'),
      meta: {requiresContributor: true}
    },
    {
      path: '/submit-portal/:id',
      name: 'submit-portal-edit',
      component: () => import(/* webpackChunkName: "submit" */ './views/SubmitPortal.vue'),
      meta: {requiresContributor: true}
    }
  ]
});

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.requiresContributor)) {
    if (store.getters.isAuthenticated && store.getters.Contributor) {
      next();
    } else if (store.getters.isAuthenticated) {
      next("/");
    } else {
      next('/login');
    }
  } else if (to.matched.some(record => record.meta.requiresAuth)) {
    if (store.getters.isAuthenticated) {
      next();
    } else {
      next('/login');
    }
  } else if (to.matched.some((record) => record.meta.guest)) {
    if (store.getters.isAuthenticated) {
      next("/");
    } else {
      next();
    }
  } else {
    next();
  }
});

export default router;

