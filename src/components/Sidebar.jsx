import { motion } from 'framer-motion'
import PropTypes from "prop-types"
import { NavLink, useLoaderData, useParams, useSubmit } from "react-router-dom"

import deleteConversation from '../utils/deleteConversation'

import { ExtendedFab, IconBtn } from "./Button"
import Logo from "./Logo"

const Sidebar = ({ isSidebarOpen, toggleSidebar }) => {
  const { conversations: { documents: conversationData } } = useLoaderData() || {};
  const submit = useSubmit();

  // 取得路徑參數來判斷 ExtendedFab 組件可否點擊
  const { conversationId } = useParams();

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.2, ease: 'easeInOut' }}
        className={`sidebar ${isSidebarOpen ? 'active' : ''}`}
      >
        <div className="sidebar-inner">
          <div className="h-16 grid items-center px-4 mb-4">
            {/* Logo */}
            <Logo />
          </div>

          <ExtendedFab
            href='/'
            text='New chat'
            classes="mb-4"
            onClick={toggleSidebar}
            disabled={!conversationId}
          />

          <div className="overflow-y-auto -me-2 pe-1">
            <p className="text-titleSmall h-9 grid items-center px-4">Recent</p>

            <nav>
              {conversationData.map((item) => (
                <div className="relative group" key={item.$id}>
                  <NavLink
                    to={item.$id}
                    className='nav-link'
                    title={item.title}
                    onClick={toggleSidebar}
                  >
                    <span
                      className="material-symbols-rounded icon-small"
                    >
                      chat_bubble
                    </span>

                    <span className="truncate">
                      {item.title}
                    </span>

                    <div className="state-layer"></div>
                  </NavLink>

                  <IconBtn
                    icon='delete'
                    size='small'
                    classes="absolute top-1/2 right-1.5 -translate-y-1/2 z-10 opacity-0 group-hover:opacity-100 group:focus-within:opacity-100 hidden lg:grid"
                    title='Delete'
                    onClick={() => {
                      deleteConversation({
                        id: item.$id,
                        title: item.title,
                        submit
                      })
                    }}
                  />
                </div>
              ))}
            </nav>
          </div>

          <div className="mt-4 h-14 grid items-center text-labelLarge text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant border-t border-light-surfaceContainerHigh dark:border-dark-surfaceContainerHigh truncate"> &copy; 2024 phoenix practice. All right reserved</div>
        </div>
      </motion.div >

      <div
        className={`overlay ${isSidebarOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
      ></div>
    </>
  )
}

Sidebar.propTypes = {
  isSidebarOpen: PropTypes.bool,
  toggleSidebar: PropTypes.func
}

export default Sidebar