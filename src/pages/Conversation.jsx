import { motion } from 'framer-motion';
import { useLoaderData, useLocation } from "react-router-dom";

import PageTitle from "../components/PageTitle";
import AiResponse from './AiResponse';
import PromptPreloader from './PromptPreloader';
import UserPrompt from './UserPrompt';

import { usePromptPreloader } from '../hooks/usePromptPreloader';

const Conversation = () => {
  const { conversation: { title, chats } } = useLoaderData() || {};

  // 取得 loader 預加載 value
  const { promptPreloaderValue } = usePromptPreloader();
  // 獲得當前 URL location information
  const location = useLocation();

  return (
    <>
      <PageTitle title={`${title} | Phoenix`} />
      <motion.div
        className='max-w-[700px] mx-auto !will-change-auto'
        initial={!location.state?._isRedirect_ && { opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, delay: 0.5, ease: 'easeOut' }}
      >
        {chats.map((chat) => (
          <div key={chat.$id}>
            <UserPrompt text={chat.user_prompt} />
            <AiResponse aiResponse={chat.ai_response} />
          </div>
        ))}
      </motion.div>

      {
        promptPreloaderValue && <PromptPreloader promptValue={promptPreloaderValue} />
      }
    </>
  )
}

export default Conversation