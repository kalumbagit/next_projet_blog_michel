import postgres from "postgres";
import B2 from "backblaze-b2";

export const sql = postgres(process.env.POSTGRES_URL_NON_POOLING!, {
  ssl: {
    rejectUnauthorized: false,
  },
  max: 1, // 👈 IMPORTANT en serverless / Next
  idle_timeout: 20,
  connect_timeout: 10,
});

export const b2 = new B2({
  applicationKeyId: process.env.B2_APPLICATION_KEY_ID!,
  applicationKey: process.env.B2_APPLICATION_KEY!,
});

export async function initB2() {
  await b2.authorize(); // ça récupère les tokens temporaires
}
