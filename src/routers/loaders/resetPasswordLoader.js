import { redirect } from 'react-router-dom';

import { account } from '../../lib/appwrite';

const resetPasswordLoader = async ({ request }) => {
  const url = new URL(request.url);
  try {
    // 嘗試檢查使用者的帳戶訊息
    await account.get();
    return redirect('/');
  } catch (err) {
    console.log(`Error getting user session: ${err.message}`);
  }

  if (!url.searchParams.get('userId') && !url.searchParams.get('secret')) {
    return redirect('/reset-link');
  }

  return null;
};

export default resetPasswordLoader;
