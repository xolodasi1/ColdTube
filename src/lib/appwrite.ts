import { Client, Account, Databases } from 'appwrite';

const client = new Client();

// Initialize Appwrite Client
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT || 'https://cloud.appwrite.io/v1')
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID || 'fra-69e4f8980019f8196e7b');

export const account = new Account(client);
export const databases = new Databases(client);

export default client;
