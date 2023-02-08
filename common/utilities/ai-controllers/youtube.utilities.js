import { generateText } from "./chatgpt2.utilities";
import qs from "qs";
import URL from "url";
const axios = require("axios");

const YT_API_KEY = "AIzaSyB16XM3fFzZZJJgStI0ba5yyKw8K7pGqZ8";
// const VIDEO_ID = "nyRq9qWv9W0";
const VIDEO_ID = "PSoECRce9_o";

const VIDEO_IDS = [
  "PSoECRce9_o",
  "BrDrUZjcSkg",
  "2coIKErAxUY",
  "wi4pWa9UrOE",
  "oe-sSKvDImM",
  "bK0IYpsCA3E",
];

const getVideoDetails = async (videoIds = []) => {
  const videoIdsString = videoIds.join(",");
  const VIDEO_DETAILS_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIdsString}&key=${YT_API_KEY}`;
  try {
    const videoDetails = await axios.get(VIDEO_DETAILS_URL);
    console.log("VIDEO DETAILS ", videoDetails.data.items);
    const videoMetadata = {};
    videoDetails.data.items.forEach((videoDetail) => {
      videoMetadata[videoDetail.id] = {
        id: videoDetail.id,
        title: videoDetail.snippet.title,
        channelId: videoDetail.snippet.channelId,
      };
    });
    return videoMetadata;
  } catch (error) {
    console.error("=======", error);
  }
};

const getComments = async (videoId) => {
  const API_URL = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&key=${YT_API_KEY}&maxResults=500`;
  try {
    const response = await axios.get(API_URL);
    const comments = response.data.items.map(
      (item) => item.snippet.topLevelComment.snippet.textDisplay
    );
    return comments;
  } catch (error) {
    console.error(error);
  }
};

const getYTSentimentalAnalysisQuery = (comments = "") => {
  comments = comments.slice(0, 50);
  return `Give me sentimental analysis of a youtube video based on these comments : + 
          ${comments}`;
};

export const generateSentimentalTextOnComments = async (videoData) => {
  return getComments(videoData.id)
    .then(async (comments) => {
      //   console.log("COMMENTS ", comments);
      if (comments && comments.length > 0) {
        let sentimenalSummary = await generateText(
          getYTSentimentalAnalysisQuery(comments)
        );
        return {
          contentId: videoData.id,
          title: videoData.title,
          sentimenalSummary,
        };
      } else {
        return {
          contentId: videoData.id,
          title: videoData.title,
          sentimenalSummary:
            "Not able to generate sentiment analysis summary because no comments present on the video",
        };
      }
    })
    .catch((err) => {
      return {
        contentId: videoData.id,
        title: videoData.title,
        sentimenalSummary:
          "Error genrating sentimental analysis for this video",
      };
    });
};

export const getDataOnSentimentalAnalysis = async ({ videoUrls }) => {
  const videoIds = videoUrls.map(({ url }) => extractIdsFromYTVidUrl(url));
  const videoDetails = await getVideoDetails(videoIds);

  const videoMetadata = videoIds.map((v_id) => {
    return videoDetails[v_id];
  });

  const sentimentDataPromises = videoMetadata.map((videoData) => {
    return generateSentimentalTextOnComments(videoData);
  });

  return new Promise((resolve, reject) => {
    Promise.all(sentimentDataPromises)
      .then((data) => {
        console.log("getDataOnSentimentalAnalysis : ", data);
        resolve(data);
      })
      .catch((err) => {
        console.log("getDataOnSentimentalAnalysis Err : ", err);
        reject(err);
      });
  });
};

export const extractIdsFromYTVidUrl = (url) => {
  const parsedUrl = URL.parse(url, true);
  const params = qs.parse(parsedUrl.query, { ignoreQueryPrefix: true });
  return params.v;
};

export const getYoutubeVideoListForAChannel = ({ channel_id }) => {
  axios(
    `https://www.googleapis.com/youtube/v3/lists?part=snippet&channelId=${channel_id}&key=${YT_API_KEY}`
  )
    .then((data) => {
      console.log("getYoutubeVideoListForAChannel : ", { data });
    })
    .catch((err) => {
      console.log("getYoutubeVideoListForAChannel Err : ", err);
    });
};

export const getYoutubeVideoChannelDetailsUsingChannelName = ({
  channel_name,
}) => {
  axios(
    `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${channel_name}&key=${YT_API_KEY}`
  )
    .then((response) => {
      console.log("getYoutubeVideoChannelDetailsUsingChannelName :", {
        data: response.data,
      });
    })
    .catch((err) => {
      console.log("getYoutubeVideoChannelDetailsUsingChannelName err : ", err);
    });
};
