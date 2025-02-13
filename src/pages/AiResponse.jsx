import PropTypes from "prop-types"
import Markdown from "react-markdown"
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter"
import { coy, hopscotch } from "react-syntax-highlighter/dist/esm/styles/prism"
import remarkGfm from "remark-gfm"

import { useCallback, useEffect, useState } from "react"
import { iconLogo } from "../assets"
import { IconBtn } from "../components/Button"
import { useSnackbar } from "../hooks/useSnackbar"
import toTitleCase from "../utils/toTitleCase"

const AiResponse = ({ aiResponse, children }) => {
  const [codeTheme, setCodeTheme] = useState('');

  const { showSnackbar, hideSnackbar } = useSnackbar();

  // 偵測用戶的背景顏色
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    setCodeTheme(mediaQuery.matches ? hopscotch : coy) // 黑色 ： 白色

    const themeListener = mediaQuery.addEventListener('change',
      (e) => {
        setCodeTheme(e.matches ? hopscotch : coy)
      }
    )

    return () => mediaQuery.removeEventListener('change', themeListener)
  }, [])

  const handleCopy = useCallback(async (text) => {
    try {
      hideSnackbar();
      await navigator.clipboard.writeText(text);
      showSnackbar({
        message: 'Copied to clipboard',
        timeout: 2500,
      })
    } catch (err) {
      showSnackbar({ message: err.message })
      console.log(`Error copying text to clipboard: ${err.message}`)
    }
  }, [showSnackbar, hideSnackbar])

  // react-markdown：Use custom components (syntax highlight)
  // This function will execute for every code theme
  const code = ({ children, className, ...rest }) => {
    const match = className?.match(/language-(\w+)/); // ['language-javascript', 'javascript', ... ]

    return match ? (
      <>
        <div className="code-block">
          <div className="p-4 pb-0 font-sans">{toTitleCase(match[1])}</div>
          <SyntaxHighlighter
            {...rest}
            PreTag='div'
            language={match[1]}
            style={codeTheme}
            customStyle={{
              marginBlock: '0',
              padding: '2px',
            }}
            codeTagProps={{
              style: {
                padding: '14px',
                fontWeight: '600',
              }
            }}
          >
            {children}
          </SyntaxHighlighter>
        </div>
        <div className="bg-light-surfaceContainer dark:bg-dark-surfaceContainer rounded-t-extraSmall rounded-b-medium flex justify-between items-center h-11 font-sans text-bodyMedium ps-4 pe-2">
          <p>
            Use code
            <a
              className="link ms-2"
              href="https://gemini.google.com/faq#coding"
              target="_blank"
            >
              with caution.
            </a>
          </p>

          <IconBtn
            icon='content_copy'
            size="small"
            title="Copy code"
            onClick={handleCopy.bind(null, children)} // 回傳新函式，點擊後觸發 () => {};
          />
        </div>
      </>
    ) : (<div className={className}>{children}</div>
    )
  }

  return (
    <div className="grid grid-cols-1 items-center gap-1 py-4 md:grid-cols-[max-content,minmax(0,1fr)] md:gap-5">
      <figure className="w-8 h-8 grid place-items-center">
        <img
          src={iconLogo}
          width={32}
          height={32}
          alt='Phoenix logo'
        />
      </figure>

      {children}

      {aiResponse && (
        <div className="markdown-content">
          <Markdown remarkPlugins={[remarkGfm]} components={{ code }}>
            {aiResponse}
          </Markdown>
        </div>
      )}
    </div>
  )
}

AiResponse.propTypes = {
  aiResponse: PropTypes.string,
  children: PropTypes.any,
}

export default AiResponse