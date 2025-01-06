const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect('mongodb://localhost:27017/hsk5', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => console.error('Error connecting to MongoDB:', err));  

  const questionSchema = new mongoose.Schema({
    ticket: Number, // Изменено с ticketNumber на ticket
    questions: [
      {
        question: String, // Изменено с text на question
        options: [String], // Список строк
        answer: Number, // Индекс правильного ответа
      },
    ],
  });

const Ticket = mongoose.model('Ticket', questionSchema);

app.get('/api/tickets', async (req, res) => {
    try {
      const tickets = await Ticket.find(); // Запрос к коллекции tickets
      res.json(tickets); // Отправка данных в формате JSON
    } catch (error) {
      res.status(500).send('Error fetching tickets');
    }
  });
  

const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
