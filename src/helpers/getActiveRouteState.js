const getActiveRouteState = route => {
  if (
    !route.routes ||
    route.routes.length === 0 ||
    route.index >= route.routes.length
  ) {
    return route;
  }

  const childActiveRoute = route.routes[route.index];
  return getActiveRouteState(childActiveRoute);
};

const getCurRouteName = getState => {
  const activeIndex = getState()?.index;
  const routes = getState()?.routes;

  return routes[activeIndex]?.name;
};

export {getCurRouteName, getActiveRouteState};
