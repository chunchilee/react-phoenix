import { redirect } from 'react-router-dom';
import { getAiResponse, getConversationTitle } from '../../api/googleApi';
import { account, databases } from '../../lib/appwrite';
import generateID from '../../utils/generateID';

// 對話框提交表單後，新增新的會話
const userPromptAction = async (formData) => {
  const userPrompt = formData.get('user_prompt');
  const user = await account.get();
  const conversationTitle = await getConversationTitle(userPrompt); // 根據用戶提示生成對話標題

  let conversation = null;

  try {
    // 嘗試創建一個新的對話文檔，並捕獲任何錯誤
    conversation = await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversations',
      generateID(),
      {
        title: conversationTitle,
        user_id: user.$id,
      }
    );
  } catch (err) {
    console.log(`Error creating conversation: ${err.message}`);
  }

  const aiResponse = await getAiResponse(userPrompt); // 獲取 AI 回應

  try {
    // 嘗試創建一個新的聊天文檔，並捕獲任何錯誤
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'chats',
      generateID(),
      {
        user_prompt: userPrompt,
        ai_response: aiResponse,
        conversation: conversation.$id,
      }
    );
  } catch (err) {
    console.log(`Error creating chats: ${err.message}`);
  }

  return redirect(`/${conversation.$id}`);
};
// 刪除指定 id、title 的會話
const conversationAction = async (formData) => {
  // 刪除資料後回傳給 snackbar 顯示出來
  const conversationId = formData.get('conversation_id');
  const conversationTitle = formData.get('conversation_title');

  try {
    await databases.deleteDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversations',
      conversationId
    );

    return { conversationTitle };
  } catch (err) {
    console.log(`Error in deleting conversation: ${err.message}`);
  }
};

const appAction = async ({ request }) => {
  const formData = await request.formData();
  const requestType = formData.get('request_type');

  if (requestType === 'user_prompt') {
    return await userPromptAction(formData);
  }

  if (requestType === 'delete_conversation') {
    return await conversationAction(formData);
  }
};

export default appAction;
