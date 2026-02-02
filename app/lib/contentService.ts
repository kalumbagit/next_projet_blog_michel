import { sql } from "@/app/lib/config";
import { Category, Content, Profile, CategoryInfo } from "@/app/lib";

// ============================================================================
// SERVICE PRINCIPAL — CONNECTÉ À LA BASE DE DONNÉES
// ============================================================================

export const contentService = {

  // ==========================================================================
  // PROFILE
  // ==========================================================================

  async getProfile(): Promise<Profile> {
    const [profile] = await sql<Profile[]>`
      select
        id,
        first_name as "firstName",
        last_name as "lastName",
        title,
        bio,
        image_url as "imageUrl",
        formations,
        motivations,
        social_links as "socialLinks"
      from profiles
      limit 1
    `;
    return profile;
  },

  async updateProfile(data: Partial<Profile>): Promise<Profile> {
    const [updated] = await sql<Profile[]>`
      update profiles
      set ${sql({
        first_name: data.firstName,
        last_name: data.lastName,
        title: data.title,
        bio: data.bio,
        image_url: data.imageUrl,
        formations: data.formations,
        motivations: data.motivations,
        social_links: data.socialLinks,
      })}
      returning
        id,
        first_name as "firstName",
        last_name as "lastName",
        title,
        bio,
        image_url as "imageUrl",
        formations,
        motivations,
        social_links as "socialLinks"
    `;
    return updated;
  },

  // ==========================================================================
  // CATEGORIES
  // ==========================================================================

  async getCategories(): Promise<CategoryInfo[]> {
    return await sql<CategoryInfo[]>`
      select * from categories order by label
    `;
  },

  async getCategoryById(id: Category): Promise<CategoryInfo | undefined> {
    const [category] = await sql<CategoryInfo[]>`
      select * from categories where id = ${id}
    `;
    return category;
  },

  async createCategory(category: CategoryInfo): Promise<CategoryInfo> {
    const [created] = await sql<CategoryInfo[]>`
      insert into categories (id, label, description, icon)
      values (
        ${category.id},
        ${category.label},
        ${category.description},
        ${category.icon}
      )
      returning *
    `;
    return created;
  },

  async updateCategory(
    id: Category,
    data: Partial<CategoryInfo>
  ): Promise<CategoryInfo | null> {
    const result = await sql<CategoryInfo[]>`
      update categories
      set ${sql(data)}
      where id = ${id}
      returning *
    `;
    return result[0] ?? null;
  },

  async deleteCategory(id: Category): Promise<boolean> {
    const used = await sql`
      select 1 from contents where category = ${id} limit 1
    `;

    if (used.length > 0) {
      throw new Error("Des contenus utilisent encore cette catégorie");
    }

    const result = await sql`
      delete from categories where id = ${id}
    `;
    return result.count > 0;
  },

  // ==========================================================================
  // CONTENTS
  // ==========================================================================

  async getContents(): Promise<Content[]> {
    return await sql<Content[]>`
      select
        id,
        title,
        description,
        type,
        category,
        media_url as "mediaUrl",
        thumbnail_url as "thumbnailUrl",
        transcription,
        text_content as "textContent",
        duration,
        published_at as "publishedAt",
        tags,
        created_at as "createdAt"
      from contents
      order by created_at desc
    `;
  },

  async getContentById(id: string): Promise<Content | undefined> {
    const [content] = await sql<Content[]>`
      select
        id,
        title,
        description,
        type,
        category,
        media_url as "mediaUrl",
        thumbnail_url as "thumbnailUrl",
        transcription,
        text_content as "textContent",
        duration,
        published_at as "publishedAt",
        tags,
        created_at as "createdAt"
      from contents
      where id = ${id}
    `;
    return content;
  },

  async getContentsByCategory(category: Category): Promise<Content[]> {
    return await sql<Content[]>`
      select *
      from contents
      where category = ${category}
      order by created_at desc
    `;
  },

  async searchContents(query: string): Promise<Content[]> {
    const q = `%${query.toLowerCase()}%`;

    return await sql<Content[]>`
      select *
      from contents
      where
        lower(title) like ${q}
        or lower(description) like ${q}
        or exists (
          select 1
          from jsonb_array_elements_text(tags) t
          where lower(t) like ${q}
        )
    `;
  },

  async createContent(data: Omit<Content, "id" | "createdAt">): Promise<Content> {
    const [created] = await sql<Content[]>`
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
        ${crypto.randomUUID()},
        ${data.title},
        ${data.description},
        ${data.type},
        ${data.category},
        ${data.mediaUrl ?? null},
        ${data.thumbnailUrl ?? null},
        ${data.transcription ?? null},
        ${data.textContent ?? null},
        ${data.duration ?? null},
        ${data.publishedAt ?? null},
        ${JSON.stringify(data.tags ?? [])}
      )
      returning *
    `;
    return created;
  },

  async updateContent(
    id: string,
    data: Partial<Content>
  ): Promise<Content | null> {
    const result = await sql<Content[]>`
      update contents
      set ${sql({
        title: data.title,
        description: data.description,
        type: data.type,
        category: data.category,
        media_url: data.mediaUrl,
        thumbnail_url: data.thumbnailUrl,
        transcription: data.transcription,
        text_content: data.textContent,
        duration: data.duration,
        published_at: data.publishedAt,
        tags: data.tags ? JSON.stringify(data.tags) : undefined,
      })}
      where id = ${id}
      returning *
    `;
    return result[0] ?? null;
  },

  async deleteContent(id: string): Promise<boolean> {
    const result = await sql`
      delete from contents where id = ${id}
    `;
    return result.count > 0;
  },

  // ==========================================================================
  // STATS
  // ==========================================================================

  async getStats() {
    const [global] = await sql`
      select
        (select count(*) from contents) as "totalContents",
        (select count(*) from categories) as "totalCategories"
    `;

    const byType = await sql`
      select type, count(*) from contents group by type
    `;

    const byCategory = await sql`
      select category, count(*) from contents group by category
    `;

    return {
      ...global,
      contentsByType: Object.fromEntries(
        byType.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (r: any) => [r.type, Number(r.count)])
      ),
      contentsByCategory: Object.fromEntries(
        byCategory.map(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (r: any) => [r.category, Number(r.count)])
      ),
    };
  },
};
