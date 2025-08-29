// src/components/sections/Footer.tsx
"use client";

import { Facebook, Instagram, Youtube, Fish } from 'lucide-react';
import { content } from '@/lib/content';
import Link from 'next/link';

// Hapus referensi ke 'lang' karena sudah single-language
// import { Language } from '@/app/page';

// Hapus props 'lang' dari definisi komponen
const Footer = () => {
    // Ambil data langsung dari objek content
    const sectionContent = content.footer;
    const navContent = content.nav;

    // Definisikan link navigasi secara eksplisit agar sesuai dengan struktur multi-halaman
    const quickLinks = [
        { href: '/about', label: navContent.about },
        { href: '/packages', label: 'Packages' },
        { href: '/testimonials', label: navContent.testimonials },
        { href: '/contact', label: 'Contact' },
    ];

    return (
        <footer className="bg-dark-navy pt-20 pb-8 w-full">
            <div className="container mx-auto px-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-left">
                    
                    {/* Kolom 1: Logo, Deskripsi, dan Ikon Sosial Media */}
                    <div className="space-y-4">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="flex items-center gap-1">
                                <span className="text-2xl font-black text-white">MENJANGAN</span>
                                <Fish className="w-6 h-6 text-bright-blue transform -rotate-45" />
                                <span className="text-2xl font-black text-white">SCUBA</span>
                            </div>
                        </Link>
                        <p className="text-slate">{sectionContent.description}</p>
                        <div className="flex space-x-4 pt-4">
                            <a href="#" aria-label="Facebook" className="text-slate p-2 rounded-full hover:bg-navy hover:text-bright-blue transition-colors">
                                <Facebook size={24} />
                            </a>
                            <a href="#" aria-label="Instagram" className="text-slate p-2 rounded-full hover:bg-navy hover:text-bright-blue transition-colors">
                                <Instagram size={24} />
                            </a>
                            <a href="#" aria-label="Youtube" className="text-slate p-2 rounded-full hover:bg-navy hover:text-bright-blue transition-colors">
                                <Youtube size={24} />
                            </a>
                        </div>
                    </div>

                    {/* Kolom 2: Quick Links */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-4">{sectionContent.quickLinksTitle}</h4>
                        <ul className="space-y-3">
                            {quickLinks.map(link => (
                                <li key={link.href}>
                                    <a href={link.href} className="text-slate hover:text-bright-blue transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 3: Services */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-4">{sectionContent.servicesTitle}</h4>
                        <ul className="space-y-3">
                            {sectionContent.services.map((service, index) => (
                                <li key={index}>
                                    <span className="text-slate">{service}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Kolom 4: Contact Us */}
                    <div>
                        <h4 className="font-bold text-white text-lg mb-4">{sectionContent.contactTitle}</h4>
                        <ul className="space-y-3 text-slate">
                            <li>{sectionContent.contactInfo.phone}</li>
                            <li>{sectionContent.contactInfo.email}</li>
                            <li>{sectionContent.contactInfo.address}</li>
                        </ul>
                    </div>
                </div>

                {/* Garis Pemisah dan Copyright */}
                <div className="mt-16 border-t border-light-navy/20 pt-8 flex flex-col md:flex-row justify-between items-center text-center text-sm text-slate">
                    <p>{sectionContent.copyright}</p>
                    <div className="mt-4 md:mt-0">
                        <a href="/privacy-policy" className="hover:text-bright-blue transition-colors">{sectionContent.privacy}</a>
                        <span className="mx-2">|</span>
                        <a href="/terms-of-service" className="hover:text-bright-blue transition-colors">{sectionContent.terms}</a>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;