import UserRoute from "./user.route";
import CompanyRoute from "./company.route";
import SentimentRoute from "./sentiments.route";
import GoogleAuthRoute from "./googleAuth.route";
import express from "express";

class Routes {
  constructor() {
    this.userRoute = new UserRoute();
    this.companyRoute = new CompanyRoute();
    this.sentimentRoute = new SentimentRoute();
    this.googleAuthRoute = new GoogleAuthRoute();
  }

  render(app, router) {
    this.userRoute.create(app, router);
    this.companyRoute.create(app, router);
    this.sentimentRoute.create(app, router);
    this.googleAuthRoute.create(app, router);
    app.use(express.static("media"));
    app.use(router);
  }
}

export default Routes;
