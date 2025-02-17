import PropTypes from "prop-types"

import AiResponse from "./AiResponse"
import UserPrompt from "./UserPrompt"

import Skeleton from "../components/Skeleton"

// 對話框送出後，等待期間的畫面顯示
const PromptPreloader = ({ promptValue }) => {
  return (
    <div className="max-w-[700px] mx-auto">
      <UserPrompt text={promptValue} />

      <AiResponse >
        <Skeleton />
      </AiResponse>
    </div>
  )
}

PromptPreloader.propTypes = {
  promptValue: PropTypes.string,
}

export default PromptPreloader