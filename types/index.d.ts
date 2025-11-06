import { Models } from 'node-appwrite';

export type FileType = "document" | "image" | "video" | "audio" | "other";

export interface ActionType {
  label: string;
  icon: string;
  value: string;
}

export interface SearchParamProps {
  params?: Promise<{ [key: string]: string | string[] | undefined }>;
  searchParams?: Promise<{ [key: string]: string | string[] | undefined }>;
}

export interface UploadFileProps {
  file: File;
  ownerId: string;
  accountId: string;
  path: string;
}

export interface GetFilesProps {
  types: FileType[];
  searchText?: string;
  sort?: string;
  limit?: number;
}

export type FileDocument = Models.Document & {
  type: FileType;
  name: string;
  path: string;
  url: string;
  size: number;
  owner: string;
  accountId: string;
  users: string[];
  bucketFileId: string;
  extention: string | null; // Using 'extention' to match database schema (can be null)
  fullName: string;
  $id: string;
  $createdAt: string;
  $updatedAt: string;
  $sequence: number;
  $collectionId: string;
  $databaseId: string;
  $permissions: string[];
}

declare interface RenameFileProps {
  fileId: string;
  name: string;
  extention: string;
  path: string;
}
declare interface UpdateFileUsersProps {
  fileId: string;
  emails: string[];
  path: string;
}
declare interface DeleteFileProps {
  fileId: string;
  bucketFileId: string;
  path: string;
}

declare interface FileUploaderProps {
  ownerId: string;
  accountId: string;
  className?: string;
}

declare interface MobileNavigationProps {
  ownerId: string;
  accountId: string;
  fullName: string;
  avatar: string;
  email: string;
}
declare interface SidebarProps {
  fullName: string;
  avatar: string;
  email: string;
}

declare interface ThumbnailProps {
  type: string;
  extension: string;
  url: string;
  className?: string;
  imageClassName?: string;
}

declare interface ShareInputProps {
  file: Models.Document;
  onInputChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRemove: (email: string) => void;
}

interface UserDocument extends Models.Document {
  fullName: string;
  email: string;
  avatar: string;
  $id: string;
}