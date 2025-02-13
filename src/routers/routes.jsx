/**
 * action 在表單提交時執行邏輯，處理數據創建或更新，並返回結果或進行重定向
 * loader 在路由渲染之前加載數據，確保組件在渲染時擁有所需的數據
 * navigate 需要主動跳轉到其他頁面時（如按鈕點擊跳轉）
 * navigation 需要顯示載入狀態（loading），例如在 loader 或 action 處理請求時
*/
import { createBrowserRouter } from "react-router-dom";

/**
 * pages
*/
import App from "../App";
import Conversation from "../pages/Conversation";
import ConversationError from "../pages/ConversationError";
import Login from '../pages/Login';
import Register from "../pages/Register";
import ResetLink from "../pages/ResetLink";
import ResetPassword from "../pages/ResetPassword";

/**
 * actions
 */
import appAction from "./actions/appAction";
import conversationAction from "./actions/conversationAction";
import loginAction from "./actions/loginAction";
import registerAction from "./actions/registerAction";
import resetLinkAction from "./actions/resetLinkAction";
import resetPasswordAction from "./actions/resetPasswordAction";

/**
 * loaders
 */
import RootError from "../pages/RootError";
import appLoader from "./loaders/appLoader";
import conversationLoader from "./loaders/conversationLoader";
import loginLoader from "./loaders/loginLoader";
import registerLoader from "./loaders/registerLoader";
import resetLinkLoader from "./loaders/resetLinkLoader";
import resetPasswordLoader from "./loaders/resetPasswordLoader";

const routes = createBrowserRouter([
  {
    path: '/',
    element: <App />,
    loader: appLoader,
    action: appAction,
    errorElement: <RootError />,
    children: [
      {
        path: '/:conversationId', // 動態路由參數
        element: <Conversation />,
        loader: conversationLoader,
        action: conversationAction,
        errorElement: <ConversationError />
      }
    ]
  },
  {
    path: '/register',
    element: <Register />,
    loader: registerLoader,
    action: registerAction,
  },
  {
    path: '/login',
    element: <Login />,
    loader: loginLoader,
    action: loginAction,
  },
  {
    path: '/reset-link',
    element: <ResetLink />,
    action: resetLinkAction,
    loader: resetLinkLoader
  },
  {
    path: '/reset-password',
    element: <ResetPassword />,
    action: resetPasswordAction,
    loader: resetPasswordLoader
  }
])

export default routes