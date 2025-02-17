import { AnimatePresence } from "framer-motion"
import PropTypes from "prop-types"
import { useLoaderData, useNavigate, useNavigation, useParams, useSubmit } from "react-router-dom"

import Avatar from "./Avatar"
import { IconBtn } from "./Button"
import Logo from "./Logo"
import { LinearProgress } from "./Progress"

import { useToggle } from "../hooks/useToggle"
import deleteConversation from "../utils/deleteConversation"
import logout from "../utils/logout"

import Menu from "./Menu"
import MenuItem from "./MenuItem"


const TopAppBar = ({ toggleSidebar }) => {
  const navigate = useNavigate(); // 主動跳轉
  const navigation = useNavigation(); // 監測載入狀態
  const [showMenu, setShowMenu] = useToggle();

  const { conversations, user } = useLoaderData(); // 當前登入的使用者資料
  const params = useParams(); // 取得當前 URL conversationId
  const submit = useSubmit();

  const isNormalLoad = navigation.state === 'loading' && !navigation.formData;
  return (
    <header className="relative flex justify-between items-center h-16 px-4">
      <div className="flex items-center gap-1">
        <IconBtn
          icon='menu'
          title='Menu'
          classes="lg:hidden"
          onClick={toggleSidebar}
        />
        <Logo classes="lg:hidden" />
      </div>

      {
        params.conversationId && (
          <IconBtn
            icon='delete'
            classes="ms-auto me-1 lg:hidden"
            onClick={() => {
              const { title } = conversations.documents.find(({ $id }) => params.conversationId === $id
              );

              deleteConversation({
                id: params.conversationId,
                title,
                submit
              })
            }
            }
          />
        )
      }

      <div className="menu-wrapper">
        <IconBtn onClick={setShowMenu}>
          <Avatar name={user.name} />
        </IconBtn>

        <Menu classes={showMenu ? 'active' : ''}>
          <MenuItem labelText='Log out' onClick={() => logout(navigate)} />
        </Menu>
      </div>

      <AnimatePresence>
        {isNormalLoad &&
          <LinearProgress classes="absolute top-full left-0 right-0 z-10" />
        }
      </AnimatePresence>
    </header>
  )
}

TopAppBar.propTypes = {
  toggleSidebar: PropTypes.func
}

export default TopAppBar