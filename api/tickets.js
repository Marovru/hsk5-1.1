const mongoose = require('mongoose');
const Ticket = require('../models/Ticket');  // Подключение модели

const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => {
  console.log('MongoDB connected');
}).catch((err) => {
  console.error('MongoDB connection error:', err);
});

module.exports = async (req, res) => {
  if (req.method === 'GET') {
    try {
      const tickets = await Ticket.find();
      res.status(200).json(tickets);
    } catch (error) {
      res.status(500).json({ error: 'Ошибка при получении данных' });
    }
  } else {
    res.status(405).json({ error: 'Метод не поддерживается' });
  }
};
