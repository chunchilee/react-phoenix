import { redirect } from 'react-router-dom';

import { account } from '../../lib/appwrite';

const resetPasswordLoader = async ({ request }) => {
  // 不是在組件中使用，無法使用react router
  // 將請求的 URL 轉換為 URL 對象
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
