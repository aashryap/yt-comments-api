const constants = {
  DB_URI: 'mongodb://localhost:27017/dnomrm_db',
  PORT: 4000,
  SCOPES: {
    SUPERADMIN: [1],
    ADMIN: [2],
    USER: [3],
    ALL: [1, 2, 3],
    ADMINS: [1, 2],
    NOSCOPE: []
  }
}

export default constants
