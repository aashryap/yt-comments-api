import Route from "./route";
import { GoogleAuthController } from "../controller";
import constants from "../constants";

class GoogleAuthRoute extends Route {
  constructor(app, router) {
    super();
    this.app = app;
    this.googleAuthController = new GoogleAuthController();
    this.router = router;
    this.routeConfig = [
      {
        name: "/google-auth",
        method: "post",
        scope: constants.SCOPES.NOSCOPE,
        controller: (req, cb) =>
          this.googleAuthController.authenticate(req, cb),
        auth: false,
      },
      {
        name: "/yt-comments",
        method: "post",
        scope: constants.SCOPES.NOSCOPE,
        controller: (req, cb) =>
          this.googleAuthController.getYoutubeDetails(req, cb),
        auth: false,
      },
    ];
  }

  create(app, router) {
    return this.createRoute(this.routeConfig, app, router);
  }
}

export default GoogleAuthRoute;
