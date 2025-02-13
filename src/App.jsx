import { motion } from 'framer-motion'
import { useEffect, useRef } from 'react'
import { Outlet, useActionData, useLoaderData, useLocation, useNavigation, useParams } from 'react-router-dom'

import PageTitle from "./components/PageTitle"
import PromptField from './components/PromptField'
import Sidebar from "./components/Sidebar"
import TopAppBar from "./components/TopAppBar"

import { useSnackbar } from './hooks/useSnackbar'
import { useToggle } from "./hooks/useToggle"

import { usePromptPreloader } from './hooks/usePromptPreloader'
import Greetings from "./pages/Greetings"


const App = () => {
  const [isSidebarOpen, toggleSidebar] = useToggle();
  const { showSnackbar } = useSnackbar();
  const chatHistoryRef = useRef();

  // 取得 URL parameters
  const params = useParams();

  // 取得 URL 當前狀態
  const navigation = useNavigation();

  // 傳回最近的 POST 導航表單提交的操作數據，如果還沒有，則傳回未定義
  const actionData = useActionData();

  const location = useLocation();
  const { conversations: { documents: conversationData } } = useLoaderData();
  const hasConversationId = location.pathname === '/' ||
    conversationData.some(id =>
      id.$id === params.conversationId
    )

  // 存取 prompt preloader 狀態，特別是 prompt preloader 的值
  const { promptPreloaderValue } = usePromptPreloader();

  // 頁面首次載入 或 重新載入 且未提交表單的情況
  // 點擊登出為 true
  const isNormalLoad = navigation.state === 'loading' && !navigation.formData;

  // 將刪除的conversationTitle 顯示到 showSnackbar
  useEffect(() => {
    if (actionData?.conversationTitle) {
      showSnackbar({
        message: `Deleted '${actionData.conversationTitle}' conversation.`
      })
    }
  }, [actionData, showSnackbar])

  // 當 promptPreloaderValue 或 charHistoryRef 改變時，取得了 chatHistoryRef 所引用目前的 HTML 元素。然後我們檢查 promptPreloaderValue 是否為真，這表示正在載入新訊息。如果是真的，我們就把聊天記錄平滑地滾動到底部。這確保了加載新內容後最新消息始終可見。
  useEffect(() => {
    const chatHistory = chatHistoryRef.current;
    if (promptPreloaderValue) {

      chatHistory.scroll({
        top: chatHistory.scrollHeight - chatHistory.clientHeight,
        behavior: 'smooth',
      })
    }
  }, [chatHistoryRef, promptPreloaderValue])

  return (
    <>
      <PageTitle title='Phoenix - chat to supercharge your ideas' />
      <div className="lg:grid lg:grid-cols-[320px,1fr]">
        {/* sidebar */}
        <Sidebar isSidebarOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

        {/*Top app bar */}
        <div className="h-dvh grid grid-rows-[max-content,minmax(0,1fr),max-content]">
          <TopAppBar toggleSidebar={toggleSidebar} />

          {/* Main content */}
          <div ref={chatHistoryRef} className="px-5 pb-5 flex flex-col overflow-y-auto">
            <div className="max-w-[840px] w-full mx-auto grow">
              {
                isNormalLoad ? null : (params.conversationId ? (
                  <Outlet />
                ) : (
                  <Greetings />
                ))
              }
            </div>
          </div>

          {/* Prompt field */}
          {
            hasConversationId &&
            <div className="bg-light-background dark:bg-dark-background">
              <div className="max-w-[870px] px-5 w-full mx-auto">
                <PromptField />
                <motion.p
                  initial={{ opacity: 0, translateY: '-4px' }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ duration: 0.2, delay: 0.8, ease: 'easeOut' }}
                  className="text-bodySmall text-center text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant p-3"
                >
                  Phoenix may display inaccurate info, including about people, so double-check its responses.
                  <a
                    href="https://support.google.com/gemini?p=privacy_notice"
                    className="inline underline ms-1"
                    target="_blank"
                  >
                    Your privacy & Gemini Apps
                  </a>
                </motion.p>
              </div>
            </div>
          }
        </div>
      </div >
    </>
  )
}

export default App