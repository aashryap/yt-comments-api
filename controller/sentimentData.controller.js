/* eslint-disable standard/no-callback-literal */
import models from "../db/models";
import { saveSentimentData } from "../db/ModelUtilities/sentimentData.modelUtilities";
import { getDataOnSentimentalAnalysis } from "../common/utilities/ai-controllers/youtube.utilities";

class SentimentController {
  generateSentimentData(req, cb) {
    const videoUrls = req.body;
    getDataOnSentimentalAnalysis({ videoUrls })
      .then((data) => {
        cb(200, data, "Data Created");
      })
      .catch((err) => {
        console.log(err);
        cb(500, err);
      });
  }
}

export default SentimentController;
