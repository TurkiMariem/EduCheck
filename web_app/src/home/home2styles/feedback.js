import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { FaChevronLeft, FaChevronRight, FaQuoteRight } from 'react-icons/fa';
import "./feedback.css";
const Review = () => {
  const [index, setIndex] = useState(0);
  const [feedbacks, setFeedbacks] = useState([]);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await axios.get('http://localhost:5000/feedbacks');
        setFeedbacks(response.data);
        console.log("response.data", response.data);
      } catch (error) {
        console.error('Error fetching feedbacks:', error);
      }
    };
    fetchFeedbacks();
  }, []);

  const checkNumber = (number) => {
    if (number > feedbacks.length - 1) {
      return 0;
    } else if (number < 0) {
      return feedbacks.length - 1;
    }
    return number;
  };

  const nextPerson = () => {
    setIndex((index) => {
      let newIndex = index + 1;
      return checkNumber(newIndex);
    });
  };

  const prevPerson = () => {
    setIndex((index) => {
      let newIndex = index - 1;
      return checkNumber(newIndex);
    });
  };

  const randomPerson = () => {
    let randomNumber = Math.floor(Math.random() * feedbacks.length);
    if (randomNumber === index) {
      randomNumber = index + 1;
    }
    setIndex(checkNumber(randomNumber));
  };

  if (feedbacks.length === 0) {
    return <p>Loading feedbacks...</p>;
  }

  const { name, content: text, image } = feedbacks[index];

  return (
    <div>
      <div className="row" style={{ display: "flex", justifyContent: "center", alignItems: "center", marginTop: "50px" }}>
        <div className="col-md-12">
          <div className="site-heading text-center" style={{ color: "#fff" }}>
            <h2>Our Clients <span>Feedback</span></h2>
            <h4>What our clients think?</h4>
          </div>
        </div>
      </div>
      <article className="review">
        <div className='review-container'>
          <div className="img-container">
            <img src={`/files/${image}`} alt={name} className="person-img" />
            <span className="quote-icon">
              <FaQuoteRight />
            </span>
          </div>
          <h4 className="author">{name}</h4>
          <p className="info">{text}</p>
          <div className="button-container">
            <button className="prev-btn" onClick={prevPerson}>
              <FaChevronLeft />
            </button>
            <button className="next-btn" onClick={nextPerson}>
              <FaChevronRight />
            </button>
          </div>
          <button className="random-btn" onClick={randomPerson}>
            Surprise Me!
          </button>
        </div>
      </article>
    </div>
  );
};
export default Review;


