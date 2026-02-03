import { b2, initB2 } from "./config";

let uploadUrl: string | null = null;
let uploadAuthToken: string | null = null;

async function ensureUploadReady() {
  if (uploadUrl && uploadAuthToken) return;

  await initB2();

  const res = await b2.getUploadUrl({
    bucketId: process.env.B2_BUCKET_ID!,
  });

  uploadUrl = res.data.uploadUrl;
  uploadAuthToken = res.data.authorizationToken;
}

export const b2Service = {
  /**
   * Upload un fichier
   */
  async uploadFile(
    fileName: string,
    fileData: Buffer | Uint8Array | string,
  ): Promise<string> {
    try {
      await ensureUploadReady();

      await b2.uploadFile({
        uploadUrl: uploadUrl!,
        uploadAuthToken: uploadAuthToken!,
        fileName,
        data: fileData,
      });

      return `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
    } catch (error) {
      console.error("Erreur lors de l'upload:", error);
      throw new Error(`Impossible d'uploader le fichier ${fileName}`);
    }
  },

  /**
   * Construit l'URL publique
   */
  async getFileUrl(source: string): Promise<string> {
    if (source.startsWith("http://") || source.startsWith("https://")) {
      return source;
    }

    return `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${source}`;
  },

  /**
   * Télécharge un fichier
   */
  async downloadFile(source: string): Promise<Buffer> {
    const url = await this.getFileUrl(source);
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Erreur HTTP: ${res.status}`);
    }

    return Buffer.from(await res.arrayBuffer());
  },

  /**
   * Supprime un fichier
   */
  async deleteFile(fileName: string): Promise<void> {
    await initB2();

    const fileId = await this.getFileId(fileName);

    await b2.deleteFileVersion({
      fileName,
      fileId,
    });
  },

  /**
   * Récupère le fileId
   */
  async getFileId(fileName: string): Promise<string> {
    await initB2();

    const list = await b2.listFileNames({
      bucketId: process.env.B2_BUCKET_ID!, // ✅ ID, pas NAME
      startFileName: fileName,
      maxFileCount: 1,
    });

    const file = list.data.files.find(
      (f: { fileName: string; fileId: string }) => f.fileName === fileName,
    );

    if (!file) {
      throw new Error(`Fichier ${fileName} introuvable`);
    }

    return file.fileId;
  },

  /**
   * Vérifie l'existence
   */
  async fileExists(fileName: string): Promise<boolean> {
    try {
      await this.getFileId(fileName);
      return true;
    } catch {
      return false;
    }
  },

  /**
   * Liste les fichiers
   */
  async listFiles(prefix?: string) {
    await initB2();

    const list = await b2.listFileNames({
      bucketId: process.env.B2_BUCKET_ID!, // ✅
      startFileName: prefix,
      maxFileCount: 1000,
    });

    return list.data.files;
  },

  /**
   * URL signée (bucket privé)
   */
  async getSignedUrl(fileName: string, validDuration = 3600): Promise<string> {
    await initB2();

    const response = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID!, // ✅
      fileNamePrefix: fileName,
      validDurationInSeconds: validDuration,
    });

    const token = response.data.authorizationToken;

    return `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${token}`;
  },
};
