import { generateText } from "./chatgpt2.utilities";
import qs from "qs";
import URL from "url";
const axios = require("axios");
require("dotenv").config();
const YT_API_KEY = process.env.YT_KEY;

const getVideoDetails = async (videoIds = []) => {
  const videoIdsString = videoIds.join(",");
  console.log("======", YT_API_KEY);
  const VIDEO_DETAILS_URL = `https://www.googleapis.com/youtube/v3/videos?part=snippet,statistics&id=${videoIdsString}&key=${YT_API_KEY}`;
  try {
    const videoDetails = await axios.get(VIDEO_DETAILS_URL);
    console.log("VIDEO DETAILS ", videoDetails.data.items);
    const videoMetadata = {};
    videoDetails.data.items.forEach((videoDetail) => {
      console.log("ENGAGEMENT COUNT ", {
        commentCount: videoDetail.statistics.commentCount,
        likesCount: videoDetail.statistics.likeCount,
        viewCount: videoDetail.statistics.viewCount,
        engagement:
          (
            (parseInt(videoDetail.statistics.commentCount) +
              parseInt(videoDetail.statistics.likeCount)) /
            parseInt(videoDetail.statistics.viewCount)
          ).toFixed(2) * 100,
      });
      videoMetadata[videoDetail.id] = {
        id: videoDetail.id,
        title: videoDetail.snippet.title,
        channelId: videoDetail.snippet.channelId,
        likeCount: videoDetail.statistics.likeCount,
        viewCount: videoDetail.statistics.viewCount,
        commentCount: videoDetail.statistics.commentCount,
        engagement:
          (
            (parseInt(videoDetail.statistics.commentCount) +
              parseInt(videoDetail.statistics.likeCount)) /
            parseInt(videoDetail.statistics.viewCount)
          ).toFixed(2) * 100,
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
  return `Give me sentimental analysis of a youtube video based on these comments and do not include any comments in the video : + 
          ${comments}`;
};

const removeUnwantedStringFromSentiment = (sentimentString) => {
  const splittedString = sentimentString.split("\n\n");
  if (splittedString.length > 1) {
    return splittedString[1];
  } else if (sentimentString.split("\n").length > 1) {
    return sentimentString.split("\n")[1];
  }
  return sentimentString;
};

export const generateSentimentalTextOnComments = async (videoData) => {
  if (videoData) {
    return getComments(videoData.id)
      .then(async (comments) => {
        if (comments && comments.length > 0) {
          let sentimenalSummary = await generateText(
            getYTSentimentalAnalysisQuery(comments)
          );
          console.log("generated sentimentalSummary : ", { sentimenalSummary });
          const correctedSentimentString =
            removeUnwantedStringFromSentiment(sentimenalSummary);
          return {
            contentId: videoData.id,
            title: videoData.title,
            sentimenalSummary: correctedSentimentString,
            engagement: videoData.engagement,
            likeCount: videoData.likeCount,
            commentCount: videoData.commentCount,
            viewCount: videoData.viewCount,
          };
        } else {
          return {
            contentId: videoData.id,
            title: videoData.title,
            sentimenalSummary:
              "Not able to generate sentiment analysis summary because no comments present on the video",
            engagement: videoData.engagement,
            likeCount: videoData.likeCount,
            commentCount: videoData.commentCount,
            viewCount: videoData.viewCount,
          };
        }
      })
      .catch((err) => {
        console.log(err);
        return {
          contentId: videoData.id,
          title: videoData.title,
          sentimenalSummary:
            "Error genrating sentimental analysis for this video",
        };
      });
  } else {
    return Promise.reject({
      contentId: null,
      title: null,
      sentimenalSummary: "Not able to find details for this video",
    });
  }
};

const validateUrlAndGetPlatform = (url) => {
  const webUrls = ["youtube.com", "www.youtube.com"];
  const mobileUrls = ["youtu.be"];
  const hostName = URL.parse(url, true).hostname;
  if (webUrls.includes(hostName)) {
    const metadata = getContentMetadata(url, "web");
    return {
      isValidUrl: true,
      platform: "web",
      id: metadata.id,
      contentType: metadata.type,
    };
  } else if (mobileUrls.includes(hostName)) {
    const metadata = getContentMetadata(url, "mobile");
    return {
      isValidUrl: true,
      platform: "mobile",
      id: metadata.id,
      contentType: metadata.type,
    };
  }
  return {
    isValidUrl: false,
    platform: null,
  };
};

const getContentMetadata = (url, platform) => {
  const parsedUrl = URL.parse(url, true);
  const pathParams = parsedUrl.path.split("/");
  console.log("PARSED URL ", {
    parsedUrl,
  });
  const type = pathParams[1];
  switch (type) {
    case "shorts":
      return {
        contentType: "shorts",
        id: pathParams[2],
      };
    case "live":
      return {
        contentType: "live",
        id: pathParams[2],
      };
    default:
      return {
        contentType: "video",
        id:
          platform === "web"
            ? extractIdsFromYTVidUrlWeb(url)
            : extractIdsFromYTVidUrlMobile(url),
      };
  }
};

export const getDataOnSentimentalAnalysis = async ({ videoUrls }) => {
  const videoIds = videoUrls
    .map(({ url }) => {
      const obj = validateUrlAndGetPlatform(url);
      console.log("VALIDATED URL ", obj);
      if (obj.isValidUrl) {
        return obj.id;
      }
      return null;
    })
    .filter((d) => {
      return d !== null;
    });
  const videoDetails = await getVideoDetails(videoIds);
  console.log("VIDEO DETAILS ", videoDetails);
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

const extractIdFromShortsUrl = (path) => {};

const extractIdsFromYTVidUrlWeb = (url) => {
  const parsedUrl = URL.parse(url, true);
  const params = qs.parse(parsedUrl.query, { ignoreQueryPrefix: true });
  return params.v;
};

const extractIdsFromYTVidUrlMobile = (url) => {
  const parsedUrl = URL.parse(url, true);
  const pathParams = parsedUrl.path.split("/");
  return pathParams[1];
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
