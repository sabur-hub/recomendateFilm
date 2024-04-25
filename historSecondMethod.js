const { GoogleGenerativeAI } = require("@google/generative-ai");
const readline = require("readline");

// Access your API key as an environment variable (see "Set up your API key" above)
const genAI = new GoogleGenerativeAI('AIzaSyB-qTBRb0Z4CqkzngZ3k4UKheXrjIDP_eU');
let jsonData; // Объявляем переменную для хранения данных

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
  // Проходим по каждому элементу массива и извлекаем только необходимые поля
  const extractedData = data.map(recommendation => ({
    title_orig: recommendation.title_orig,
    release_year: recommendation.release_year
  }));
  
  // Сохраняем извлеченные данные в переменную jsonData
  jsonData = extractedData;
  // Выводим историю чата в консоль
  console.log("Chat History:");
  console.log("Message 1:");
  console.log(`Role: user`);
  console.log(`Text: привет ты бот который будет получать данные в json формате ты должен написать описание фильма по его название и году выпуска договарились? при команде сделать анализ напиши описание! вот данные ${JSON.stringify(jsonData)}`);
  console.log("--------------------");
  console.log("Message 2:");
  console.log(`Role: model`);
  console.log(`Text: договарились! напишите пожалуйста сделать анализ`);
  console.log("--------------------");
    async function run() {

      // For text-only input, use the gemini-pro model
      const model = genAI.getGenerativeModel({ model: "gemini-pro"});
      const chat = model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: `привет ты бот который будет получать данные в json формате ты должен написать описание фильма по его название и году выпуска сделай рекомендацию договарились? при команде сделать анализ напиши описание! вот данные ${JSON.stringify(jsonData)}` }],
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
    
      async function askQuestion() {
        rl.question("Введите ваш запрос (для завершения введите 'стоп'): ", async (msg) => {
          if (msg.toLowerCase() === "стоп") {
            rl.close();
            return;
          }
          
          // Проверяем, что сообщение не слишком короткое
          if (msg.trim().length < 3) {
            console.log("Ваш запрос слишком короткий. Пожалуйста, введите что-то более содержательное.");
            askQuestion(); // Запрашиваем следующий запрос после завершения обработки текущего
            return;
          }
      
          const result = await chat.sendMessage(msg);
          const response = await result.response;
          const text = response.text();
          console.log(text);
      
          askQuestion(); // Запрашиваем следующий запрос после завершения обработки текущего
        });
      }
      
      
    
      askQuestion();
    }
    
    run();
    // console.log(jsonData); // Выводим ответ в консоль
  })
  .catch(error => {
    console.error('There was a problem with the fetch operation:', error);
  });

