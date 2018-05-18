import Vue from 'vue';
import VueRouter from 'vue-router';
import appRoutes from './app.routes';
import store from './app.store';

Vue.use(VueRouter);

const router = new VueRouter({
    mode: 'history',
    routes: [
        appRoutes
    ],
});

router.beforeEach(checkIfAuthorized);
router.redirectAfterLogin = redirectAfterLogin;

export default router;

function checkIfAuthorized(toRoute, fromRoute, next){

    const authenticationIsRequired = toRoute.matched.some((route) => route.meta.requiresAuth);
    const userIsAuthorized = store.state.guest.user.hasAccessToken;
    const userWantsAuthRouteButNotLoggedIn = authenticationIsRequired && !userIsAuthorized;

    if(userWantsAuthRouteButNotLoggedIn){
        router.redirectedFrom = toRoute;
        next({ name: 'login' });
    } else {
        next();
    }
}

function redirectAfterLogin(toRoute){
    toRoute = toRoute || { name: 'home' };
    if(router.redirectedFrom){
        toRoute.name = router.redirectedFrom.name;
        toRoute.params = router.redirectedFrom.params;
        toRoute.query = router.redirectedFrom.query;
        delete router.redirectedFrom;
    }
    router.push(toRoute);
}
