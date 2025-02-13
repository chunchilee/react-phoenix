import { AnimatePresence } from "framer-motion"
import { useEffect } from "react"
import { Form, useActionData, useNavigation } from "react-router-dom"

import { banner } from "../assets"
import { useSnackbar } from "../hooks/useSnackbar"

import Button from "../components/Button"
import Logo from "../components/Logo"
import PageTitle from "../components/PageTitle"
import { CircularProgress, LinearProgress } from "../components/Progress"
import TextField from "../components/TextField"

const ResetLink = () => {
  const navigation = useNavigation();
  const actionData = useActionData();

  const { showSnackbar } = useSnackbar();

  useEffect(() => {
    if (actionData?.message) {
      showSnackbar({
        message: actionData.message,
        type: actionData.ok ? 'info' : 'error',
        timeout: 8000,
      })
    }
  }, [actionData, showSnackbar])
  return (
    <>
      <PageTitle title='Reset Password' />

      <div className="relative w-screen h-dvh p-2 grid grid-cols-1 lg:grid-cols-[1fr,1.2fr] lg:gap-2">
        <div className="flex flex-col p-4">
          <Logo classes='mb-auto mx-auto lg:mx-0' />
          <div className="flex flex-col gap-2 max-w-[480px] w-full mx-auto">
            <h2
              className="text-displaySmall font-semibold text-light-onBackground dark:text-dark-onBackground text-center"
            >
              Forget your password?
            </h2>
            <p className="text-bodyLarge text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant mt-1 mb-5 text-center px-2">
              Enter your email, and we&apos;ll send a password reset link.
            </p>
            <Form
              method='Post'
              className='grid grid-cols-1 gap-4'
            >
              <TextField
                type='email'
                name='email'
                label='Email'
                placeholder="Email"
                required={true}
                helperText='The verification link sent to your email address will be valid for 1 hour.'
              />

              <Button
                type='submit'
                disabled={navigation.state === 'submitting'}
              >
                {navigation.state === 'submitting' ? <CircularProgress size='small' /> : 'Get link'}
              </Button>
            </Form>
          </div>
          <p className="mt-auto mx-auto text-light-onSurfaceVariant dark:text-dark-onSurfaceVariant text-bodyMedium lg:mx-0">
            &copy; 2024 phoenix practice. All right reserved
          </p>
        </div>
        <div className="hidden img-box lg:block lg:relative lg:rounded-large ">
          <img src={banner} alt="" className="img-cover" />
          <p className="absolute bottom-10 left-12 right-12 z-10 text-displayLarge font-semibold leading-tight text-right text-light-onSurface drop-shadow-sm 2xl:text-[72px]">
            Chat with Phoenix to superCharge your ideas.
          </p>
        </div>
      </div >

      <AnimatePresence>
        {
          navigation.state === 'loading' &&
          <LinearProgress classes='absolute top-0 left-0 right-0' />
        }
      </AnimatePresence>
    </>
  )
}

export default ResetLink