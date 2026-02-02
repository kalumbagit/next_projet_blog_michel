import { sql } from "@/app/lib/config";
import { appData } from "@/app/lib/data"; // si tu as séparé les données

export async function initDatabase(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    // ===============================
    // 1️⃣ TABLE PROFILE
    // ===============================
    await sql`
      create table if not exists profiles (
        id text primary key,
        first_name text not null,
        last_name text not null,
        title text not null,
        bio text not null,
        image_url text,
        formations jsonb default '[]',
        motivations jsonb default '[]',
        social_links jsonb,
        created_at timestamptz default now()
      )
    `;

    // ===============================
    // 2️⃣ TABLE CATEGORIES
    // ===============================
    await sql`
      create table if not exists categories (
        id text primary key,
        label text not null,
        description text,
        icon text
      )
    `;

    // ===============================
    // 3️⃣ TABLE CONTENTS
    // ===============================
    await sql`
      create table if not exists contents (
        id text primary key,
        title text not null,
        description text,
        type text not null,
        category text references categories(id) on delete set null,
        media_url text,
        thumbnail_url text,
        transcription text,
        text_content text,
        duration text,
        published_at date,
        tags jsonb default '[]',
        created_at timestamptz default now()
      )
    `;

    // ===============================
    // 4️⃣ INSERT PROFILE
    // ===============================
    const p = appData.profile;

    await sql`
      insert into profiles (
        id,
        first_name,
        last_name,
        title,
        bio,
        image_url,
        formations,
        motivations,
        social_links
      )
      values (
        ${p.id},
        ${p.firstName},
        ${p.lastName},
        ${p.title},
        ${p.bio},
        ${p.imageUrl},
        ${JSON.stringify(p.formations)},
        ${JSON.stringify(p.motivations)},
        ${JSON.stringify(p.socialLinks)}
      )
      on conflict (id) do nothing
    `;

    // ===============================
    // 5️⃣ INSERT CATEGORIES
    // ===============================
    for (const c of appData.categories) {
      await sql`
        insert into categories (id, label, description, icon)
        values (
          ${c.id},
          ${c.label},
          ${c.description},
          ${c.icon}
        )
        on conflict (id) do nothing
      `;
    }

    // ===============================
    // 6️⃣ INSERT CONTENTS
    // ===============================
    for (const content of appData.contents) {
      await sql`
        insert into contents (
          id,
          title,
          description,
          type,
          category,
          media_url,
          thumbnail_url,
          transcription,
          text_content,
          duration,
          published_at,
          tags
        )
        values (
          ${content.id},
          ${content.title},
          ${content.description},
          ${content.type},
          ${content.category},
          ${content.mediaUrl ?? null},
          ${content.thumbnailUrl ?? null},
          ${content.transcription ?? null},
          ${content.textContent ?? null},
          ${content.duration ?? null},
          ${content.publishedAt},
          ${JSON.stringify(content.tags ?? [])}
        )
        on conflict (id) do nothing
      `;
    }

    return {
      success: true,
      message: "✅ Base de données initialisée avec succès",
    };
  } catch (error) {
    console.error("❌ INIT DATABASE ERROR:", error);

    return {
      success: false,
      message: `❌ Erreur lors de l'initialisation de la base de données :  ${error} : l'url complete ${process.env.POSTGRES_URL}`,
    };
  }
}
