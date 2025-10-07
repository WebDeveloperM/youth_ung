import React from 'react';
import { FaInstagram, FaLinkedin, FaXTwitter } from 'react-icons/fa6';

const Footer = () => {
  const partnerLinks = [
    { name: 'BNPZ', href: '#' },
    { name: 'GTL', href: '#' },
    { name: 'MGNK', href: '#' },
  ];

  const projectLinks = [
    { name: "Yoshlar siyosati", href: '#' },
  ];
  
  const contactLinks = [
    { name: 'Contact', href: '#' },
    { name: 'Support', href: '#' },
    { name: 'Legal', href: '#' },
  ];

  return (
    <footer className="bg-gray-50 text-gray-700 py-16 border-t border-gray-200" role="contentinfo">
      <div className="container mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
        {/* Company Info & Socials */}
        <div className="flex flex-col space-y-4 lg:col-span-1">
          <h3 className="font-bold text-4xl text-[var(--navy-blue)]">UZBEKNEFTGAZ</h3>
          <p className="text-gray-600 text-sm max-w-xs">To'liq rekvizit</p>
          <div className="flex space-x-5 text-gray-500 mt-4">
            <a href="#" className="hover:text-gray-800 transition-colors" aria-label="O'zbekneftgaz Instagram sahifasi">
              <FaInstagram size={22} />
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors" aria-label="O'zbekneftgaz LinkedIn sahifasi">
              <FaLinkedin size={22} />
            </a>
            <a href="#" className="hover:text-gray-800 transition-colors" aria-label="O'zbekneftgaz X Twitter sahifasi">
              <FaXTwitter size={22} />
            </a>
          </div>
        </div>

        {/* Navigation Sections */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 md:col-span-1 lg:col-span-3">
          <nav aria-label="Bizning hamkorlar">
            <h4 className="font-semibold text-gray-800 mb-4">Bizning hamkorlar</h4>
            <ul className="space-y-3 text-sm">
              {/* Ma'lumotlar dinamik ravishda render qilinadi */}
              {partnerLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-blue-600 transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          
          <nav aria-label="Loyihalarimiz">
            <h4 className="font-semibold text-gray-800 mb-4">Loyihalarimiz</h4>
            <ul className="space-y-3 text-sm">
              {projectLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-blue-600 transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </nav>
          
          <nav aria-label="Murojat">
            <h4 className="font-semibold text-gray-800 mb-4">Murojat</h4>
            <ul className="space-y-3 text-sm">
              {contactLinks.map((link) => (
                <li key={link.name}>
                  <a href={link.href} className="hover:text-blue-600 transition-colors">{link.name}</a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="container mx-auto px-6 mt-16 text-center text-gray-500 text-xs">
        <p>
          &copy; {new Date().getFullYear()} UZBEKNEFTGAZ. Barcha huquqlar himoyalangan.
        </p>
      </div>
    </footer>
  );
};

export default Footer;