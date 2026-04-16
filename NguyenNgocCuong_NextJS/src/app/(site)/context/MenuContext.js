// app/(site)/context/MenuContext.js
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { getMenus } from '../api/apiMenu';

const MenuContext = createContext();

export const useMenu = () => {
    const context = useContext(MenuContext);
    if (!context) {
        throw new Error('useMenu must be used within a MenuProvider');
    }
    return context;
};

export const MenuProvider = ({ children }) => {
    const [menus, setMenus] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchMenus = async () => {
        try {
            setLoading(true);
            setError(null);

            console.log('🔄 Starting to fetch menus...');
            const response = await getMenus();
            console.log('📦 Raw API response:', response);

            let menuData = [];

            if (response.success && response.data) {
                menuData = response.data;
            } else if (Array.isArray(response)) {
                menuData = response;
            } else if (response.data) {
                menuData = response.data;
            }

            console.log('📋 Menu data to format:', menuData);

            // Format dữ liệu menu thành cấu trúc phù hợp
            const formattedMenus = formatMenuData(menuData);
            console.log('🎯 Formatted menus:', formattedMenus);

            setMenus(formattedMenus);

        } catch (err) {
            console.error('❌ Error in fetchMenus:', err);
            setError('Không thể tải menu: ' + (err.message || 'Lỗi không xác định'));

            // Set menu mặc định
            const defaultMenus = getDefaultMenus();
            console.log('🔄 Using default menus:', defaultMenus);
            setMenus(defaultMenus);
        } finally {
            setLoading(false);
        }
    };

    const formatMenuData = (menuData) => {
        if (!menuData || !Array.isArray(menuData) || menuData.length === 0) {
            console.log('⚠️ No menu data found, using default');
            return getDefaultMenus();
        }

        console.log('🔧 Formatting menu data:', menuData);

        // Nhóm menu theo parent_id và sắp xếp theo sort_order
        const menuMap = {};
        const rootMenus = [];

        // Sắp xếp menu theo sort_order
        const sortedMenus = menuData.sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0));
        console.log('📊 Sorted menus:', sortedMenus);

        // Tạo map cho dễ truy cập - TẤT CẢ menu đều được thêm vào map
        sortedMenus.forEach(menu => {
            if (menu.status !== 0) { // Chỉ lấy menu có status = 1 (active)
                menuMap[menu.id] = { ...menu, children: [] };
            }
        });

        console.log('🗺️ Menu map:', menuMap);

        // Xây dựng cây menu - FIX: xử lý parent_id không hợp lệ
        sortedMenus.forEach(menu => {
            if (menu.status === 0) return; // Bỏ qua menu không active

            const parentId = menu.parent_id || 0;

            // FIX: Nếu parent_id trỏ đến chính nó hoặc không tồn tại, coi như menu gốc
            if (parentId === 0 || parentId === menu.id || !menuMap[parentId]) {
                // Menu gốc
                if (menuMap[menu.id]) {
                    rootMenus.push(menuMap[menu.id]);
                }
            } else if (menuMap[parentId]) {
                // Menu con
                menuMap[parentId].children.push(menuMap[menu.id]);
            }
        });

        console.log('🌳 Root menus structure:', rootMenus);
        return rootMenus;
    };
    // Menu mặc định nếu API fail
    const getDefaultMenus = () => {
        return [
            {
                id: 1,
                name: "Trang chủ",
                link: "/",
                type: "custom",
                children: []
            },
            {
                id: 2,
                name: "Sản phẩm",
                link: "/products",
                type: "custom",
                children: [
                    {
                        id: 3,
                        name: "Tất cả sản phẩm",
                        link: "/products",
                        type: "custom"
                    }
                ]
            },
            {
                id: 4,
                name: "Tin tức",
                link: "/blog",
                type: "custom",
                children: []
            },
            {
                id: 5,
                name: "Liên hệ",
                link: "/lien-he",
                type: "custom",
                children: []
            }
        ];
    };

    useEffect(() => {
        fetchMenus();
    }, []);

    const refreshMenus = () => {
        fetchMenus();
    };

    return (
        <MenuContext.Provider value={{
            menus,
            loading,
            error,
            refreshMenus
        }}>
            {children}
        </MenuContext.Provider>
    );
};