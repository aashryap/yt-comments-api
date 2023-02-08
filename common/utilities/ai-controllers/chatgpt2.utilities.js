const { Configuration, OpenAIApi } = require("openai");
const API_KEY = "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";

const configuration = new Configuration({
  apiKey: API_KEY,
});

const openai = new OpenAIApi(configuration);

export const generateText = async (string) => {
  return new Promise((resolve, reject) => {
    openai
      .createCompletion({
        model: "text-davinci-003",
        prompt: string,
        temperature: 0.9,
        max_tokens: 300,
      })
      .then((completion) => {
        resolve(completion.data.choices[0].text);
      })
      .catch((error) => {
        if (error.response) {
          //   console.error(error.response.status, error.response.data);
          reject(error);
        } else {
          //   console.error(`Error with OpenAI API request: ${error.message}`);
          reject(error);
        }
      });
  });
};
