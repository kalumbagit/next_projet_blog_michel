import EditProfileForm from "../editProfilForm";
import { contentService } from "@/app/lib/contentService";

export default async function EditProfilePage() {
  const profile = await contentService.getProfile();

  return <EditProfileForm profile={profile} />;
}
