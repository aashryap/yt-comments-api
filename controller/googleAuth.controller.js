/* eslint-disable standard/no-callback-literal */
import models from "../db/models";
import { google } from "googleapis";
import { YT_CONFIG } from "../configs/yt.config";

// const google = googleApis.google;
const OAuth2 = google.auth.OAuth2;

class GoogleAuthController {
  authenticate(req, cb) {
    const oauth2Client = new OAuth2(
      YT_CONFIG.oauthCredential.clientId,
      YT_CONFIG.oauthCredential.clientSecret,
      YT_CONFIG.oauthCredential.redirectionUris[0]
    );

    const loginLink = oauth2Client.generateAuthUrl({
      accessType: "offline",
      scope: YT_CONFIG.oauthCredential.scopes,
    });

    cb(
      200,
      {
        loginLink: loginLink,
      },
      "loginLink created"
    );
  }

  getYoutubeDetails(req, cb) {
    const code = req.body.code;
    console.log("CODE ====", req.body.code);
    const oauth2Client = new OAuth2(
      YT_CONFIG.oauthCredential.clientId,
      YT_CONFIG.oauthCredential.clientSecret,
      YT_CONFIG.oauthCredential.redirectionUris[0]
    );

    oauth2Client.getToken(code, (err, data) => {
      if (err) {
        console.log(err);
        cb(500, err);
      } else {
        console.log("====", data);
        oauth2Client.credentials = data;
        let service = google.youtube("v3");
        // service.commentThreads.list;
        service.channels
          .list({
            auth: oauth2Client,
            mine: true,
            part: "id, snippet",
            maxResults: 50,
          })
          .then((res) => {
            console.log(res);
            cb(200, res);
          })
          .catch((err) => {
            console.log(err);
            cb(500, err);
          });
      }
    });
  }
}

export default GoogleAuthController;
