import { wp } from "@/lib/wordpress";
import Image from "next/image";
import Link from "next/link";
import Edges from "./edges";

export default async function Navbar() {
  const menuItems = await wp.getMenuItems();
  const logo = await wp.getSiteLogo();
  const settings = await wp.getSettings();

  return (
    <header className="sticky top-0 z-50 w-full bg-white/95 backdrop-blur-sm border-b border-gray-200 shadow-sm">
      <Edges className="flex justify-between items-center py-4">
        {/* Logo Section */}
        <div className="flex-shrink-0">
          <Link
            href="/"
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <span className="sr-only">{settings.title}</span>
            {logo?.url ? (
              <Image
                alt={logo.alt || settings.title}
                className="h-8 w-auto sm:h-10"
                height={logo.height}
                priority
                src={logo.url}
                width={logo.width}
              />
            ) : (
              <span className="text-xl font-bold text-gray-900">
                {settings.title}
              </span>
            )}
          </Link>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {menuItems.map((item) => {
            try {
              const url = new URL(item.url);
              const path = url.pathname;

              return (
                <Link
                  key={item.id}
                  href={path}
                  className="relative px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900 transition-colors duration-200 group"
                >
                  {item.title.rendered}
                  {/* Hover underline effect */}
                  <span className="absolute inset-x-0 bottom-0 h-0.5 bg-gray-900 scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
                </Link>
              );
            } catch (error) {
              // Handle invalid URLs gracefully
              return (
                <Link
                  key={item.id}
                  href="#"
                  className="relative px-3 py-2 text-sm font-medium text-gray-500 cursor-not-allowed"
                >
                  {item.title.rendered}
                </Link>
              );
            }
          })}
        </nav>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            type="button"
            className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:text-gray-900 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-blue-500 transition-colors duration-200"
            aria-controls="mobile-menu"
            aria-expanded="false"
          >
            <span className="sr-only">Open main menu</span>
            {/* Hamburger icon */}
            <svg
              className="block h-6 w-6"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </Edges>

      {/* Mobile Menu (Hidden by default) */}
      <div className="md:hidden hidden" id="mobile-menu">
        <div className="px-2 pt-2 pb-3 space-y-1 bg-white border-t border-gray-200">
          {menuItems.map((item) => {
            try {
              const url = new URL(item.url);
              const path = url.pathname;

              return (
                <Link
                  key={item.id}
                  href={path}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 rounded-md transition-colors duration-200"
                >
                  {item.title.rendered}
                </Link>
              );
            } catch (error) {
              return (
                <Link
                  key={item.id}
                  href="#"
                  className="block px-3 py-2 text-base font-medium text-gray-500 cursor-not-allowed"
                >
                  {item.title.rendered}
                </Link>
              );
            }
          })}
        </div>
      </div>
    </header>
  );
}
