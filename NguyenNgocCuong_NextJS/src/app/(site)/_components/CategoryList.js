"use client";

import Image from "next/image";
import Link from "next/link";
import categories from "./CategoryData";

export default function CategoryList() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-6 py-8">
      {categories.map((cat) => (
        <Link
          key={cat.id}
          href={`/category/${cat.slug}`}
          className="group relative rounded-2xl overflow-hidden shadow-lg hover:shadow-2xl transition"
        >
          <Image
            src={cat.image}
            alt={cat.name}
            width={400}
            height={300}
            className="w-full h-40 object-cover group-hover:scale-110 transition duration-500"
          />
          <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
            <h3 className="text-white font-bold text-lg">{cat.name}</h3>
          </div>
        </Link>
      ))}
    </div>
  );
}
