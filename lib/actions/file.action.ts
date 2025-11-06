"use server";

import { createAdminClient } from "../appwrite";
import { InputFile } from "node-appwrite/file";
import { appwriteConfig } from "../appwrite/config";
import { ID, Query } from "node-appwrite";
import { constructFileUrl } from "../utils";
import { revalidatePath } from "next/cache";
import { parseStringify } from "../utils";
import { getFileType } from "../utils";
import { getCurrentUser } from "./user.actions";
import { FileDocument, UploadFileProps, GetFilesProps, FileType } from "@/types";

const handleError = (error: unknown, message: string) => {
  console.log(error, message);
  throw error;
};

export const uploadFile = async ({
  file,
  ownerId,
  accountId,
  path,
}: UploadFileProps): Promise<FileDocument | undefined> => {
  const { storage, databases } = await createAdminClient();

  try {
    const inputFile = InputFile.fromBuffer(file, file.name);

    const bucketFile = await storage.createFile(
      appwriteConfig.storageID,
      ID.unique(),
      inputFile
    );

    const fileDocument = {
      type: getFileType(bucketFile.name).type,
      name: bucketFile.name,
      Url: constructFileUrl(bucketFile.$id),
      extention: getFileType(bucketFile.name).extension,
      size: bucketFile.sizeOriginal,
      owner: ownerId,
      accountId,
      users: [],
      bucketFileId: bucketFile.$id,
    };

    console.log("fileDocument", fileDocument);

    const newFile = await databases
      .createDocument(
        appwriteConfig.databaseID,
        appwriteConfig.fileCollectionID,
        ID.unique(),
        fileDocument
      )
      .catch(async (error: unknown) => {
        await storage.deleteFile(appwriteConfig.storageID, bucketFile.$id);
        handleError(error, "Failed to upload file");
      });

    revalidatePath(path);
    return parseStringify(newFile);
  } catch (error) {
    handleError(error, "Failed to upload file");
    return undefined;
  }
};

export const getFiles = async (
  props?: GetFilesProps
): Promise<{ total: number; documents: FileDocument[] }> => {
  const { databases } = await createAdminClient();

  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      throw new Error("User not found");
    }

    console.log("currentUser", currentUser);

    const queries = [Query.equal("accountId", [currentUser.accountId])];

    if (props?.types && props.types.length > 0) {
      queries.push(Query.equal("type", props.types));
    }

    const sortOrder = props?.sort || "$createdAt-desc";
    queries.push(
      sortOrder === "$createdAt-desc"
        ? Query.orderDesc("$createdAt")
        : Query.orderAsc("$createdAt")
    );

    const limit = props?.searchText ? 100 : props?.limit || 10;
    queries.push(Query.limit(limit));

    console.log("Search queries:", queries);

    const files = await databases.listDocuments<FileDocument>(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      queries
    );

    console.log("Search results:", files);

    if (props?.searchText) {
      const searchTerm = props.searchText.toLowerCase();
      const filteredDocuments = files.documents.filter((file) => {
        return (
          file.name?.toLowerCase().includes(searchTerm) ||
          file.extention?.toLowerCase().includes(searchTerm) ||
          file.type?.toLowerCase().includes(searchTerm) ||
          file.fullName?.toLowerCase().includes(searchTerm)
        );
      });

      return {
        total: filteredDocuments.length,
        documents: filteredDocuments.slice(0, props?.limit || 10)
      };
    }

    return files;
  } catch (error) {
    handleError(error, "Failed to get files");
    return { total: 0, documents: [] };
  }
};

export const downloadFile = async (bucketFileId: string): Promise<ArrayBuffer | undefined> => {
  const { storage } = await createAdminClient();

  try {
    const file = await storage.getFileDownload(
      appwriteConfig.storageID,
      bucketFileId
    );

    return file;
  } catch (error) {
    handleError(error, "Failed to download file");
    return undefined;
  }
};

export const renameFile = async (
  fileId: string,
  name: string,
  extention: string,
  path: string
): Promise<FileDocument | undefined> => {
  const { databases } = await createAdminClient();

  try {
    const file = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      fileId,
      {
        name: name,
      }
    );

    revalidatePath(path);
    console.log(file);

    return parseStringify(file);
  } catch (error) {
    handleError(error, "Failed to rename file");
    return undefined;
  }
};

