// Route constants for the application
export const ROUTES = {
    HOME: '/',
    ALUMNIES: '/alumnies',
    // singular/detail helper: ROUTES.ALUMNIE(id)
    ALUMNIE: (id: string | number) => `/alumnies/${id}`,
    EVENTS: '/events',
    EVENT: (id: string | number) => `/events/${id}`,
    GENERATE: '/generate',
    PROFILE: '/profile',
    // Common auth routes
    SIGNIN: '/sign-in',
    SIGNUP: '/sign-up',
} as const;

export type RouteKey = keyof typeof ROUTES;

/**
 * Utility to build a route string from a ROUTES entry.
 * If the value is a function it will be called with the provided param.
 */
export const buildRoute = (key: RouteKey, param?: string | number): string => {
    // runtime lookup
    // @ts-ignore
    const value = ROUTES[key];
    if (typeof value === 'function') {
        return (value as (p: string | number) => string)(param ?? '');
    }
    return value as string;
};
