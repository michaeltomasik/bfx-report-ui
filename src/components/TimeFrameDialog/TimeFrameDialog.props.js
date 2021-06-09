import PropTypes from 'prop-types'

export const propTypes = {
  isOpen: PropTypes.bool.isRequired,
  end: PropTypes.number,
  start: PropTypes.number,
  timezone: PropTypes.string.isRequired,
  toggleDialog: PropTypes.func.isRequired,
}

export const defaultProps = {
  start: 0,
  end: 0,
}
