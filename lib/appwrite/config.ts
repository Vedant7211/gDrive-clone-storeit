export const appwriteConfig = {
  endpointURL: process.env.NEXT_PUBLIC_APPWRITE_ENDPOINT!,
  projectID: process.env.NEXT_PUBLIC_APPWRITE_PROJECT_ID!,
  databaseID: process.env.NEXT_PUBLIC_APPWRITE_DATABASE_ID!,
  userCollectionID: process.env.NEXT_PUBLIC_APPWRITE_USER_COLLECTION_ID!,
  storageID: process.env.NEXT_PUBLIC_APPWRITE_STORAGE_ID!,
  secretKey: process.env.NEXT_APPWRITE_SECRET!,
  fileCollectionID: process.env.NEXT_PUBLIC_APPWRITE_FILES_COLLECTION_ID!,
};
