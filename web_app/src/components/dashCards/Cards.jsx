import React from "react";
import "./Cards.css";

import Card from "../card/Card";
import { cardsData } from "./data";

const Cards = () => {
  return (
    <div className="Cards">
      {cardsData.map((card, id) => {
        return (
          <div className="parentContainer" key={id}>
            <Card
              title={card.title}
              color={card.color}
              barValue={card.barValue}
              value={card.value}
              png={card.png}
              series={card.series}
              type={card.type}
            />
          </div>
        );
      })}
    </div>
  );
};

export default Cards;