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

      return `https://f003.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      console.error("Erreur complète lors de l'upload :", error);

      // Si c'est un AggregateError (Backblaze B2 SDK peut renvoyer ça)
      if (error instanceof AggregateError) {
        console.error("Liste des erreurs :", error.errors);
      }

      // Si c'est un AxiosError
      if (error.isAxiosError) {
        console.error("Détails Axios :", {
          url: error.config?.url,
          method: error.config?.method,
          status: error.response?.status,
          headers: error.response?.headers,
          data: error.response?.data,
        });
      }

      // Remonter l'erreur complète dans le throw
      throw new Error(
        `Impossible d'uploader le fichier ${fileName}. Détails: ${
          error.message || JSON.stringify(error)
        }`,
      );
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
    const signedUrl = await this.getSignedUrl(url);
    const res = await fetch(signedUrl);

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
  async getSignedUrl(uri: string, validDuration = 86400): Promise<string> {
    await initB2();

    // Si l'URI est une URL complète, on extrait le fileName
    let fileName = uri;
    const bucketUrl = `https://f003.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/`;
    if (uri.startsWith("http://") || uri.startsWith("https://")) {
      if (!uri.includes(bucketUrl)) {
        throw new Error(`L'URL ne correspond pas au bucket attendu : ${uri}`);
      }
      fileName = uri.split(bucketUrl)[1];
    }

    const response = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_ID!, // ✅
      fileNamePrefix: fileName,
      validDurationInSeconds: validDuration,
    });

    const token = response.data.authorizationToken;

    return `https://f003.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${token}`;
  },
};
