import { sample } from 'lodash';
import pathRegexp from 'path-to-regexp';
// import { Route } from '@/models/connect'

let extraRoutes;

const updateRouteAuthority = (path, routeData, sAuth) => {
	if (routeData && Array.isArray(routeData)) {
		routeData.forEach((route) => {
			if (route.path) {
				if (route.path === '/' || pathRegexp(`${route.path}/(.*)`).test(`${path}/`)) {
					if ((route.path === path) && sAuth) {
						route.authority = sAuth;
                        // console.log(route.path,route.authority)
					}

					if (route.routes) {
						updateRouteAuthority(path, route.routes, sAuth);
					}
				}
			}
		});
	}
};

const patchEachRoute = (serverRoute, routes) => {
	if (serverRoute && Array.isArray(serverRoute)) {
		serverRoute.forEach((eRoute) => {
			updateRouteAuthority(`${eRoute.path}`, routes, eRoute.authority);
			if (eRoute.children) {
				patchEachRoute(eRoute.children, routes);
			}
		});
	}
};

export function patchRoutes({routes}) {
	if (extraRoutes) {
		patchEachRoute(extraRoutes, routes);
	}
}

export function render(oldRender) {
	fetch('/api/custom_routes', { method: 'GET' }).then((res) => res.json()).then((res) => {
		if (res.code === 0) {
			extraRoutes = res.data;
		}
		oldRender();
	});
}
