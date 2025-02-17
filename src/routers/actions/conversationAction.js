import { getAiResponse } from '../../api/googleApi';
import { databases } from '../../lib/appwrite';
import generateID from '../../utils/generateID';

const conversationAction = async ({ request, params }) => {
  const { conversationId } = params;
  const formData = await request.formData();
  const userPrompt = formData.get('user_prompt');

  let chatHistory = []; // 初始化聊天歷史
  let aiResponse = ''; // 初始化 AI 回應變量

  try {
    // 嘗試從數據庫中獲取對話記錄，並將其映射為用戶提示和 AI 回應的對象數組
    const { chats } = await databases.getDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'conversations',
      conversationId
    );

    chatHistory = chats.map(({ user_prompt, ai_response }) => {
      return { user_prompt, ai_response };
    });
  } catch (err) {
    console.log(`Error getting chat: ${err.message}`);
  }

  try {
    // 嘗試根據用戶提示和聊天歷史獲取 AI 回應
    aiResponse = await getAiResponse(userPrompt, chatHistory);
  } catch (err) {
    console.log(`Error getting Gemini response: ${err.message}`);
  }

  try {
    // 嘗試將新的聊天記錄存儲到數據庫中
    await databases.createDocument(
      import.meta.env.VITE_APPWRITE_DATABASE_ID,
      'chats',
      generateID(),
      {
        user_prompt: userPrompt,
        ai_response: aiResponse,
        conversation: conversationId,
      }
    );
  } catch (err) {
    console.log(`Error storing chat: ${err.message}`);
  }

  return null;
};

export default conversationAction;
