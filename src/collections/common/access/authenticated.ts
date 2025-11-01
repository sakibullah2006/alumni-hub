import { PayloadRequest } from "payload";

export function authenticated({ req }: { req: PayloadRequest }): boolean | Promise<boolean> {
    return !!req.user
}

export function authenticatedAsAdmin({ req }: { req: PayloadRequest }): boolean | Promise<boolean> {
    const role = req.user?.role;

    if (typeof role === 'string') {
        return /^admin$/i.test(role); // exact match, case-insensitive
    }

    if (Array.isArray(role)) {
        return (role as any[]).some(r => typeof r === 'string' && /^admin$/i.test(r));
    }

    return false;
}

