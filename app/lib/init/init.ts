import { sql } from "@/app/lib/config";
import { appData } from "@/app/lib/data";

export async function initDatabase(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log("🚀 Initialisation de la base de données...");

    // Désactiver les notices PostgreSQL temporairement
    await sql`SET client_min_messages TO WARNING`;

    // ===============================
    // 1️⃣ TABLE PROFILES
    // ===============================
    console.log("📦 Création de la table profiles...");
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
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      )
    `;

    // Ajouter les colonnes manquantes si elles n'existent pas
    await sql`
      alter table profiles 
      add column if not exists created_at timestamptz default now()
    `;
    
    await sql`
      alter table profiles 
      add column if not exists updated_at timestamptz default now()
    `;

    // ===============================
    // 2️⃣ TABLE CATEGORIES
    // ===============================
    console.log("📦 Création de la table categories...");
    await sql`
      create table if not exists categories (
        id text primary key,
        label text not null,
        description text,
        icon text,
        created_at timestamptz default now()
      )
    `;

    // ===============================
    // 3️⃣ TABLE CONTENTS
    // ===============================
    console.log("📦 Création de la table contents...");
    await sql`
      create table if not exists contents (
        id text primary key,
        title text not null,
        description text,
        type text not null check (type in ('video', 'audio', 'text')),
        category text references categories(id) on delete set null,
        media_url text,
        thumbnail_url text,
        transcription text,
        text_content text,
        duration text,
        published_at date,
        tags jsonb default '[]',
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      )
    `;

    // Ajouter les colonnes manquantes si elles n'existent pas
    await sql`
      alter table contents 
      add column if not exists created_at timestamptz default now()
    `;
    
    await sql`
      alter table contents 
      add column if not exists updated_at timestamptz default now()
    `;

    // ===============================
    // 4️⃣ TABLE CONTENT_VIEWS
    // ===============================
    console.log("📦 Création de la table content_views...");
    await sql`
      create table if not exists content_views (
        content_id text primary key references contents(id) on delete cascade,
        views integer not null default 0,
        created_at timestamptz default now(),
        updated_at timestamptz default now()
      )
    `;

    // Ajouter les colonnes manquantes si elles n'existent pas
    await sql`
      alter table content_views 
      add column if not exists created_at timestamptz default now()
    `;
    
    await sql`
      alter table content_views 
      add column if not exists updated_at timestamptz default now()
    `;

    // ===============================
    // 5️⃣ TABLE VISITOR_SESSIONS
    // ===============================
    console.log("📦 Création de la table visitor_sessions...");
    await sql`
      create table if not exists visitor_sessions (
        id serial primary key,
        visitor_id text not null,
        metadata jsonb default '{}',
        created_at timestamptz default now()
      )
    `;

    // ===============================
    // 6️⃣ CRÉATION DES INDEX
    // ===============================
    console.log("🔍 Création des index...");

    // Index pour les contenus
    await sql`create index if not exists idx_contents_category on contents(category)`;
    await sql`create index if not exists idx_contents_type on contents(type)`;
    await sql`create index if not exists idx_contents_published_at on contents(published_at desc)`;
    await sql`create index if not exists idx_contents_created_at on contents(created_at desc)`;

    // Index pour les vues
    await sql`create index if not exists idx_content_views_views on content_views(views desc)`;

    // Index pour les visiteurs
    await sql`create index if not exists idx_visitor_sessions_visitor_id on visitor_sessions(visitor_id)`;
    await sql`create index if not exists idx_visitor_sessions_created_at on visitor_sessions(created_at desc)`;

    // ===============================
    // 7️⃣ TRIGGERS
    // ===============================
    console.log("⚙️ Création des triggers...");

    // Fonction pour updated_at
    await sql`
      create or replace function update_updated_at_column()
      returns trigger as $$
      begin
        new.updated_at = now();
        return new;
      end;
      $$ language plpgsql
    `;

    // Drop triggers existants (séparément)
    await sql`drop trigger if exists update_profiles_updated_at on profiles`;
    await sql`drop trigger if exists update_contents_updated_at on contents`;
    await sql`drop trigger if exists update_content_views_updated_at on content_views`;

    // Créer les triggers (séparément)
    await sql`
      create trigger update_profiles_updated_at
        before update on profiles
        for each row
        execute function update_updated_at_column()
    `;

    await sql`
      create trigger update_contents_updated_at
        before update on contents
        for each row
        execute function update_updated_at_column()
    `;

    await sql`
      create trigger update_content_views_updated_at
        before update on content_views
        for each row
        execute function update_updated_at_column()
    `;

    // ===============================
    // 8️⃣ INSERT PROFILE
    // ===============================
    console.log("👤 Insertion du profil...");
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
      on conflict (id) do update set
        first_name = excluded.first_name,
        last_name = excluded.last_name,
        title = excluded.title,
        bio = excluded.bio,
        image_url = excluded.image_url,
        formations = excluded.formations,
        motivations = excluded.motivations,
        social_links = excluded.social_links,
        updated_at = now()
    `;

    // ===============================
    // 9️⃣ INSERT CATEGORIES
    // ===============================
    console.log("📁 Insertion des catégories...");
    for (const c of appData.categories) {
      await sql`
        insert into categories (id, label, description, icon)
        values (
          ${c.id},
          ${c.label},
          ${c.description},
          ${c.icon}
        )
        on conflict (id) do update set
          label = excluded.label,
          description = excluded.description,
          icon = excluded.icon
      `;
    }
    console.log(`✅ ${appData.categories.length} catégories insérées`);

    // ===============================
    // 🔟 INSERT CONTENTS
    // ===============================
    console.log("📝 Insertion des contenus...");
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
        on conflict (id) do update set
          title = excluded.title,
          description = excluded.description,
          type = excluded.type,
          category = excluded.category,
          media_url = excluded.media_url,
          thumbnail_url = excluded.thumbnail_url,
          transcription = excluded.transcription,
          text_content = excluded.text_content,
          duration = excluded.duration,
          published_at = excluded.published_at,
          tags = excluded.tags,
          updated_at = now()
      `;
    }
    console.log(`✅ ${appData.contents.length} contenus insérés`);

    // ===============================
    // 1️⃣1️⃣ INSERT INITIAL VIEWS
    // ===============================
    console.log("👁️ Initialisation des vues pour les contenus...");

    // Générer des vues aléatoires pour chaque contenu
    const viewsData = [
      { id: "1", views: 3542 },
      { id: "2", views: 2198 },
      { id: "3", views: 4721 },
      { id: "4", views: 1876 },
      { id: "5", views: 2945 },
      { id: "6", views: 1532 },
    ];

    for (const data of viewsData) {
      await sql`
        insert into content_views (content_id, views)
        values (${data.id}, ${data.views})
        on conflict (content_id) do update set
          views = excluded.views,
          updated_at = now()
      `;
    }
    console.log(`✅ ${viewsData.length} entrées de vues initialisées`);

    // ===============================
    // 1️⃣2️⃣ INSERT SAMPLE VISITORS
    // ===============================
    console.log("👥 Insertion de visiteurs d'exemple...");

    const sampleVisitors = [
      { id: "visitor-001", metadata: { country: "FR", device: "desktop" } },
      { id: "visitor-002", metadata: { country: "BE", device: "mobile" } },
      { id: "visitor-003", metadata: { country: "CA", device: "tablet" } },
      { id: "visitor-004", metadata: { country: "FR", device: "mobile" } },
      { id: "visitor-005", metadata: { country: "CH", device: "desktop" } },
    ];

    for (const visitor of sampleVisitors) {
      // Insérer plusieurs sessions pour simuler des visites répétées
      for (let i = 0; i < Math.floor(Math.random() * 5) + 1; i++) {
        await sql`
          insert into visitor_sessions (visitor_id, metadata)
          values (
            ${visitor.id},
            ${JSON.stringify(visitor.metadata)}
          )
        `;
      }
    }
    console.log(`✅ Sessions de visiteurs créées`);

    // Réactiver les notices
    await sql`SET client_min_messages TO NOTICE`;

    // ===============================
    // 1️⃣3️⃣ STATISTIQUES FINALES
    // ===============================
    console.log("\n📊 Statistiques de la base de données:");

    const [profileCount] = await sql`select count(*) from profiles`;
    const [categoryCount] = await sql`select count(*) from categories`;
    const [contentCount] = await sql`select count(*) from contents`;
    const [viewsCount] = await sql`select count(*) from content_views`;
    const [visitorCount] = await sql`select count(*) from visitor_sessions`;
    const [totalViews] =
      await sql`select coalesce(sum(views), 0) as total from content_views`;

    console.log(`  - Profils: ${profileCount.count}`);
    console.log(`  - Catégories: ${categoryCount.count}`);
    console.log(`  - Contenus: ${contentCount.count}`);
    console.log(`  - Entrées de vues: ${viewsCount.count}`);
    console.log(`  - Total des vues: ${totalViews.total}`);
    console.log(`  - Sessions visiteurs: ${visitorCount.count}`);

    return {
      success: true,
      message: `✅ Base de données initialisée avec succès!
      
