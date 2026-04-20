import { Client, Databases } from 'appwrite';

const client = new Client()
    .setEndpoint('https://cloud.appwrite.io/v1')
    .setProject('69e4f8980019f8196e7b');

const databases = new Databases(client);

databases.listDocuments('69e4fb2b003213a395fe', 'videos')
    .then(console.log)
    .catch(console.error);
