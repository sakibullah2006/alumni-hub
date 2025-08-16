import Link from "next/link"
import { Instagram, Facebook, Twitter, Linkedin } from "lucide-react"

export function Footer() {
    return (
        <footer className="bg-background border-t border-border">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    {/* Brand Section */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 bg-primary rounded-md flex items-center justify-center">
                                <div className="w-4 h-4 bg-primary-foreground rounded-sm"></div>
                            </div>
                            <h3 className="text-xl font-semibold text-foreground font-sans">Alumni Hub</h3>
                        </div>
                        <p className="text-muted-foreground text-sm leading-relaxed mb-6 max-w-md">
                            A comprehensive platform connecting DSKM alumni, fostering professional networks, and building lasting
                            relationships within your academic community.
                        </p>
                        <div className="flex items-center gap-4">
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Instagram"
                            >
                                <Instagram className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Facebook"
                            >
                                <Facebook className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="Twitter"
                            >
                                <Twitter className="w-5 h-5" />
                            </Link>
                            <Link
                                href="#"
                                className="text-muted-foreground hover:text-foreground transition-colors"
                                aria-label="LinkedIn"
                            >
                                <Linkedin className="w-5 h-5" />
                            </Link>
                        </div>
                    </div>

                    {/* Product Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4 font-sans">Product</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Overview
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Directory
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Events
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Features
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Networking
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Mentorship
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Company Links */}
                    <div>
                        <h4 className="font-semibold text-foreground mb-4 font-sans">Company</h4>
                        <ul className="space-y-3">
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    About
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Team
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Blog
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Bottom Section */}
                <div className="border-t border-border mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span className="font-semibold text-foreground">Alumni Hub</span>
                        <span>© All rights reserved.</span>
                    </div>
                    <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <span>Made with</span>
                        <span className="text-red-500">❤️</span>
                        <span>by</span>
                        <Link href="#" className="font-semibold text-foreground hover:text-primary transition-colors">
                            @yourteam
                        </Link>
                    </div>
                </div>
            </div>
        </footer>
    )
}
