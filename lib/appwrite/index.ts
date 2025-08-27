"use server";
import { Account, Avatars, Client, Databases, Storage } from "node-appwrite";
import { appwriteConfig } from "./config";
import { cookies } from "next/headers";

export const createSessionClient = async () => {
    const client = new Client()
      .setEndpoint(appwriteConfig.endpointURL)
      .setProject(appwriteConfig.projectID);
  
    const cookieStore = await cookies();
    const session = cookieStore.get("appwrite-session");
  
    if (!session?.value) {
      console.log("No session found in createSessionClient");
      return null;
    }
  
    console.log("Session found in createSessionClient");
  
    client.setSession(session.value);
  
    return {
      get account() {
        return new Account(client);
      },
      get databases() {
        return new Databases(client);
      },
    };
  };

export const createAdminClient = async () => {
  const client = new Client()
    .setEndpoint(appwriteConfig.endpointURL)
    .setProject(appwriteConfig.projectID)
    .setKey(appwriteConfig.secretKey);

  return {
    get account() {
      return new Account(client);
    },
    get databases() {
      return new Databases(client);
    },
    get storage() {
      return new Storage(client);
    },
    get avatar() {
      return new Avatars(client);
    },
  };
};
