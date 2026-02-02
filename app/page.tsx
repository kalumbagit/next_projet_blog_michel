import { HomePage } from "@/app/(home)/page";
import { HomeLayout } from "@/app/(home)/layout";

export default function HomeRoute() {
  return (
    <HomeLayout>
      <HomePage />
    </HomeLayout>
  );
}
