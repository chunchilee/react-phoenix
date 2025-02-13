import { redirect } from 'react-router-dom';

import { account } from '../../lib/appwrite';

const loginLoader = async () => {
  try {
    // 嘗試檢查使用者的帳戶訊息
    await account.get();
  } catch (err) {
    console.log(`Error getting user session: ${err.message}`);
    return null;
  }
  return redirect('/');
};

export default loginLoader;
