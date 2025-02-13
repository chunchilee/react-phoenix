import { redirect } from 'react-router-dom';
import { account } from '../../lib/appwrite';
import generateID from '../../utils/generateID';

const registerAction = async ({ request }) => {
  const formData = await request.formData();
  try {
    await account.create(
      generateID(),
      formData.get('email'),
      formData.get('password'),
      formData.get('name')
    );
  } catch (err) {
    return {
      message: err.message,
    };
  }

  // 創建用戶會話（登入），辦新會員後不用手動登入
  try {
    await account.createEmailPasswordSession(
      formData.get('email'),
      formData.get('password')
    );
  } catch (err) {
    console.log(`Error creating email session: ${err.message}`);
    return redirect('/login');
  }

  return redirect('/');
};

export default registerAction;
