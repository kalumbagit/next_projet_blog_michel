import { contentService } from "@/app/lib/contentService";
import ContenusClient from "./ContenusClient";

export default async function ContenusPage() {
  const contents = await contentService.getContents();
  const categories = await contentService.getCategories();

  return <ContenusClient initialContents={contents} categories={categories} />;
}
