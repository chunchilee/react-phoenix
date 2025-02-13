import Snackbar from "../components/Snackbar";

import PropTypes from "prop-types";
import { createContext, useCallback, useMemo, useRef, useState } from "react";

const initialCtxValue = {
  snackbar: {
    open: false,
    message: '',
    type: 'info'
  },
  showSnackbar: ({ message, type = 'info', timeout = 5000 }) => { },
  hideSnackbar: () => { },
}

export const SnackbarContext = createContext(initialCtxValue);

const SnackbarProvider = ({ children }) => {

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    type: 'info'
  })

  const timeoutRef = useRef();

  const showSnackbar = useCallback(({ message, type = 'info', timeOut = 5000 }) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);

    setSnackbar({ open: true, message, type })

    timeoutRef.current = setTimeout(() => {
      setSnackbar((prev) => {
        return { ...prev, open: false }
      })
    }, timeOut)
  }, [])

  const hideSnackbar = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setSnackbar({ open: false, message: '', type: 'info' })
  }, [])

  const contextValue = useMemo(() => {
    return { showSnackbar, hideSnackbar }
  }, [showSnackbar, hideSnackbar])

  return (
    <SnackbarContext.Provider value={contextValue}>
      {children}
      <Snackbar snackbar={snackbar} />
    </SnackbarContext.Provider>
  )
}

SnackbarProvider.prototypes = {
  children: PropTypes.any,
}

export default SnackbarProvider