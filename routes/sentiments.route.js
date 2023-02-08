import Route from "./route";
import { SentimentController } from "../controller";
import constants from "../constants";

class SentimentRoute extends Route {
  constructor(app, router) {
    super();
    this.app = app;
    this.sentimentController = new SentimentController();
    this.router = router;
    this.routeConfig = [
      {
        name: "/",
        method: "get",
        scope: constants.SCOPES.NOSCOPE,
        controller: (req, cb) => cb(200, "Yt Comments APi"),
        auth: false,
      },
      {
        name: "/sentiment",
        method: "post",
        scope: constants.SCOPES.NOSCOPE,
        controller: (req, cb) =>
          this.sentimentController.generateSentimentData(req, cb),
        auth: false,
      },
    ];
  }

  create(app, router) {
    return this.createRoute(this.routeConfig, app, router);
  }
}

export default SentimentRoute;