📊 Résumé:
  • ${profileCount.count} profil(s)
  • ${categoryCount.count} catégories
  • ${contentCount.count} contenus
  • ${totalViews.total} vues totales
  • ${visitorCount.count} sessions visiteurs
      
🎉 Prêt à être utilisé!`,
    };
  } catch (error) {
    console.error("❌ INIT DATABASE ERROR:", error);

    return {
      success: false,
      message: `❌ Erreur lors de l'initialisation de la base de données: ${error}

URL de connexion: ${process.env.POSTGRES_URL_NON_POOLING ? "✅ Configurée" : "❌ Non configurée"}

Vérifiez:
  ${!process.env.POSTGRES_URL_NON_POOLING ? "1. Que la variable d'environnement POSTGRES_URL_NON_POOLING est définie" : "1. Que le serveur PostgreSQL est accessible"} 
  2. Que l'utilisateur a les droits nécessaires
  3. Que la base de données existe
  
Erreur détaillée: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}

// ===============================
// FONCTION DE NETTOYAGE (OPTIONNEL)
// ===============================
export async function cleanDatabase(): Promise<{
  success: boolean;
  message: string;
}> {
  try {
    console.log("🧹 Nettoyage de la base de données...");

    await sql`drop table if exists visitor_sessions cascade`;
    await sql`drop table if exists content_views cascade`;
    await sql`drop table if exists contents cascade`;
    await sql`drop table if exists categories cascade`;
    await sql`drop table if exists profiles cascade`;
    await sql`drop function if exists update_updated_at_column() cascade`;

    console.log("✅ Base de données nettoyée");

    return {
      success: true,
      message: "✅ Base de données nettoyée avec succès",
    };
  } catch (error) {
    console.error("❌ CLEAN DATABASE ERROR:", error);

    return {
      success: false,
      message: `❌ Erreur lors du nettoyage: ${error}`,
    };
  }
}

// ===============================
// FONCTION DE RÉINITIALISATION COMPLÈTE
// ===============================
export async function resetDatabase(): Promise<{
  success: boolean;
  message: string;
}> {
  console.log("🔄 Réinitialisation complète de la base de données...\n");

  // 1. Nettoyer
  const cleanResult = await cleanDatabase();
  if (!cleanResult.success) {
    return cleanResult;
  }

  // 2. Réinitialiser
  const initResult = await initDatabase();
  return initResult;
}