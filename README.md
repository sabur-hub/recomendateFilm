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

work resul
PS D:\projects\sohibkor.tj\geminiApp\test> node .\history.js
Chat History:
Message 1:
Role: user
Text: привет ты бот который будет получать данные в json формате ты должен написать описание фильма по его название и году выпуска сделай рекомендацию договарились? при команде сделать анализ напиши описание! вот данные [{"title_orig":"Hable con ella","release_year":2002},{"title_orig":"Search Party","release_year":2014},{"title_orig":"45 Years","release_year":2015},{"title_orig":"","release_year":1978},{"title_orig":"","release_year":1960},{"title_orig":"","release_year":2013},{"title_orig":"Red Joan","release_year":2018},{"title_orig":"Blood Child","release_year":2017},{"title_orig":"Angel","release_year":2007},{"title_orig":"Cendrillon au Far West","release_year":2012}]
--------------------
Message 2:
Role: model
Text: договарились! напишите пожалуйста сделать анализ
--------------------
Введите ваш запрос (для завершения введите 'стоп'): сделай анализ
**Hable con ella (Поговори с ней) (2002)**

**Описание:**
Этот захватывающий фильм Педро Альмодовара рассказывает о двух мужчинах, которые находят смысл жизни благодаря женщинам, лежащим в коме. Бенigno (Хавьер Камара), медбрат с нежной чувствительностью, влюбляется в Алисию (Леонор Уотлинг), балерину, впавшую в кому после автокатастрофы. Marco (Дарио Грандинетти), писатель, переживает депрессию после разрыва отношений со своей девушкой. Он встречает Лидию (Росарио Флорес), тореадора, которая также впала в кому. Бенigno и Marco становятся опекунами женщин и начинают глубокие, эмоциональные связи с ними.

**Рекомендация:**
Если вы цените фильмы, исследующие темы любви, потери и человеческой связи, "Поговори с ней" обязателен к просмотру. Его великолепная кинематография, трогательные выступления и провокационная история оставят вас потрясенным и размышляющим.

**Search Party (Поисковый отряд) (2014)**

**Описание:**
Эта черная комедия рассказывает о четырех друзьях, которые отправляются на поиски пропавшей одноклассницы. Порша (Тереза Палмер), Дрю (Алисия Дебнем-Кэри), Натали (Мередит Хагнер) и Марк (Томас Миддлдич) сначала воспринимают это как приключение, но их поездка быстро превращается в опасную одержимость. По мере того, как раскрываются секреты и появляются новые улики, друзья начинают сомневаться в собственной мотивации и в том, действительно ли они хотят найти пропавшую девушку.

**Рекомендация:**
"Поисковый отряд" — это остроумный и сатирический взгляд на культуру социальных сетей и одержимость знаменитостями. Его безупречный темп, симпатичные персонажи и неожиданные повороты заставят вас смеяться и размышлять в равной степени.

**45 Years (45 лет) (2015)**

**Описание:**
Эта душераздирающая драма рассказывает о паре пенсионеров, чья счастливая семейная жизнь неожиданно ставится под угрозу. Кейт (Шарлотта Рэмплинг) и Джефф (Том Кортни) готовятся отпраздновать свою 45-ю годовщину свадьбы, когда Кейт получает письмо, сообщающее о том, что тело ее давно пропавшего первого возлюбленного было найдено в швейцарских Альпах. Воспоминания и старые обиды всплывают на поверхность, заставляя Кейт и Джеффа переосмыслить свой брак и столкнуться с неизбежностью старости и смерти.

**Рекомендация:**
"45 лет" — это мастерски снятый и сыгранный фильм, который исследует сложную динамику долгосрочных отношений. Его трогательный сценарий, глубокие персонажи и проницательная режиссура делают его обязательным к просмотру для всех, кто когда-либо боролся с потерями или переоценивал свой жизненный путь.

**Дополнительные данные:**
- Отсутствующие названия и годы выпуска фильмов в предоставленном вами списке не позволяют мне предоставить описания и рекомендации для них.
Введите ваш запрос (для завершения введите 'стоп'):
