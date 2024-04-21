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
  const theme = (req.body.theme + "wedding") || ""
  console.log("amrita" + req.body)

  try {
    const completion = await openai.createCompletion({
      model: "gpt-3.5-turbo-instruct",
      prompt: generatePrompt(journal),
      temperature: 0.6, // consider adjusting this
      max_tokens: 500, // lessen 
    });
    const image =
      await openai.createImage({
        prompt: theme,
        n: 1,
        size: "512x512",
      });
    console.log("amrita " + image.data.data[0].url);
    res.status(200).json({ result: completion.data.choices[0].text, image: image.data.data[0].url });
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
  return journal;
}
