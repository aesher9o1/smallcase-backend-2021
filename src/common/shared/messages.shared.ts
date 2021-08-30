export const HttpMessages = {
  OK: {
    code: 'COM001',
    message: 'OK'
  },
  INTERNAL_SERVER_ERROR: {
    code: 'ERR001',
    message: 'Internal server error occured'
  },
  UNAUTHORIZED: {
    code: 'ERR002',
    message: 'User is unauthorized to perform the action'
  },
  NOT_FOUND: {
    code: 'ERR003',
    message: 'Not found'
  },
  TOO_MANY_REQUESTS: {
    code: 'ERR004',
    message: 'Rate limit reaced'
  },
  FORBIDDEN: {
    code: 'ERR005',
    message: 'User is forbidden to perform the action'
  }
}
