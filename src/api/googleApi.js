// getConversationTitle 函數根據用戶提示生成對話標題。
// getAiResponse 函數根據用戶提示生成 AI 回應。

import model from '../lib/googleAi';

const getConversationTitle = async (userPrompt) => {
  try {
    // 使用模型生成內容，生成對話標題
    const result = await model.generateContent(
      `Given a user prompt, generate a concise and informative title that accurately describes the conversation. Consider keywords, topics, and the overall intent of the prompt. Response in plain text format, not markdown. 
      
      Prompt: ${userPrompt}
      `
    );

    // 返回生成的標題
    return result.response.text();
  } catch (err) {
    // 捕獲錯誤並輸出錯誤信息
    console.log(`Error generating conversation title: ${err.message}`);
  }
};

const getAiResponse = async (userPrompt, chats = []) => {
  const history = [];

  // gemini api 建立即時通訊對話
  chats.forEach(({ user_prompt, ai_response }) => {
    history.push(
      {
        role: 'user',
        parts: [{ text: user_prompt }],
      },
      {
        role: 'model',
        parts: [{ text: ai_response }],
      }
    );
  });

  try {
    // 設置生成配置
    model.generationConfig = { temperature: 1.5 };
    // 開始新的聊天會話，並傳遞聊天歷史
    const chat = model.startChat({ history });
    // 發送用戶提示並獲取回應
    const result = await chat.sendMessage(userPrompt);

    // 返回生成的 AI 回應
    return result.response.text();
  } catch (err) {
    // 捕獲錯誤並輸出錯誤信息
    console.log(`Error generating AI response: ${err.message}`);
  }
};

export { getAiResponse, getConversationTitle };
