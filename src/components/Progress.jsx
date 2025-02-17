import { motion } from "framer-motion"
import PropTypes from "prop-types"

const CircularProgress = ({ classes = '', size = '' }) => {
  return (
    <div
      role="progressbar"
      className={`circular-progress ${size} ${classes}`}
    >
    </div>
  )
}

CircularProgress.propTypes = {
  classes: PropTypes.string,
  size: PropTypes.string
}

const LinearProgress = ({ classes = '' }) => {
  const progressbarVariant = {
    start: { scaleY: 0 },
    end: {
      scaleY: 1,
      transition: {
        when: 'beforeChildren',
        duration: 0.2,
        ease: 'easeOut',
        delay: 0.5
      }
    },
    exit: {
      scaleY: 0,
      transition: {
        duration: 0.1,
        ease: 'easeOut'
      }
    }
  }

  const activeIndicatorVariant = {
    start: { translateX: '-100%' },
    end: { translateX: '100%' }
  }
  return (
    <motion.div
      className={`linear-progress ${classes}`}
      variants={progressbarVariant}
      initial='start'
      animate='end'
      exit='exit'
      role='progressbar'
    >
      <motion.div
        className="active-indicator"
        variants={activeIndicatorVariant}
        transition={{
          repeat: Infinity,
          duration: 1.5,
          ease: [0.2, 0, 0, 1]
        }}
      >

      </motion.div>
    </motion.div>
  )
}

LinearProgress.propTypes = {
  classes: PropTypes.string
}


export { CircularProgress, LinearProgress }

