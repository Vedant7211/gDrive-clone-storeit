"use server";
import { appwriteConfig } from "../appwrite/config";
import { createAdminClient, createSessionClient } from "../appwrite";
import { Query, ID } from "node-appwrite";
import { parseStringify } from "../utils";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

const getUserByEmail = async (email: string) => {
  const { databases } = await createAdminClient();

  const result = await databases.listDocuments(
    appwriteConfig.databaseID,
    appwriteConfig.userCollectionID,
    [Query.equal("email", [email])],
  );

  return result.total > 0 ? result.documents[0] : null;
};

const handleError = (error: unknown, message: string) => {
  console.error(message, error);
  throw error;
};

export const sendEmailOTP = async ({ email }: { email: string }) => {
  const { account } = await createAdminClient();

  try {
    const existingUser = await getUserByEmail(email);
    
    let sessionUserId;
    if (existingUser) {
      sessionUserId = existingUser.accountId;
    } else {
      sessionUserId = ID.unique();
    }
    
    const session = await account.createEmailToken(sessionUserId, email);
    return session.userId;
  } catch (error) {
    handleError(error, "Failed to send OTP");
  }
};

export const createAccount = async ({
  fullName,
  email,
}: {
  fullName: string;
  email: string;
}) => {
  try {
    const existingUser = await getUserByEmail(email);

    const accountId = await sendEmailOTP({ email });
    if (!accountId) {
      throw new Error("Failed to send OTP");
    }

    if (!existingUser) {
      const { databases } = await createAdminClient();

      await databases.createDocument(
        appwriteConfig.databaseID,
        appwriteConfig.userCollectionID,
        ID.unique(),
        {
          fullName,
          email,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
          accountId,
        },
      );
    }
    return parseStringify({ accountId });
  } catch (error) {
    handleError(error, "Failed to create account");
  }
};

const ensureUserDocument = async (accountId: string, sessionSecret: string) => {
  try {
    const { databases } = await createAdminClient();
    
    const existingUser = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionID,
      [Query.equal("accountId", accountId)]
    );

    if (existingUser.total === 0) {
      const { Client, Account } = await import("node-appwrite");
      const client = new Client()
        .setEndpoint(appwriteConfig.endpointURL)
        .setProject(appwriteConfig.projectID)
        .setSession(sessionSecret);
      
      const account = new Account(client);
      const authUser = await account.get();
      
      await databases.createDocument(
        appwriteConfig.databaseID,
        appwriteConfig.userCollectionID,
        ID.unique(),
        {
          fullName: authUser.name,
          email: authUser.email,
          avatar: "https://www.w3schools.com/howto/img_avatar.png",
          accountId: authUser.$id,
        },
      );
    }
  } catch {
    // Don't throw here - this is a fallback operation
  }
};

export const verifySecret = async ({
  accountId,
  secret,
}: {
  accountId: string;
  secret: string;
}) => {
  try {
    if (!accountId || !secret) {
      throw new Error("Account ID and secret are required");
    }

    if (secret.length !== 6) {
      throw new Error("OTP must be 6 digits");
    }

    const { account } = await createAdminClient();

    const session = await account.createSession(accountId, secret);

    await ensureUserDocument(accountId, session.secret);

    const cookieOptions = {
      path: "/",
      httpOnly: true,
      sameSite: "lax" as const,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7 // 1 week
    };
    
    const cookieStore = await cookies();
    cookieStore.set("appwrite-session", session.secret, cookieOptions);

    return parseStringify({ sessionId: session.$id });
  } catch (error: unknown) {
    if (error && typeof error === 'object' && 'type' in error) {
      if (error.type === 'user_invalid_token') {
        throw new Error("Invalid or expired OTP. Please request a new one.");
      }
      
      if (error.type === 'user_session_already_exists') {
        throw new Error("Session already exists. Please try logging in.");
      }
    }
    
    throw new Error("Failed to verify OTP. Please try again.");
  }
};

export const getCurrentUser = async () => {
  try {
    const sessionClient = await createSessionClient();

    if (!sessionClient) {
      return null;
    }

    const { databases, account } = sessionClient;

    const result = await account.get();

    const user = await databases.listDocuments(
      appwriteConfig.databaseID,
      appwriteConfig.userCollectionID,
      [Query.equal("accountId", result.$id)]
    );

    if (user.total <= 0) {
      return null;
    }

    return parseStringify(user.documents[0]);
  } catch {
    return null;
  }
};

export const signOutUser = async () => {
  const sessionClient = await createSessionClient();

  try {
    await sessionClient?.account.deleteSession("current");
    (await cookies()).delete("appwrite-session");
  } catch (error) {
    handleError(error, "Failed to sign out user");
  } finally {
    redirect("/sign-in");
  }
};

export const signInUser = async ({ email }: { email: string }) => {
  try {
    const existingUser = await getUserByEmail(email);
    
    if (!existingUser) {
      throw new Error("No account found with this email address. Please sign up first.");
    }

    const accountId = await sendEmailOTP({ email });
    if (!accountId) {
      throw new Error("Failed to send OTP");
    }

    return parseStringify({ accountId });
  } catch (error) {
    handleError(error, "Failed to sign in user");
  }
};