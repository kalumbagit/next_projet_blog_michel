import CategoriesClient from "./CategoriesClient";
import { contentService } from "@/app/lib/contentService";

export default async function CategoriesPage() {

  const categories = await contentService.getCategories();

  return <CategoriesClient categoriesDatas={categories} />;
}
