"use client";

import { WPMenuItem } from "@/lib/wordpress";
import Link from "next/link";

// Helper function to structure menu items into a tree
function structureMenuItems(menuItems: WPMenuItem[]): WPMenuItemWithChildren[] {
  // Create a map for easy lookup of child items
  const itemsById = new Map(
    menuItems.map((item) => [item.id, { ...item, childItems: [] }])
  );

  // The final structured menu items
  const structuredItems: WPMenuItemWithChildren[] = [];

  // Iterate over the menu items to structure them
  for (const item of menuItems) {
    const structuredItem = itemsById.get(item.id) as WPMenuItemWithChildren;

    if (item.parent === 0) {
      // This is a top-level menu item
      structuredItems.push(structuredItem);
    } else {
      // This item is a child of another item
      const parentItem = itemsById.get(item.parent) as
        | WPMenuItemWithChildren
        | undefined;
      if (parentItem) {
        parentItem.childItems.push(structuredItem);
      }
    }
  }

  return structuredItems;
}

// Extended interface with childItems
interface WPMenuItemWithChildren extends WPMenuItem {
  childItems: WPMenuItemWithChildren[];
}

export function DesktopMenu({
  menuItems,
  className,
}: {
  menuItems?: WPMenuItem[];
  className?: string;
}) {
  // Structure the menu items into a tree
  const structuredMenuItems = menuItems ? structureMenuItems(menuItems) : [];

  return (
    <nav className={`flex space-x-4 ${className || ""}`}>
      {structuredMenuItems?.map((menuItem) => {
        if (menuItem?.childItems && menuItem.childItems.length > 0) {
          return (
            <div key={menuItem.id} className="relative group">
              <button className="inline-flex items-center gap-x-1 px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900">
                <span>{menuItem.title.rendered}</span>
                <span aria-hidden="true" className="text-xs">
                  ▼
                </span>
              </button>

              <div className="absolute left-0 z-10 hidden group-hover:block mt-1 w-48 bg-white border border-gray-200 rounded-md shadow-lg">
                {menuItem.childItems.map((childItem) => {
                  return (
                    <Link
                      key={childItem.id}
                      className="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                      href={childItem.url || "#"}
                      target={childItem.target || "_self"}
                    >
                      {childItem.title.rendered}
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        }

        return (
          <Link
            href={menuItem.url || "#"}
            key={menuItem.id}
            className="px-3 py-2 text-sm font-medium text-gray-700 hover:text-gray-900"
            target={menuItem.target || "_self"}
          >
            {menuItem.title.rendered}
          </Link>
        );
      })}
    </nav>
  );
}
