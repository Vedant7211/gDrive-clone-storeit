import { Models } from "node-appwrite";

export interface FileModal extends Models.Document {
  users: string[];
  path: string;
  name: string;
  type: string;
  extention: string | null; // Using 'extention' to match database schema (can be null)
  size: number;
  url: string;
  fullName: string;
  $createdAt: string;
  $id: string;
  $updatedAt: string;
  bucketFileId: string;
  owner: {
    fullName: string;
  };
  accountId: string;
  $sequence: number;  // Made required
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
}
