# mental_health_bot

MindBot is an emotionally intelligent mental health chatbot designed to simulate empathetic and supportive conversations with users experiencing emotional distress. Built using Python and Flask, the bot leverages natural language processing techniques and carefully crafted emotional response patterns to detect signs of anxiety, depression, grief, and more.

Its primary goal is to offer a safe, non-judgmental space where users can express their feelings and receive comfort, validation, and gentle coping strategies. While it does not replace professional help, MindBot serves as a valuable first-line emotional companion, especially for those who may be hesitant to seek immediate human interaction.

🛠 Tech Stack
The project is built using Python and Flask for the backend, with a simple frontend rendered through Flask HTML/CSS templates. The core logic for emotion detection relies on custom regular expressions and rule-based scoring mechanisms. Integration with the OpenAI API is optionally included to enhance conversational capabilities. Environment variables are managed securely using python-dotenv, and the application depends on libraries such as Flask, Requests, and the OpenAI Python SDK. The bot runs locally during development but can be easily deployed on platforms like Render or Heroku.

