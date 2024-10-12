import React from 'react';
import './sliderStyle.css'; // Assuming you have a CSS file for your styles

const items = [
    { name: 'Switzerland', img: './img_1.jpg', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
    { name: 'Finland', img: './img_2.jpg', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
    { name: 'Iceland', img: './img_3.jpg', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
    { name: 'Australia', img: './img_4.jpg', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
    { name: 'Netherland', img: './img_5.jpg', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' },
    { name: 'Ireland', img: './img_6.jpg', des: 'Lorem ipsum dolor, sit amet consectetur adipisicing elit. Ab, eum!' }
];
const ConferencesSlider = () => {
    const next = () => {
        let items = document.querySelectorAll('.item');
        document.querySelector('.slide').appendChild(items[0]);
    };

    const prev = () => {
        let items = document.querySelectorAll('.item');
        document.querySelector('.slide').prepend(items[items.length - 1]);
    };

    return (
        <div className="container">
     
        <div className="slide">
          {items.map((item, index) => (
            <div className="item" key={index} style={{ backgroundImage: `url(${item.img})` }}>
                 <div className="overlay"></div>
              <div className="content">
                <div className="name">{item.name}</div>
                <div className="des">{item.des}</div>
                <button>See More</button>
              </div>
            </div>
          ))}
        </div>
        <div className="buttonSl">
          <button className="prev" onClick={prev}><i className="fa-solid fa-arrow-left"></i></button>
          <button className="next" onClick={next}><i className="fa-solid fa-arrow-right"></i></button>
        </div>
      </div>
      
    );
};
export default ConferencesSlider;
