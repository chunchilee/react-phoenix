/**
 * Node modules
 */
import PropTypes from "prop-types";
import { useEffect, useRef, useState } from "react";
import { useLoaderData } from "react-router-dom";

/**
 * Component
 */
import Avatar from "../components/Avatar";
import { IconBtn } from "../components/Button";
import { useToggle } from "../hooks/useToggle";

const UserPrompt = ({ text }) => {
  const { user } = useLoaderData();
  const textBoxRef = useRef();
  const [hasMoreContent, setMoreContent] = useState(false);
  const [isExpanded, toggleExpand] = useToggle();

  // 載入文本後，超過畫面收起來
  useEffect(() => {
    setMoreContent(textBoxRef.current.scrollHeight > textBoxRef.current.clientHeight)
  }, [textBoxRef])

  return (
    <div className="grid grid-cols-1 items-start gap-1 py-4 md:grid-cols-[max-content,minmax(0,1fr),max-content] md:gap-5">
      <Avatar name={user?.name} />

      <p
        className={`text-bodyLarge pt-1 whitespace-pre-wrap ${!isExpanded ? 'line-clamp-4' : ''}`}
        ref={textBoxRef}
      >
        {text}
      </p>

      {
        hasMoreContent &&
        <IconBtn
          icon={isExpanded ? 'keyboard_arrow_up' : 'keyboard_arrow_down'}
          onClick={toggleExpand}
          title={isExpanded ? 'Collapse text' : 'Expand text'}
        />
      }
    </div>
  )
}

UserPrompt.propTypes = {
  text: PropTypes.string,
}

export default UserPrompt;