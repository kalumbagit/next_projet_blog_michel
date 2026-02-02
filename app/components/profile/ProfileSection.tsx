import Image from "next/image";
import { Mail, Twitter, Linkedin, GraduationCap, Target } from "lucide-react";
import { contentService } from "@/app/lib/contentService";

export async function ProfileSection() {
  const profile = await contentService.getProfile();

  const formations = Array.isArray(profile.formations)
  ? profile.formations
  : typeof profile.formations === "string"
    ? JSON.parse(profile.formations)
    : [];

  const motivations= Array.isArray(profile.motivations) ? profile.motivations: typeof profile.motivations==="string" ? JSON.parse(profile.motivations) : [];

  const socialLinks= Array.isArray(profile.socialLinks) ? profile.socialLinks: typeof profile.socialLinks==="string" ? JSON.parse(profile.socialLinks) : [];

    

  return (
    <section className="relative overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0b0d11] to-[#08090b] opacity-50" />

      <div className="relative max-w-7xl mx-auto px-4 py-16 md:py-24">
        <div className="flex flex-col lg:flex-row gap-12 items-center lg:items-start">
          {/* Profile Image */}
          <div className="relative">
            <div className="w-40 h-40 md:w-52 md:h-52 rounded-full overflow-hidden border-4 border-yellow-500/30 shadow-[0_0_40px_rgba(245,200,60,0.15)] relative">
              <Image
                src={profile.imageUrl}
                alt={`${profile.firstName} ${profile.lastName}`}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 208px"
              />
            </div>
            <div className="absolute -bottom-2 -right-2 w-12 h-12 bg-yellow-500 rounded-full flex items-center justify-center shadow-lg">
              <span className="text-xl">🎙️</span>
            </div>
          </div>

          {/* Profile Info */}
          <div className="flex-1 text-center lg:text-left">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-yellow-500 to-yellow-400">
              {profile.firstName}{" "}
              <span className="text-white">{profile.lastName}</span>
            </h1>

            <p className="text-xl md:text-2xl text-gray-400 font-light mb-6">
              {profile.title}
            </p>

            <p className="text-lg text-white/80 max-w-2xl mb-8 leading-relaxed">
              {profile.bio}
            </p>

            {/* Social Links */}
            <div className="flex gap-4 justify-center lg:justify-start mb-10">
              {socialLinks?.twitter && (
                <a
                  href={socialLinks.twitter}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800 hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg"
                >
                  <Twitter className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.linkedin && (
                <a
                  href={socialLinks.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-3 rounded-full bg-gray-800 hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              )}
              {socialLinks?.email && (
                <a
                  href={`mailto:${socialLinks.email}`}
                  className="p-3 rounded-full bg-gray-800 hover:bg-yellow-500 hover:text-black transition-all duration-300 shadow-lg"
                >
                  <Mail className="w-5 h-5" />
                </a>
              )}
            </div>

            {/* Formations & Motivations */}
            <div className="grid md:grid-cols-2 gap-8">
              <div className="p-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <GraduationCap className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Formations
                  </h3>
                </div>
                <ul className="space-y-2">
                  {formations.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (f: any, i: number) => (
                    <li
                      key={i}
                      className="text-sm text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-yellow-500 mt-1">•</span> {f}
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-6 rounded-xl border border-gray-700 bg-gradient-to-br from-gray-900 to-gray-800 shadow-lg">
                <div className="flex items-center gap-3 mb-4">
                  <Target className="w-6 h-6 text-yellow-500" />
                  <h3 className="text-lg font-serif font-semibold text-white">
                    Motivations
                  </h3>
                </div>
                <ul className="space-y-2">
                  {motivations.map(
                    // eslint-disable-next-line @typescript-eslint/no-explicit-any
                    (m : any, i:number) => (
                    <li
                      key={i}
                      className="text-sm text-gray-400 flex items-start gap-2"
                    >
                      <span className="text-yellow-500 mt-1">•</span> {m}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
