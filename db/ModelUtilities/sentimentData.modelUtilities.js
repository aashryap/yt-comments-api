import models from "../models/index";

export const saveSentimentData = (sentimentData) => {
  const sentimentObj = {
    contentId: sentimentData.contentId,
    sentimentSummary: sentimentData.sentimentSummary,
    sentimentScore: 0,
  };
  return models.sentimentData
    .create(sentimentObj)
    .then((data) => {
      console.log("CREATED SENTIMENT DATA : ", data);
      return data;
    })
    .catch((err) => {
      console.log("ERROR IN CREATING SENTIMENT RECORD ", err);
      return err;
    });
};
