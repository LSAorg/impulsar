export const API_ROOT_URL = window.location.toString().includes('localhost')
  ? '/api'
  : `${window.location.protocol}//${window.location.host.replace('app', 'api')}`
export const API_DEFAULT_TIMEOUT_MS = 15000
