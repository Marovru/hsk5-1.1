const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json()); // Чтобы сервер мог парсить JSON из запросов

// Подключение к MongoDB
mongoose.connect('mongodb://localhost:27017/hsk5_questions', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Error connecting to MongoDB:', err));

// Создайте схему и модель для вопросов
const questionSchema = new mongoose.Schema({
  question: String,
  options: [String],
  answer: Number,
});

const Question = mongoose.model('Question', questionSchema);

// Получить все вопросы из MongoDB
app.get('/questions', async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (err) {
    res.status(500).send('Error fetching questions');
  }
});

// Запустите сервер на порту 5000
const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});