import { initDatabase } from "@/app/lib/init/init"; // adapte le chemin si besoin
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const result = await initDatabase();

    return NextResponse.json(result, {
      status: result.success ? 200 : 500,
    });
  } catch (error) {
    console.error("❌ API INIT DB ERROR:", error);

    return NextResponse.json(
      {
        success: false,
        message: `❌ Erreur API lors de l'initialisation :  ${error}`,
      },
      { status: 500 },
    );
  }
}
