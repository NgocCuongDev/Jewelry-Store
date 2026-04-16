// app/(site)/_components/DynamicMenu.js
"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { useMenu } from '../context/MenuContext';
import { ChevronDown, ChevronRight, RefreshCw } from 'lucide-react';

const DynamicMenu = ({ variant = 'desktop', onItemClick }) => {
  const { menus, loading, error, refreshMenus } = useMenu();

  if (loading) {
    return (
      <div className={`flex ${variant === 'desktop' ? 'items-center justify-center flex-wrap gap-6' : 'flex-col'} py-3`}>
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className={`bg-gray-200 animate-pulse rounded ${
              variant === 'desktop' ? 'h-6 w-20' : 'h-8 w-full mb-2'
            }`}
          />
        ))}
      </div>
    );
  }

  if (error && variant === 'desktop') {
    return (
      <div className="text-center py-3">
        <div className="text-red-600 text-sm mb-2">{error}</div>
        <button
          onClick={refreshMenus}
          className="text-green-600 hover:text-green-800 text-sm flex items-center gap-1 mx-auto"
        >
          <RefreshCw size={14} />
          Thử lại
        </button>
      </div>
    );
  }

  if (!menus || menus.length === 0) {
    return (
      <div className="text-center py-3 text-yellow-600 text-sm">
        Không có menu để hiển thị
      </div>
    );
  }

  return (
    <>
      {variant === 'desktop' ? (
        <DesktopMenu menus={menus} onItemClick={onItemClick} />
      ) : (
        <MobileMenu menus={menus} onItemClick={onItemClick} />
      )}
    </>
  );
};

// Desktop Menu Component - Thiết kế đẹp hơn
const DesktopMenu = ({ menus, onItemClick }) => {
  const [activeDropdown, setActiveDropdown] = useState(null);

  const handleMouseEnter = (menuId) => {
    setActiveDropdown(menuId);
  };

  const handleMouseLeave = () => {
    setActiveDropdown(null);
  };

  const handleItemClick = (menu) => {
    if (onItemClick) onItemClick();
    setActiveDropdown(null);
  };

  return (
    <div className="max-w-7xl mx-auto flex items-center justify-center flex-wrap gap-6 py-3 px-6 text-sm font-semibold uppercase tracking-wide">
      {menus.map((menu) => (
        <div
          key={menu.id}
          className="relative group"
          onMouseEnter={() => handleMouseEnter(menu.id)}
          onMouseLeave={handleMouseLeave}
        >
          {menu.children.length > 0 ? (
            <>
              <button className="flex items-center gap-1 px-3 py-1.5 rounded-lg hover:bg-green-100/80 text-green-900 hover:text-green-700 transition">
                {menu.name}
                <ChevronDown className="w-4 h-4 transition-transform group-hover:rotate-180" />
              </button>
              
              <div className="absolute left-0 top-full mt-1 w-48 bg-white shadow-xl rounded-xl overflow-hidden border border-green-100 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-200 z-50">
                {menu.children.map((child) => (
                  <MenuLink
                    key={child.id}
                    menu={child}
                    onClick={handleItemClick}
                    className="block px-4 py-2 text-green-800 hover:bg-green-50 hover:text-green-700 transition"
                  />
                ))}
              </div>
            </>
          ) : (
            <MenuLink
              menu={menu}
              onClick={handleItemClick}
              className="relative px-3 py-1.5 rounded-lg hover:bg-green-100/80 text-green-900 hover:text-green-700 transition group"
            >
              {menu.name}
              <span className="absolute left-0 -bottom-1 w-0 h-0.5 bg-green-600 transition-all group-hover:w-full"></span>
            </MenuLink>
          )}
        </div>
      ))}
    </div>
  );
};

// Mobile Menu Component - Thiết kế đẹp hơn
const MobileMenu = ({ menus, onItemClick }) => {
  const [expandedMenus, setExpandedMenus] = useState({});

  const toggleSubmenu = (menuId) => {
    setExpandedMenus(prev => ({
      ...prev,
      [menuId]: !prev[menuId]
    }));
  };

  const handleItemClick = (menu) => {
    if (onItemClick) onItemClick();
    if (menu.children.length > 0) {
      toggleSubmenu(menu.id);
    }
  };

  const renderMobileMenu = (menuList, level = 0) => {
    return menuList.map((menu) => (
      <div key={menu.id} className="w-full">
        <div className="flex justify-between items-center">
          <MenuLink
            menu={menu}
            onClick={() => handleItemClick(menu)}
            className={`flex-1 px-3 py-2 text-green-900 font-semibold hover:bg-green-50 rounded-lg transition ${
              level > 0 ? 'text-sm font-normal pl-6' : ''
            }`}
          />
          
          {menu.children.length > 0 && (
            <button
              onClick={() => toggleSubmenu(menu.id)}
              className="p-2 hover:bg-green-50 rounded-lg transition"
            >
              <ChevronRight
                className={`w-4 h-4 transition-transform ${
                  expandedMenus[menu.id] ? 'rotate-90' : ''
                }`}
              />
            </button>
          )}
        </div>

        {menu.children.length > 0 && expandedMenus[menu.id] && (
          <div className={`${level > 0 ? 'ml-6' : 'ml-4'} border-l-2 border-green-100`}>
            {renderMobileMenu(menu.children, level + 1)}
          </div>
        )}
      </div>
    ));
  };

  return (
    <nav className="flex flex-col space-y-1">
      {renderMobileMenu(menus)}
    </nav>
  );
};

// Component cho Menu Link
const MenuLink = ({ menu, onClick, className, children }) => {
  const handleClick = (e) => {
    if (menu.children.length === 0 && onClick) {
      onClick(menu);
    }
  };

  const linkProps = menu.children.length > 0 ? {} : {
    href: menu.link || '#',
    onClick: handleClick
  };

  return (
    <Link
      {...linkProps}
      className={className}
    >
      {children || menu.name}
    </Link>
  );
};

export default DynamicMenu;