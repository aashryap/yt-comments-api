import config from "../keys/google_keys.json";

export const YT_CONFIG = {
  oauthCredential: {
    clientId: config.web.client_id,
    clientSecret: config.web.client_secret,
    scopes: config.web.scopes,
    redirectionUris: ["http://localhost:3000"],
  },
};
