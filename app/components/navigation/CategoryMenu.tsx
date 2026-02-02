import { CategoryInfo, Category } from "@/app/lib/index";
import { motion } from "framer-motion";
import { clsx } from "clsx";

interface CategoryMenuProps {
  categories: CategoryInfo[];
  selectedCategory: Category | null;
  onSelectCategory: (category: Category | null) => void;
}

export function CategoryMenu({
  categories,
  selectedCategory,
  onSelectCategory,
}: CategoryMenuProps) {
  return (
    <nav className="sticky top-0 z-50 bg-gray-900/80 backdrop-blur-md border-b border-gray-700">
      <div className="container mx-auto px-4">
        <div className="flex items-center gap-2 py-4 overflow-x-auto scrollbar-none">
          {/* All button */}
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelectCategory(null)}
            className={clsx(
              "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap",
              selectedCategory === null
                ? "bg-yellow-500 text-gray-900 shadow-lg"
                : "bg-gray-700 text-gray-200 hover:bg-gray-600",
            )}
          >
            Tout voir
          </motion.button>

          {/* Category buttons */}
          {categories.map((category, index) => (
            <motion.button
              key={category.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.05 }}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => onSelectCategory(category.id)}
              className={clsx(
                "px-5 py-2.5 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap flex items-center gap-2",
                selectedCategory === category.id
                  ? "bg-yellow-500 text-gray-900 shadow-lg"
                  : "bg-gray-700 text-gray-200 hover:bg-gray-600",
              )}
            >
              {category.icon && <span>{category.icon}</span>}
              <span>{category.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </nav>
  );
}
