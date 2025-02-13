import { Query } from 'appwrite';
import { redirect } from 'react-router-dom';
import { account, databases } from '../../lib/appwrite';

const appLoader = async () => {
  const data = {};

  try {
    data.user = await account.get();
  } catch (err) {
    console.log(`Error getting user session: ${err.message}`);
    return redirect('/login');
  }

  // 列出 appWrite client conversation 資料
  try {
    data.conversations = await databases.listDocuments(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversations',
      [
        Query.select(['$id', 'title']),
        Query.orderDesc('$createdAt'),
        Query.equal('user_id', data.user.$id),
      ]
    );
  } catch (err) {
    console.log(`Error getting conversation: ${err.message}`);
  }

  return data;
};

export default appLoader;
