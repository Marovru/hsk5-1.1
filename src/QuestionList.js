// QuestionList.js
import React, { useState, useEffect } from "react";
import axios from "axios";

const QuestionList = () => {
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/tickets")
      .then((response) => {
        setTickets(response.data);
      })
      .catch((error) => {
        console.error("Error fetching tickets", error);
      });
  }, []);

  if (tickets.length === 0) {
    return <div>Loading tickets...</div>;
  }

  return (
    <div>
      <h2>Выберите билет:</h2>
      {tickets.map((ticket, index) => (
        <button key={index} onClick={() => console.log(ticket)}>
          Ticket {ticket.ticketNumber}
        </button>
      ))}
    </div>
  );
};

export default QuestionList;
