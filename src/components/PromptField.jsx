import { motion } from 'framer-motion';
import { IconBtn } from './Button';

import { useCallback, useRef, useState } from "react";
import { useNavigation, useParams, useSubmit } from 'react-router-dom';

const PromptField = () => {
  const inputField = useRef();
  const inputFieldContainer = useRef();
  const debounceTimeout = useRef(null);

  const [placeholderShown, setPlaceholderShown] = useState(true);
  const [isMultiline, setMultiline] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isComposing, setIsComposing] = useState(false);

  const submit = useSubmit(); // 手動提交
  const navigation = useNavigation() // 初始導航檢查
  const { conversationId } = useParams(); // router child pathURL

  // 輸入欄位改變，300ms 的 debounce 時間
  const handleInputChange = useCallback(() => {
    if (debounceTimeout.current) {
      clearTimeout(debounceTimeout.current);
    }

    debounceTimeout.current = setTimeout(() => {
      if (inputField.current.innerText === '\n') { inputField.current.innerHTML = '' };

      setPlaceholderShown(!inputField.current.innerText);
      setMultiline(inputFieldContainer.current.clientHeight > 64);
      setInputValue(inputField.current.innerText.trim());
    }, 300);
  }, []);

  // 複製貼上鼠標移動到最後
  const moveCursorToEnd = useCallback(() => {
    const editableElem = inputField.current;
    const range = document.createRange();
    const selection = window.getSelection();

    range.selectNodeContents(editableElem); // range 內部指向該元素的所有子內容，而非元素本身
    range.collapse(false); // 將 range 折疊到內容的結尾

    selection.removeAllRanges(); // 確保新的 range 被正確應用，避免干擾
    selection.addRange(range); // 讓游標移動到 range 所定義的位置，也就是 editableElem 的末尾
  }, [])

  // 複製貼上
  const handlePaste = useCallback((e) => {
    e.preventDefault();
    inputField.current.innerText += e.clipboardData.getData('text');
    handleInputChange();
    moveCursorToEnd();
  }, [handleInputChange, moveCursorToEnd])

  // <div contentEditable onKeydown /> 提交表單
  const handleSubmit = useCallback(() => {
    // 如果輸入為空或表單提交正在進行，則阻止提交
    if (!inputValue || navigation.state === 'submitting') return;

    submit(
      {
        user_prompt: inputValue,
        request_type: 'user_prompt',
      },
      {
        method: 'POST',
        encType: 'application/x-www-form-urlencoded', // 提交表單時使用的編碼
        action: `/${conversationId || ''}` // 用於提交表單操作的 URL 路徑
      },
    )

    inputField.current.innerHTML = '';
    handleInputChange();
  }, [handleInputChange, inputValue, navigation.state, submit, conversationId])

  const promptFieldVariant = {
    hidden: { scaleX: 0 },
    visible: {
      scaleX: 1,
      transition: {
        when: 'beforeChildren',
        staggerChildren: 0.2,
        duration: 0.4,
        delay: 0.4,
        ease: [0.05, 0.7, 0.1, 1]
      }
    }
  };

  const promptFieldChildrenVariant = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };


  return (
    <motion.div
      className={`prompt-field-container ${isMultiline ? 'rounded-large' : ''}`}
      variants={promptFieldVariant}
      initial='hidden'
      animate='visible'
      ref={inputFieldContainer}
    >
      <motion.div // 可編輯區塊擁有動畫效果 
        className={`prompt-field ${placeholderShown ? '' : 'after:hidden'}`} // placeholder
        contentEditable={true} // 讓 div 變成可編輯的區域
        role='textbox'
        aria-multiline={true}
        aria-label='Enter a prompt here'
        data-placeholder='Enter a prompt here' // css placeholder after
        variants={promptFieldChildrenVariant}
        ref={inputField}
        onInput={handleInputChange} // 監聽用戶輸入並獲取內容
        onPaste={handlePaste}
        onCompositionStart={() => setIsComposing(true)}
        onCompositionEnd={() => setIsComposing(false)}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && !e.shiftKey && !isComposing) {
            e.preventDefault();
            handleSubmit();
          }
        }}
      >
      </motion.div>
      <IconBtn
        icon='send'
        title='Submit'
        size='large'
        classes='ms-auto'
        variants={promptFieldChildrenVariant}
        onClick={handleSubmit}
      />

      <div className="state-layer"></div>
    </motion.div>
  )
}

export default PromptField