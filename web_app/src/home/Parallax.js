import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import React, { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Navigate } from 'react-router-dom';
import { TypeAnimation } from 'react-type-animation';
import { getContractInstanceConf, getContractInstanceInst } from '../contractServices';
import * as Components from './Components';
import './Parallax.css';
import Sign from './Sign';
import Home2 from './home2styles/home2';

function Parallax() {
  const [background, setBackground] = useState(20);
  const parallaxRef = useRef(null);
  const mountain3 = useRef(null);
  const mountain2 = useRef(null);
  const mountain1 = useRef(null);
  const cloudsBottom = useRef(null);
  const cloudsLeft = useRef(null);
  const cloudsRight = useRef(null);
  const hats = useRef(null);
  const verifDiploma = useRef(null);
  const verifInput = useRef(null);
  const sign = useRef(null);
  const [textColor, setTextColor] = useState('#fff');
  const [diplomaId, setDiplomaId] = useState(null);
  const [interfaceName, setInterfaceName] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');
  const [file, setFile] = useState(null);
  const [result, setResult] = useState('');

  const handleFileChange = e => {
    setFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    console.log(handleUpload);
    if (!file) return;

    const formData = new FormData();
    formData.append('diploma', file);

    const response = await fetch('http://localhost:5000/api/analyze-diploma', {
      method: 'POST',
      body: formData
    });
    console.log(response);
    const data = await response.json();
    setResult(data.analysisResult);
    console.log(data);
  };
  //fonction pour verifier l'existance de diplome
  const { i18n, t } = useTranslation();
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
    localStorage.setItem('lang', lng);
    setLang(lng);
  };
  const VerifyDiploma = async () => {
    console.log("hello from VerifyDiploma");
    try {
      const contract = await getContractInstanceInst();
      const contract2 = await getContractInstanceConf();
      console.log(diplomaId);
  
      // Attempt to fetch diploma by ID
      let get, get2, get3;
      try {
        get = await contract.instance.methods.getDiplomaById(diplomaId).call();
      } catch (error) {
        console.error("Error fetching diploma by ID:", error.message);
      }
  
      // Attempt to fetch diploma by CIN
      try {
        get2 = await contract.instance.methods.getDiplomaByCin(diplomaId).call();
      } catch (error) {
        console.error("Error fetching diploma by CIN:", error.message);
      }
  
      // Attempt to fetch certificate of diploma by ID
      try {
        get3 = await contract2.instance.methods.getCertificateOfDiplomaId(diplomaId).call();
      } catch (error) {
        console.error("Error fetching certificate of diploma by ID:", error.message);
      }
  
      // Check if any of the fetched results are valid
      if (get && get.id !== '') {
        console.log('Diploma exists:', get);
        alert('Diploma is verified');
        handleSignClick('verifier', diplomaId);
      } else if (get2 && get2.id !== '') {
        console.log('Diploma exists:', get2);
        alert('Diploma is verified');
        handleSignClick('verifier', diplomaId);
      } else if (get3 && get3.id !== '') {
        console.log('Diploma exists:', get3);
        alert('Diploma is verified');
        handleSignClick('verifier', diplomaId);
      } else {
        console.log("Diploma does not exist");
        alert('Diploma is not registered');
        handleSignClick('verifier', "notFound");
      }
    } catch (generalError) {
      console.error("An unexpected error occurred:", generalError.message);
      alert('An error occurred while verifying the diploma');
    }
  };
  const handleSignClick = (interfaceName, diplomaId) => {
    setLoggedIn(true);
    setInterfaceName(interfaceName);
    setDiplomaId(diplomaId);
  };
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.registerPlugin(ScrollTrigger);
      var tl = gsap.timeline({
        defaults: { duration: 1 },
        scrollTrigger: {
          trigger: parallaxRef.current,
          start: 'top top',
          end: '1500 bottom',
          scrub: true,
          pin: true,
          onUpdate: self => {
            setBackground(Math.ceil(self.progress * 100 + 20));
          }
        }
      });
      tl.to(
        mountain3.current,
        {
          y: '-=50'
        },
        0
      );
      tl.to(
        mountain2.current,
        {
          y: '-=20'
        },
        0
      );
      tl.to(
        mountain1.current,
        {
          y: '+=20'
        },
        0
      );
      tl.to(
        hats.current,
        {
          top: 0
        },
        0.5
      );
      tl.to(
        cloudsBottom.current,
        {
          opacity: 0,
          duration: 0.5
        },
        0
      );
      tl.to(
        cloudsLeft.current,
        {
          x: '-20%',
          opacity: 0
        },
        0
      );
      tl.to(
        cloudsRight.current,
        {
          x: '20%',
          opacity: 0
        },
        0
      );

      tl.to(
        sign.current,
        {
          opacity: 1
        },
        1.5
      );
      tl.to(
        verifDiploma.current,
        {
          y: '+=190',
          opacity: 0
        },
        0
      );
      tl.to(
        verifInput.current,
        {
          y: '+=190',
          opacity: 0
        },
        0
      );
    });
    return () => ctx.revert();
  }, []);

  if (loggedIn) {
    //naviguer à l'interface admin
    if (interfaceName === 'admin') {
      return <Navigate to="/admin" />;
      //naviguer à l'interface institute
    } else if (interfaceName === 'institute') {
      return <Navigate to="/institute" />;
      //naviguer à l'interface verifier/id
    } else if (interfaceName === 'validator') {
      return <Navigate to="/validator" />;
      //naviguer à l'interface verifier/id
    } else if (interfaceName === 'conference') {
      return <Navigate to="/conference" />;
    } else if (interfaceName === 'verifier' && diplomaId !== null) {
      return <Navigate to={`/verifier/${diplomaId}`} />;
    } else if (interfaceName === 'verifierNotFount' && diplomaId !== null) {
      return <Navigate to={`/verifierNotFount/${diplomaId}`} />;
    } else {
      return <div>Invalid interface name.</div>;
    } 
  } else {
    return (
      <>
        <div className="parallax-outer">
          <div
            ref={parallaxRef}
            style={{
              background: `linear-gradient(#7F78B1,#809BCE, #95B8D1 ${background}%, #B8E0D2, #F2E6C5 )`
            }}
            className="parallaxx"
          >
            <div className="logo">
              <img src="./images/logo.png" alt="Logo de l'entreprise" />
              <div style={{ position: 'absolute', right: 0, zIndex: 2000 }}>
                <Components.Select
                  className="selectBox"
                  onChange={e => {
                    changeLanguage(e.target.value);
                    setLang(e.target.value);
                  }}
                  name="lang"
                  value={lang}
                >
                  <option className="optionsMenu" value="en">
                    English ( EN )
                  </option>
                  <option className="optionsMenu" value="fr">
                    French ( FR )
                  </option>
                  <option className="optionsMenu" value="ar">
                    Arabe ( AR )
                  </option>
                </Components.Select>
              </div>
            </div>
            <img
              ref={mountain3}
              className="mountain-3"
              src="/parallax/back2.svg"
            />
            <img
              ref={mountain2}
              className="mountain-2"
              src="/parallax/back1.svg"
            />
            <img
              ref={mountain1}
              className="mountain-1"
              src="/parallax/back1.svg"
            />
            <div
              ref={verifDiploma}
              className="verifDiploma"
              style={{ color: textColor, textShadow: '4px 4px 4px ' }}
            >
              <TypeAnimation
                sequence={[
                  // Same substring at the start will only be typed out once, initially
                  t('homepage.title.p1'),
                  1000,
                  () => setTextColor('#C9E2CE'),
                  t('homepage.title.p2'),
                  1000,
                  () => setTextColor('#C9E2CE'),
                  t('homepage.title.p2'),
                  1000,
                  () => setTextColor('#C9E2CE'),
                  t('homepage.title.p3'),
                  1000,
                  () => setTextColor('#C9E2CE'),
                  t('homepage.title.p4'),
                  1000,
                  () => setTextColor('#C9E2CE')
                ]}
                wrapper="span"
                speed={10}
                style={{
                  fontSize: '6em',
                  display: 'inline-block',
                  fontWeight: 500
                }}
                repeat={Infinity}
              />
            </div>
            <div ref={verifInput} className="verify" style={{ zIndex: 5000 }}>
              <div class="input-group">
                <label class="input-group__label" for="myInput">
                  Write DiplomaID or Scan QrCode
                </label>
                <input
                  type="text"
                  id="myInput"
                  class="input-group__input"
                  value={diplomaId}
                  onChange={e => setDiplomaId(e.target.value)}
                />
                
                <button className='btn'
                onClick={VerifyDiploma}
                style={{
                  whiteSpace: 'nowrap',
                  backgroundColor: '#B5DDD2',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  width: '50%',
                  fontWeight:'800',
                  padding:'10px',
                }}
              >
                <i className="bx bx-search" style={{ fontSize:"25px" }}></i>Verify
              </button>
                
              
              </div>
             
            </div>

            {result && <div>Analysis Result: {result}</div>}
            <img
              ref={cloudsBottom}
              className="clouds-bottom"
              src="/parallax/cloud-bottom.svg"
            />
            <img
              ref={cloudsLeft}
              className="clouds-left"
              src="/parallax/clouds-left.svg"
            />
            <img
              ref={cloudsRight}
              className="clouds-right"
              src="/parallax/clouds-right.svg"
            />
            <img ref={hats} className="stars" src="/parallax/hats.svg" />
            <div ref={sign} className="sign-opacity">
              <Sign />
            </div>
          </div>
        </div>
       <div className="home">
          {/*<div className="verify" style={{ zIndex: 5000 }}>
            <div class="input-group">
              <label class="input-group__label" for="myInput">
                Analyze Forged Diploma{' '}
              </label>
              <input
                type="file"
                onChange={handleFileChange}
                id="myInput"
                class="input-group__input"
              />
              <button
                onClick={handleUpload}
                style={{
                  whiteSpace: 'nowrap',
                  backgroundColor: '#809BCE',
                  color: '#fff',
                  border: '2px solid #fff',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  marginTop: '5px',
                  width: '100%'
                }}
              >
                <i className="bx bx-search"></i>Upload and Analyze
              </button>
            </div>
          </div>*/}
          <Home2 />
          
        </div>
      </>
    );
  }
}

export default Parallax;
