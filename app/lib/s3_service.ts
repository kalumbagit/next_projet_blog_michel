import { b2, initB2 } from "./config";
import fs from "fs";

export const b2Service = {
  /**
   * Upload un fichier depuis un Buffer, Uint8Array ou string
   * @param fileName nom du fichier dans le bucket
   * @param fileData Buffer / string / Uint8Array
   * @returns URL publique si bucket public
   */
  async uploadFile(
    fileName: string,
    fileData: Buffer | Uint8Array | string,
  ): Promise<string> {
    await initB2();

    const response = await b2.uploadFile({
      bucketId: process.env.B2_BUCKET_NAME!,
      fileName,
      data: fileData,
    });

    return `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
  },

  /**
   * Upload depuis un fichier local (chemin)
   */
  async uploadFileFromPath(localPath: string, destPath: string) {
    const buffer = fs.readFileSync(localPath);
    return this.uploadFile(destPath, buffer);
  },

  /**
   * Supprime un fichier du bucket
   * @param fileName nom du fichier
   */
  async deleteFile(fileName: string) {
    await initB2();
    const response = await b2.deleteFileVersion({
      fileName,
      fileId: await this.getFileId(fileName),
    });
    return response;
  },

  /**
   * Récupère le fileId d'un fichier existant
   * nécessaire pour deleteFile
   */
  async getFileId(fileName: string) {
    await initB2();

    const list = await b2.listFileNames({
      bucketId: process.env.B2_BUCKET_NAME!,
      startFileName: fileName,
      maxFileCount: 1,
    });

    // Typage minimal pour supprimer l'erreur TS7006
    const file = list.data.files.find(
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (f: { fileName: string; fileId: string }) => f.fileName === fileName,
    );

    if (!file) throw new Error(`File ${fileName} not found`);
    return file.fileId;
  },

  /**
   * Liste les fichiers dans un bucket
   * @param prefix optionnel : filtrer par chemin / dossier
   */
  async listFiles(prefix?: string) {
    await initB2();
    const list = await b2.listFileNames({
      bucketId: process.env.B2_BUCKET_NAME!,
      startFileName: prefix,
      maxFileCount: 1000,
    });

    return list.data.files;
  },

  /**
   * Génère une URL temporaire pour un fichier privé
   * @param fileName nom du fichier
   * @param validDuration duration en secondes
   */
  async getSignedUrl(fileName: string, validDuration = 3600) {
    await initB2();
    const response = await b2.getDownloadAuthorization({
      bucketId: process.env.B2_BUCKET_NAME!,
      fileNamePrefix: fileName,
      validDurationInSeconds: validDuration,
    });

    const token = response.data.authorizationToken;
    return `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}?Authorization=${token}`;
  },

  /**
   * Télécharge un fichier depuis le bucket
   * @param fileName nom du fichier
   * @returns Buffer
   */
  async downloadFile(fileName: string) {
    const url = `https://f000.backblazeb2.com/file/${process.env.B2_BUCKET_NAME}/${fileName}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error(`Erreur téléchargement fichier ${fileName}`);
    return Buffer.from(await res.arrayBuffer());
  },
};
