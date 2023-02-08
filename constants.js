const USERNAME = "Interceptor650";
const PASSWORD = "Abc123";
const constants = {
  //   DB_URI: 'mongodb://localhost:27017/dnomrm_db',
  DB_URI: `mongodb+srv://${USERNAME}:${PASSWORD}@cluster0.e61pz7c.mongodb.net/?retryWrites=true&w=majority`,
  PORT: 4000,
  SCOPES: {
    SUPERADMIN: [1],
    ADMIN: [2],
    USER: [3],
    ALL: [1, 2, 3],
    ADMINS: [1, 2],
    NOSCOPE: [],
  },
};

export default constants;
