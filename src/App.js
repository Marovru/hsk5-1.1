import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";
import audioFiles from './audioFiles'; // Импортируем аудиофайлы

function App() {
  const [tickets, setTickets] = useState([]); // Состояние для хранения билетов
  const [currentTicketIndex, setCurrentTicketIndex] = useState(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showImage, setShowImage] = useState(false); // Состояние для показа картинки
  const [timer, setTimer] = useState(30); // Таймер (30 секунд)
  const [timerActive, setTimerActive] = useState(false); // Состояние для активации таймера

  // Получение данных о билетах из API
  useEffect(() => {
    const fetchTickets = async () => {
      try {
        const response = await axios.get("https://hsk5-1-1.vercel.app/api/tickets");
        setTickets(response.data);
      } catch (error) {
        console.error("Ошибка при получении данных:", error);
      }
    };
    fetchTickets();
  }, []);

  // Функция для воспроизведения случайного аудиофайла
  const playRandomAudio = () => {
    const randomIndex = Math.floor(Math.random() * audioFiles.length); // Получаем случайный индекс
    const audio = new Audio(audioFiles[randomIndex]); // Создаем новый объект Audio с выбранным файлом
    audio.onerror = (error) => {
      console.error("Ошибка при загрузке аудио:", error);
      alert("Ошибка при воспроизведении аудио.");
    };
    audio.play(); // Проигрываем аудио
  };

  // Функция для воспроизведения аудио по таймеру
  const playTimeoutAudio = () => {
    const audio = new Audio('/audio/time_out_audio.mp3'); // Путь к файлу time_out_audio.mp3 в папке public
    audio.onerror = (error) => {
      console.error("Ошибка при загрузке аудио:", error);
    };
    audio.play(); // Проигрываем аудио
  };

  // Функция для запуска таймера
  const startTimer = () => {
    setTimer(30); // Сброс таймера на 30 секунд
    setTimerActive(true); // Активируем таймер

    const interval = setInterval(() => {
      setTimer(prevTimer => {
        if (prevTimer <= 1) {
          clearInterval(interval); // Останавливаем таймер, если он дошел до 0
          playTimeoutAudio(); // Проигрываем аудио по таймеру
          setShowImage(true); // Показываем картинку
          return 0;
        }
        return prevTimer - 1;
      });
    }, 1000); // Обновляем таймер каждую секунду
  };

  // Обработка выбора ответа
  const handleAnswer = (selectedOptionIndex) => {
    const currentTicket = tickets[currentTicketIndex];
    const currentQuestion = currentTicket.questions[currentQuestionIndex];

    // Проверка правильности ответа
    if (selectedOptionIndex !== currentQuestion.answer) {
      playRandomAudio(); // Проигрываем случайное аудио при неправильном ответе
    } else {
      setScore(score + 1);
    }

    // Переход к следующему вопросу
    const nextQuestionIndex = currentQuestionIndex + 1;
    if (nextQuestionIndex < currentTicket.questions.length) {
      setCurrentQuestionIndex(nextQuestionIndex);
    } else {
      setShowResult(true);
    }
  };

  // Обработчик для начала нового билета (случайный выбор билета)
  const handleStartTicket = () => {
    const randomTicketIndex = Math.floor(Math.random() * tickets.length);
    setCurrentTicketIndex(randomTicketIndex);
    setCurrentQuestionIndex(0); // Начинаем с первого вопроса
    setScore(0); // Сбросить счет
    setShowResult(false); // Скрыть результат
    setShowImage(false); // Скрыть картинку
    startTimer(); // Запустить таймер
  };

  return (
    <div className="App">
      <h1>HSK 5 Questions</h1>
      {tickets.length === 0 ? (
        <div>Загрузка...</div>
      ) : currentTicketIndex === null ? (
        <div>
          <h2>Нажмите кнопку, чтобы начать:</h2>
          <button onClick={handleStartTicket}>Начать</button>
        </div>
      ) : showResult ? (
        <div>
          <h2>Ваш результат: {score} / {tickets[currentTicketIndex].questions.length}</h2>
          <button onClick={() => setCurrentTicketIndex(null)}>Начать заново</button>
        </div>
      ) : (
        <div>
          <h2>
            Ticket {tickets[currentTicketIndex].ticket} - Вопрос {currentQuestionIndex + 1}
          </h2>
          <p>{tickets[currentTicketIndex].questions[currentQuestionIndex].question}</p>

          {/* Таймер */}
          {timerActive && (
            <div className="timer-container">
              <div className="timer-text">{timer}</div>
            </div>
          )}

          <div>
            {tickets[currentTicketIndex].questions[currentQuestionIndex].options.map((option, index) => (
              <button key={index} onClick={() => handleAnswer(index)}>
                {option}
              </button>
            ))}
          </div>

          {/* Если прошло 30 секунд, показываем картинку */}
          {showImage && <img src='/images/time_out_image.png' alt="Изображение при истечении времени" />}
        </div>
      )}
    </div>
  );
}

export default App;
