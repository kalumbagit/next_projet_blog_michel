// app/components/ProfileCardServer.tsx
import Link from "next/link";
import { contentService } from "@/app/lib/contentService";

type SocialLinks = {
  twitter?: string;
  linkedin?: string;
  email?: string;
};

export default async function ProfileCardServer() {
  const profile = await contentService.getProfile();
  function normalizeArray(value: unknown): string[] {
    if (Array.isArray(value)) return value;

    if (typeof value === "string") {
      try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed : [];
      } catch {
        return [];
      }
    }

    return [];
  }

  let socialLinks: SocialLinks = {};

  if (typeof profile.socialLinks === "string") {
    try {
      socialLinks = JSON.parse(profile.socialLinks) as SocialLinks;
    } catch {
      socialLinks = {};
    }
  } else if (
    typeof profile.socialLinks === "object" &&
    profile.socialLinks !== null
  ) {
    socialLinks = profile.socialLinks;
  }

  return (
    <div className="bg-slate-900/50 backdrop-blur-xl border border-slate-800/50 rounded-2xl overflow-hidden p-6 max-w-4xl mx-auto">
      {/* Banner */}
      <div className="h-48 bg-gradient-to-r from-amber-500/20 via-orange-500/20 to-rose-500/20 relative">
        {profile.imageUrl && (
          <img
            src={"/lib/routes/profil"}
            alt={`${profile.firstName} ${profile.lastName}`}
            className="absolute inset-0 w-full h-full object-cover opacity-30"
          />
        )}
      </div>

      <div className="px-8 pb-8">
        {/* Profile Image & Name */}
        <div className="flex items-end gap-6 -mt-20 mb-6">
          <div className="relative">
            <div className="w-36 h-36 bg-gradient-to-br from-amber-500 to-rose-500 rounded-2xl flex items-center justify-center text-6xl font-bold text-white shadow-2xl">
              {profile.firstName[0]}
              {profile.lastName[0]}
            </div>
          </div>

          <div className="flex-1 pb-4">
            <h2 className="text-3xl font-bold text-white mb-1">
              {profile.firstName} {profile.lastName}
            </h2>
            <p className="text-amber-400 text-lg font-medium">
              {profile.title}
            </p>
          </div>

          {/* Bouton Modifier */}
          <div className="flex-shrink-0">
            <Link
              href={`/admin/profil/edit`}
              className="flex items-center gap-2 px-6 py-3 bg-amber-500 text-white rounded-xl hover:shadow-lg transition-all"
            >
              Modifier
            </Link>
          </div>
        </div>

        {/* Bio */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-3 text-lg">Biographie</h3>
          <p className="text-slate-300 leading-relaxed">{profile.bio}</p>
        </div>

        {/* Formations */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-lg">Formations</h3>
          <div className="space-y-3">
            {normalizeArray(profile.formations).map((formation, index) => (
              <div
                key={index}
                className="flex items-center gap-3 px-4 py-3 bg-slate-800/50 rounded-lg border border-slate-700/50"
              >
                <div className="w-2 h-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-full" />
                <span className="text-slate-300">{formation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Motivations */}
        <div className="mb-8">
          <h3 className="text-white font-semibold mb-4 text-lg">Motivations</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {normalizeArray(profile.motivations).map((motivation, index) => (
              <div
                key={index}
                className="flex items-start gap-3 px-4 py-3 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-lg border border-purple-500/20"
              >
                <div className="w-6 h-6 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold flex-shrink-0 mt-0.5">
                  {index + 1}
                </div>
                <span className="text-slate-300">{motivation}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Liens sociaux */}
        <div>
          <h3 className="text-white font-semibold mb-4 text-lg">
            Liens sociaux
          </h3>
          <div className="flex gap-4 flex-wrap">
            {socialLinks?.twitter && (
              <a
                href={socialLinks.twitter}
                className="flex items-center gap-2 px-6 py-3 bg-blue-500/20 text-blue-400 rounded-lg hover:bg-blue-500/30 transition-all duration-300 border border-blue-500/30"
              >
                <span className="font-medium">Twitter</span>
              </a>
            )}
            {socialLinks?.linkedin && (
              <a
                href={socialLinks.linkedin}
                className="flex items-center gap-2 px-6 py-3 bg-blue-600/20 text-blue-400 rounded-lg hover:bg-blue-600/30 transition-all duration-300 border border-blue-600/30"
              >
                <span className="font-medium">LinkedIn</span>
              </a>
            )}
            {socialLinks?.email && (
              <a
                href={`mailto:${socialLinks.email}`}
                className="flex items-center gap-2 px-6 py-3 bg-emerald-500/20 text-emerald-400 rounded-lg hover:bg-emerald-500/30 transition-all duration-300 border border-emerald-500/30"
              >
                <span className="font-medium">Email</span>
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
