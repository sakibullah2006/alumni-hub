"use client"

import { Book, Menu, Sunset, Trees, Zap } from "lucide-react";

import {
    Accordion,
    AccordionContent,
    AccordionItem,
    AccordionTrigger,
} from "@/components/ui/accordion";
import {
    NavigationMenu,
    NavigationMenuContent,
    NavigationMenuItem,
    NavigationMenuLink,
    NavigationMenuList,
    NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { ROUTES } from "../../lib/constants/route.constants";
import { useAuth } from "@clerk/nextjs";
import Link from "next/link";
import { Button } from "../ui/button";
import { LoadingButton } from "./LoadingButton";
import { useState } from "react";
import { cn } from "../../lib/utils";
import { usePathname, useRouter } from "next/navigation";
import { NavbarSkeleton } from "../skeletons/navbar-skeleton";

interface MenuItem {
    title: string;
    url: string;
    description?: string;
    icon?: React.ReactNode;
    items?: MenuItem[];
}

interface NavbarProps {
    logo?: {
        url: string;
        src: string;
        alt: string;
        title: string;
    };
    menu?: MenuItem[];
    auth?: {
        login: {
            title: string;
            url: string;
        };
        signup: {
            title: string;
            url: string;
        };
    };
}

const Navbar = ({
    logo = {
        url: ROUTES.HOME,
        src: "https://deifkwefumgah.cloudfront.net/shadcnblocks/block/logos/shadcnblockscom-icon.svg",
        alt: "logo",
        title: "Alumni Hub",
    },
    menu = [
        { title: "Home", url: ROUTES.HOME },
        {
            title: "Discover",
            url: ROUTES.ALUMNIES,
        },
        {
            title: "Events",
            url: ROUTES.EVENTS,
        },
        {
            title: 'Dashboard',
            url: ROUTES.PROFILE,
        },
    ],
    // auth = {
    //     login: { title: "Login", url: ROUTES.SIGNIN },
    //     signup: { title: "Sign up", url: ROUTES.SIGNUP },
    // },
}: NavbarProps) => {
    const { isSignedIn, signOut, userId, isLoaded } = useAuth()
    const [buttonLoading, setButtonLoading] = useState(false);
    const pathname = usePathname();

    const auth = {
        login: { title: "Login", url: pathname.length > 1 ? `${ROUTES.SIGNIN}?redirect_url=${encodeURIComponent(pathname)}` : ROUTES.SIGNIN },
        signup: { title: "Sign up", url: pathname.length > 1 ? `${ROUTES.SIGNUP}?redirect_url=${encodeURIComponent(pathname)}` : ROUTES.SIGNUP },
    }

    if (!isLoaded) return <NavbarSkeleton />;

    console.log("Path", pathname);

    return (
        <section className="py-4 px-2 bg-background text-foreground">
            <div className="container mx-auto">
                {/* Desktop Menu */}
                <nav className="hidden justify-between lg:flex">
                    <div className="flex items-center gap-6">
                        {/* Logo */}
                        <Link href={logo.url} className="flex items-center gap-2">
                            <img
                                src={logo.src}
                                className="max-h-8 dark:invert"
                                alt={logo.alt}
                            />
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <div className="flex items-center">
                            <NavigationMenu>
                                <NavigationMenuList>
                                    {menu.map((item) => renderMenuItem(item, pathname))}
                                </NavigationMenuList>
                            </NavigationMenu>
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isSignedIn && userId ? (
                            <LoadingButton
                                className={cn("cursor-pointer", "w-full", buttonLoading && "opacity-50, cursor-not-allowed")}
                                asChild
                                variant="default"
                                loading={buttonLoading}
                                onClick={() => { setButtonLoading(true); signOut().then(() => setButtonLoading(false)); }}
                            >
                                <span>Log Out</span>
                            </LoadingButton>
                        ) : (
                            <>
                                <Button asChild variant="outline" size="sm">
                                    <Link href={auth.login.url}>{auth.login.title}</Link>
                                </Button>
                                <Button asChild size="sm">
                                    <Link href={auth.signup.url}>{auth.signup.title}</Link>
                                </Button>
                            </>
                        )}
                    </div>
                </nav>

                {/* Mobile Menu */}
                <div className="block lg:hidden">
                    <div className="flex items-center justify-between">
                        {/* Logo */}
                        <Link href={logo.url} className="flex items-center gap-2">
                            <img
                                src={logo.src}
                                className="max-h-8 dark:invert"
                                alt={logo.alt}
                            />
                            <span className="text-lg font-semibold tracking-tighter">
                                {logo.title}
                            </span>
                        </Link>
                        <Sheet>
                            <SheetTrigger asChild>
                                <Button variant="outline" size="icon">
                                    <Menu className="size-4" />
                                </Button>
                            </SheetTrigger>
                            <SheetContent className="overflow-y-auto bg-card text-card-foreground">
                                <SheetHeader>
                                    <SheetTitle>
                                        <Link href={logo.url} className="flex items-center gap-2">
                                            <img
                                                src={logo.src}
                                                className="max-h-8 dark:invert"
                                                alt={logo.alt}
                                            />
                                        </Link>
                                    </SheetTitle>
                                </SheetHeader>
                                <div className="flex flex-col gap-6 p-4">
                                    <Accordion
                                        type="single"
                                        collapsible
                                        className="flex w-full flex-col gap-4"
                                    >
                                        {menu.map((item) => renderMobileMenuItem(item, pathname))}
                                    </Accordion>


                                    <div className="flex flex-col gap-3 flex-1 rounded-lg p-4">
                                        {isSignedIn && userId ? (
                                            <LoadingButton
                                                className={cn("cursor-pointer", "w-full", buttonLoading && "opacity-50, cursor-not-allowed")}
                                                asChild
                                                variant="default"
                                                loading={buttonLoading}
                                                onClick={() => { setButtonLoading(true); signOut().then(() => setButtonLoading(false)); }}
                                            >
                                                <span>Log Out</span>
                                            </LoadingButton>
                                        ) : (
                                            <>
                                                <Button asChild variant="outline">
                                                    <Link href={auth.login.url}>{auth.login.title}</Link>
                                                </Button>
                                                <Button asChild>
                                                    <Link href={auth.signup.url}>{auth.signup.title}</Link>
                                                </Button>
                                            </>
                                        )}

                                        <>

                                        </>
                                    </div>
                                </div>
                            </SheetContent>
                        </Sheet>
                    </div>
                </div>
            </div>
        </section >
    );
};

