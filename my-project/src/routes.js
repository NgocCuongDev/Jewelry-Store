/**
 * Application Routes Configuration
 *
 * Defines all protected routes in the application using React lazy loading
 * for code splitting and performance optimization.
 *
 * Each route object contains:
 * - path: URL path for the route
 * - name: Human-readable name for breadcrumbs
 * - element: Lazy-loaded React component
 * - exact: (optional) Requires exact path match
 *
 * @module routes
 */

import React from 'react'

// Dashboard
const Dashboard = React.lazy(() => import('./views/dashboard/Dashboard'))
const Products = React.lazy(() => import('./views/products/Products'))
const Recommendations = React.lazy(() => import('./views/recommendations/Recommendations'))
const Orders = React.lazy(() => import('./views/orders/Orders'))
const Shipping = React.lazy(() => import('./views/shipping/Shipping'))
const Payments = React.lazy(() => import('./views/payments/Payments'))
const Users = React.lazy(() => import('./views/users/Users'))
const Profile = React.lazy(() => import('./views/profile/Profile'))
const Categories = React.lazy(() => import('./views/categories/Categories'))
const Menus = React.lazy(() => import('./views/menus/Menus'))
const Banners = React.lazy(() => import('./views/banners/Banners'))
const Posts = React.lazy(() => import('./views/posts/Posts'))



/**
 * Array of route configuration objects
 *
 * @type {Array<Object>}
 * @property {string} path - URL path pattern
 * @property {string} name - Display name for breadcrumbs and navigation
 * @property {React.LazyExoticComponent} element - Lazy-loaded component
 * @property {boolean} [exact] - Whether to match path exactly
 *
 * @example
 * // Route renders when URL matches '/dashboard'
 * { path: '/dashboard', name: 'Dashboard', element: Dashboard }
 *
 * @example
 * // Route with exact match required
 * { path: '/base', name: 'Base', element: Cards, exact: true }
 */
const routes = [
  { path: '/', exact: true, name: 'Trang chủ' },
  { path: '/dashboard', name: 'Trang chủ', element: Dashboard },
  { path: '/products', name: 'Quản lý sản phẩm', element: Products },
  { path: '/recommendations', name: 'Quản lý gợi ý', element: Recommendations },
  { path: '/orders', name: 'Quản lý đơn hàng', element: Orders },
  { path: '/shipping', name: 'Quản lý vận chuyển', element: Shipping },
  { path: '/payments', name: 'Quản lý thanh toán', element: Payments },
  { path: '/users', name: 'Quản lý người dùng', element: Users },
  { path: '/profile', name: 'Profile', element: Profile },
  { path: '/categories', name: 'Quản lý danh mục', element: Categories },
  { path: '/menus', name: 'Quản lý menu', element: Menus },
  { path: '/banners', name: 'Quản lý banner', element: Banners },
  { path: '/posts', name: 'Quản lý bài viết', element: Posts },
]


export default routes