export const UpdateFileUser = async (
  fileId: string,
  emails: string[],
  path: string
): Promise<FileDocument | undefined> => {
  const { databases } = await createAdminClient();

  try {
    const currentFile = await databases.getDocument(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      fileId
    );

    const existingUsers = currentFile.users || [];

    const allUsers = [...new Set([...existingUsers, ...emails])];

    const file = await databases.updateDocument(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      fileId,
      {
        users: allUsers,
      }
    );

    revalidatePath(path);
    console.log("File updated with users:", file);

    return parseStringify(file);
  } catch (error) {
    handleError(error, "Failed to update file users");
    throw error;
  }
};

export const DeleteFile = async (
  fileId: string,
  bucketFileId: string,
  path: string
): Promise<FileDocument | undefined> => {
  const { databases, storage } = await createAdminClient();

  try {
    const deletedFile = await databases.deleteDocument(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      fileId
    );

    if (deletedFile) {
      await storage.deleteFile(appwriteConfig.storageID, bucketFileId);
    }

    revalidatePath(path);
    console.log("File deleted:", deletedFile);

    return parseStringify(deletedFile);
  } catch (error) {
    handleError(error, "Failed to delete file");
    return undefined;
  }
};

export async function debugFileStorage() {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();
    
    console.log("=== DEBUG FILE STORAGE ===");
    console.log("Current user:", currentUser);
    
    if (!currentUser) {
      console.log("❌ No current user found!");
      return { error: "No current user" };
    }

    const allFiles = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      [Query.limit(1000)]
    );
    
    console.log("Total files in collection:", allFiles.total);
    console.log("Sample files:", allFiles.documents.slice(0, 3));
    
    const userFiles = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      [Query.equal("accountId", [currentUser.accountId])]
    );
    
    console.log("Files for current user:", userFiles.total);
    
    const userFilesAlt = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      [Query.equal("owner", [currentUser.$id])]
    );
    
    console.log("Files by owner field:", userFilesAlt.total);
    
    return {
      totalFiles: allFiles.total,
      userFiles: userFiles.total,
      userFilesByOwner: userFilesAlt.total,
      currentUser: currentUser,
      sampleFiles: allFiles.documents.slice(0, 3)
    };
  } catch (error) {
    console.error("Debug error:", error);
    return { error: error };
  }
}

export async function getTotalSpaceUsed(): Promise<{
  image: { size: number; latestDate: string };
  document: { size: number; latestDate: string };
  video: { size: number; latestDate: string };
  audio: { size: number; latestDate: string };
  other: { size: number; latestDate: string };
  used: number;
  all: number;
} | undefined> {
  try {
    const { databases } = await createAdminClient();
    const currentUser = await getCurrentUser();
    if (!currentUser) throw new Error("User is not authenticated.");

    console.log("Getting files for account:", currentUser.accountId);
    
    const files = await databases.listDocuments<FileDocument>(
      appwriteConfig.databaseID,
      appwriteConfig.fileCollectionID,
      [Query.equal("accountId", [currentUser.accountId])]
    );

    console.log("Files found for user:", files.total);

    const totalSpace = {
      image: { size: 0, latestDate: "" },
      document: { size: 0, latestDate: "" },
      video: { size: 0, latestDate: "" },
      audio: { size: 0, latestDate: "" },
      other: { size: 0, latestDate: "" },
      used: 0,
      all: 2 * 1024 * 1024 * 1024,
    };

    files.documents.forEach((file) => {
      try {
        const fileType = (['image', 'document', 'video', 'audio'].includes(file.type) 
          ? file.type 
          : 'other') as FileType;
        
        const fileSize = typeof file.size === 'number' ? file.size : Number(file.size) || 0;
        
        console.log(`Processing file: ${file.name}, Type: ${fileType}, Size: ${fileSize} bytes`);
        
        if (totalSpace[fileType]) {
          totalSpace[fileType].size = (totalSpace[fileType].size || 0) + fileSize;
          totalSpace.used = (totalSpace.used || 0) + fileSize;

          if (file.$updatedAt) {
            if (
              !totalSpace[fileType].latestDate ||
              new Date(file.$updatedAt) > new Date(totalSpace[fileType].latestDate || 0)
            ) {
              totalSpace[fileType].latestDate = file.$updatedAt;
            }
          }
        }
      } catch (error) {
        console.error('Error processing file:', file, error);
      }
    });
    
    console.log('Total space calculation:', JSON.stringify(totalSpace, null, 2));

    console.log("Space used:", totalSpace);
    return parseStringify(totalSpace);
  } catch (error) {
    handleError(error, "Error calculating total space used");
    return undefined;
  }
}