const renderMenuItem = (item: MenuItem, pathname: string) => {
    if (item.items) {
        return (
            <NavigationMenuItem key={item.title}>
                <NavigationMenuTrigger>{item.title}</NavigationMenuTrigger>
                <NavigationMenuContent className="bg-popover text-popover-foreground">
                    {item.items.map((subItem) => (
                        <NavigationMenuLink key={subItem.title} className="w-80" href={""}>
                            <SubMenuLink item={subItem} />

                        </NavigationMenuLink>
                    ))}
                </NavigationMenuContent>
            </NavigationMenuItem>
        );
    }

    return (
        <NavigationMenuItem key={item.title} className="">
            <NavigationMenuLink
                href={item.url}
                className={cn(
                    "group inline-flex h-10 w-max items-center justify-center rounded-md px-4 py-2 text-sm font-medium transition-colors relative",
                    "after:content-[''] after:absolute after:bottom-1 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:transition-all after:duration-300 after:w-0 hover:after:w-4/5",
                    pathname.trim() === item.url.trim()
                        ? "bg-accent text-accent-foreground"
                        : "bg-transparent"
                )}
            >
                {item.title}
            </NavigationMenuLink>
        </NavigationMenuItem>
    );
};

const renderMobileMenuItem = (item: MenuItem, pathname: string) => {
    if (item.items) {
        return (
            <AccordionItem key={item.title} value={item.title} className="border-b-0">
                <AccordionTrigger className="text-md py-0 font-semibold hover:no-underline">
                    {item.title}
                </AccordionTrigger>
                <AccordionContent className="mt-2">
                    {item.items.map((subItem) => (
                        <SubMenuLink key={subItem.title} item={subItem} />
                    ))}
                </AccordionContent>
            </AccordionItem>
        );
    }

    return (
        <Link
            key={item.title}
            href={item.url}
            className={cn(
                "text-md font-semibold block py-2 px-3 rounded-md transition-colors",
                pathname.trim() === item.url.trim()
                    ? "bg-accent text-accent-foreground"
                    : "hover:bg-muted"
            )}
        >
            {item.title}
        </Link>
    );
};

const SubMenuLink = ({ item }: { item: MenuItem }) => {
    return (
        <Link
            className="hover:bg-muted hover:text-accent-foreground flex select-none flex-row gap-4 rounded-md p-3 leading-none no-underline outline-none transition-colors"
            href={item.url}
        >
            <div className="text-foreground">{item.icon}</div>
            <div>
                <div className="text-sm font-semibold">{item.title}</div>
                {item.description && (
                    <p className="text-muted-foreground text-sm leading-snug">
                        {item.description}
                    </p>
                )}
            </div>
        </Link>
    );
};

export default Navbar;
