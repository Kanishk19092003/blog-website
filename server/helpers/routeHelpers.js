function isActiveRoute(route,cuurentRoute){
    return route === currentRoute ? 'active' : '';
}

module.exports = {isActiveRoute};