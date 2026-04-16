// src/app/(site)/_components/CategoryData.js

const categories = [
  {
    id: 1,
    name: "Mèo cảnh",
    slug: "meo-canh",
    image: "/images/categories/meo.jpg",
    parent_id: null,
    sort_order: 1,
    description: "Các giống mèo cảnh đẹp, thuần chủng",
    created_at: "2025-09-13",
    created_by: "admin",
    updated_at: "2025-09-13",
    updated_by: "admin",
    status: 1,
  },
  {
    id: 2,
    name: "Chó cảnh",
    slug: "cho-canh",
    image: "/images/categories/cho.jpg",
    parent_id: null,
    sort_order: 2,
    description: "Các giống chó cảnh dễ thương",
    created_at: "2025-09-13",
    created_by: "admin",
    updated_at: "2025-09-13",
    updated_by: "admin",
    status: 1,
  },
  // 👉 thêm danh mục khác
];

export default categories;
