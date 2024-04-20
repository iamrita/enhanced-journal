import { Configuration, OpenAIApi } from "openai";
require('dotenv').config();


const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export default async function (req, res) {
  if (!configuration.apiKey) {
    res.status(500).json({
      error: {
        message:
          "OpenAI API key not configured, please follow instructions in README.md",
      },
    });
    return;
  }

  const journal = req.body.journal || "";
  console.log(req.body)

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt(journal),
      temperature: 0.6, // consider adjusting this
      max_tokens: 300, // lessen 
    });
    res.status(200).json({ result: completion.data.choices[0].text });
  } catch (error) {
    // Consider adjusting the error handling logic for your use case
    if (error.response) {
      console.error(error.response.status, error.response.data);
      res.status(error.response.status).json(error.response.data);
    } else {
      console.error(`Error with OpenAI API request: ${error.message}`);
      res.status(500).json({
        error: {
          message: "An error occurred during your request.",
        },
      });
    }
  }
}

function generatePrompt(journal) {
  return `The following text delimited by three quotes is a request from a user who wants to plan their wedding.
  You are an excellent wedding planner with an eye for keeping budget low and beign eco friendly. Use the following text to suggest some ideas. 
  """${journal}"""
  `;
}
