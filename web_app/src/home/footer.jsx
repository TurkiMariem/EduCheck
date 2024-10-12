import React from 'react';
import { FaFacebookSquare, FaGithubSquare, FaLinkedin, FaTwitterSquare } from 'react-icons/fa';
import './footer.css';
function Footer() {
  const bubbles = [];
  for (let i = 0; i < 128; i++) {
    bubbles.push(
      <div
        key={i}
        className="bubble"
        style={{
          '--size': `${2 + Math.random() * 4}rem`,
          '--distance': `${6 + Math.random() * 4}rem`,
          '--position': `${-5 + Math.random() * 110}%`,
          '--time': `${2 + Math.random() * 2}s`,
          '--delay': `${-1 * (2 + Math.random() * 2)}s`,
        }}
      />
    );
  }

  return ( 
    <body className='body1'>
    <div className="main">
      <div className="footer">
        <div className="bubbles">{bubbles}</div>
        <div className="content11">
          <div>
            <img src="/images/logo.png" width="250px" style={{ position: "relative" }} alt="logo" />
            <div className="footer-container">
              <div className="divdiv1">
                <ul>
                  <h3>Content</h3>
                  <li><a href="#">Home</a></li>
                  <li><a href="#">Services</a></li>
                  <li><a href="#">Feedbacks</a></li>
                  <li><a href="#">How It Works ?</a></li>
                  <li><a href="#">About</a></li>
                  <li><a href="#">Contact</a></li>
                </ul>
              </div>
              <div className="divdiv2">
                <ul>
                  <h3>Careers</h3>
                  <li><a href="#">Apply Online</a></li>
                  <li><a href="#">Available Positions</a></li>
                </ul>
              </div>
              <ul className="divdiv3">
                <h3>About Us</h3>
                <li><a href="#">Meet Our Team</a></li>
                <li><a href="#">Our Responsibilities</a></li>
                <li><a href="#">Our Codes</a></li>
                <li><a href="#">Our Values</a></li>
              </ul>
            </div>
            <div className="newsletter">
              <h3>Stay in Touch</h3>
              <input
                className='inputfooter'
                type="email"
                name="newsletter_email"
                id="newsletter_email"
                placeholder="Email"
              />
              <button className='btn'>Send</button>
            </div>
          </div>
          <div className="social" style={{ fontSize: "45px" }}>
            <FaLinkedin />
            <FaFacebookSquare />
            <FaTwitterSquare />
            <FaGithubSquare />
          </div>
          <div className="info">
            <div className="legal">
              <a href="#">Terms & Conditions</a><a href="#">Privacy Policy</a>
            </div>
            <div className="copyright">2021 Copyright &copy; Sean B</div>
          </div>
        </div>
      </div>
      <svg style={{ position: 'fixed', top: '100vh' }}>
        <defs>
          <filter id="blob">
            <feGaussianBlur in="SourceGraphic" stdDeviation="10" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9"
              result="blob"
            />
          </filter>
        </defs>
      </svg>
    </div>
  </body>
  )
}

export default Footer