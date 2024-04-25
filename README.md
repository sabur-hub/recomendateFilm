# Movie Description Chatbot

This project utilizes the Google Generative AI library to interact with a chatbot for retrieving movie descriptions and recommendations based on user input.

## Getting Started

To get started with this project, follow these steps:

1. Clone the repository to your local machine.
2. Install dependencies using `npm install`.
3. Set up your Google Generative AI API key as an environment variable (see "Set up your API key" section below).
4. Run the script using `node movie_chatbot.js`.

### Set up your API key

Before running the script, you need to obtain an API key from Google Generative AI. Follow the steps below:

1. Sign up for the Google Generative AI service and obtain your API key.
2. Set your API key as an environment variable named `GENERATIVE_AI_API_KEY`.

## Usage

1. Run the script using `node movie_chatbot.js`.
2. Follow the prompts to interact with the chatbot.
3. Enter the movie title and release year in JSON format when prompted.
4. The chatbot will respond with the movie description and recommendations.

## Example

```javascript
const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");

// Access your API key as an environment variable
const genAI = new GoogleGenerativeAI(process.env.GENERATIVE_AI_API_KEY);
let jsonData; // Variable to store fetched data

// Fetch movie recommendations for user ID 123
fetch('http://localhost:8080/recommendations', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json'
  },
  body: JSON.stringify({ user_id: 123 })
})
.then(response => {
  if (!response.ok) {
    throw new Error('Network response was not ok');
  }
  return response.json();
})
.then(data => {
  // Extract necessary fields from the received data
  const extractedData = data.map(recommendation => ({
    title_orig: recommendation.title_orig,
    release_year: recommendation.release_year
  }));
  
  // Save the extracted data to jsonData variable
  jsonData = extractedData;

  // Log chat history to console
  console.log("Chat History:");
  console.log("Message 1:");
  console.log(`Role: user`);
  console.log(`Text: привет ты бот который будет получать данные в json формате ты должен написать описание фильма по его название и году выпуска сделай рекомендацию договарились? при команде сделать анализ напиши описание! вот данные ${JSON.stringify(jsonData)}`);
  console.log("--------------------");
  console.log("Message 2:");
  console.log(`Role: model`);
  console.log(`Text: договарились! напишите пожалуйста сделать анализ`);
  console.log("--------------------");

  // Initiate chat session with Generative AI model
  async function run() {
    const model = genAI.getGenerativeModel({ model: "gemini-pro"});
    const chat = model.startChat({
      history: [
        {
          role: "user",
          parts: [{ text: `Привет! Я твой персональный кино-гуру. Предоставь мне название и год выпуска фильма в JSON формате, и я вытащу для тебя его описание, а также дам рекомендацию. Договорились? При команде 'сделать анализ' жди подробное описание! Вот данные: ${JSON.stringify(jsonData)}` }],
        },
        {
          role: "model",
          parts: [{ text: "договарились! напишите пожалуйста сделать анализ" }],
        },
      ],
      
      generationConfig: {
        maxOutputTokens: 10000,
      },
    });

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout
    });

    // Function to ask user input
    async function askQuestion() {
      rl.question("Введите ваш запрос (для завершения введите 'стоп'): ", async (msg) => {
        if (msg.toLowerCase() === "стоп") {
          rl.close();
          return;
        }
        
        // Check if message is too short
        if (msg.trim().length < 3) {
          console.log("Ваш запрос слишком короткий. Пожалуйста, введите что-то более содержательное.");
          askQuestion(); // Prompt for next input after processing current one
          return;
        }
    
        const result = await chat.sendMessage(msg);
        const response = await result.response;
        const text = response.text();
        console.log(text);
    
        askQuestion(); // Prompt for next input after processing current one
      });
    }
    
    askQuestion();
  }
  
  run();
})
.catch(error => {
  console.error('There was a problem with the fetch operation:', error);
});
