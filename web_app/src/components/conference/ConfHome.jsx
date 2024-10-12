import { motion } from 'framer-motion';
import React, { useEffect, useState } from 'react';
import Home2 from '../../home/home2styles/home2';
import AddConference from './AddConference';
import ConferencesSlider from './ConferencesSlider';
import Header from './Header';
import './confHome.css';
import { UpcomingConf } from './upcomingConf';

const AnimatedNumber = ({ value }) => {
 
    const [displayNumber, setDisplayNumber] = useState(0);
    const [userEmail, setUserEmail] = useState('');
    useEffect(() => {
      const controls = {
        start: 0,
        end: value,
        increment:10,
      };
  
      const animation = {
        duration: 0.5,
        ease: 'easeOut',
      };
     // Get current user
const getCurrentUser = async () => {
  const token = localStorage.getItem('token');
  console.log("tokennn",token);
  if (!token) return null;

  try {
    const response = await fetch('http://localhost:5000/protected', {
      headers: { Authorization: token },
    });
    const data = await response.json();
    console.log("token",data);
    return data;
  } catch (error) {
    console.error('Error getting current user:', error);
    return null;
  }
};
console.log("getCurrentUser",getCurrentUser());
      const updateNumber = () => {
        if (controls.start < controls.end) {
            setDisplayNumber((prevNumber) => prevNumber + controls.increment);
        controls.start += controls.increment;
        requestAnimationFrame(updateNumber);
        }
      };
  
      updateNumber();
      getCurrentUser();
  
      return () => cancelAnimationFrame(updateNumber);
    }, [value]);
  
    return (
      <motion.span>
        {displayNumber.toFixed(0)}
      </motion.span>
    );
  };
const ConfHome = () => {
  const [address, setAddress] = useState('');

  const connectWallet = async () => {
    if (window.ethereum) {
      try {
        // Request account access if needed
        await window.ethereum.request({ method: 'eth_requestAccounts' });
        // Get the user's address
        const accounts = await window.ethereum.request({ method: 'eth_accounts' });
        setAddress(accounts[0]);
      } catch (error) {
        console.error(error);
      }
    } else {
      console.error('Web3 provider not detected. Please install Metamask.');
    }
  };

    const transition={type:'spring',duration:3}
    return(
        <div>
        <div className='confHeader'>
     
            <div className='left-h'>
            <Header/>

                <div className="the-best-ad">
                    <motion.div
                    initial={{ left:'238px' }}
                    whileInView={{ left: '8px'}}
                    transition={{ ...transition ,type:'tween'}}
                    >

                    </motion.div>
                <span>The best conferences' management service</span>
                </div>
            
                <div className="confText">
    <div>
    <span className='stroke-text'>Manage </span>
    <span>Your </span>
    </div>
    <div>
    <span>conference</span>
    </div>
    <div>
    <span>here we help you to manage your conferences , manage the audiance, the certificates for your participants</span></div>
    </div>
  
<div className="figures">
   <div>
    { /**put value /2 */}
 <span>+<AnimatedNumber value={289}/></span>
   <span>Satisified conferenciers</span>
    </div> 
   <div>
   <span>+<AnimatedNumber value={1200}/></span>
   <span>conference created</span>
    </div> 
   <div>
   <span>+<AnimatedNumber value={50}/></span>
   <span>upcoming conferences</span>
    </div> 
</div>

{/** conf buttons */}
<div className="confButtons">
    <button className='confbtn' onClick={()=>{
          console.log("clicked on create conf ");
          const section = document.getElementById('create-conf-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }}>Create Your Conference</button>
    <button className='confbtn' onClick={()=>{
          console.log("clicked on see confs ");
          const section = document.getElementById('list-conf-section');
      if (section) {
        section.scrollIntoView({ behavior: 'smooth' });
      }
    }}>See Conferences</button>
</div>
</div>
            <div className='right-h'>
                <button className='connectwallet' onClick={connectWallet}>Connect Wallet</button>
                {address && <p>Connected Address: {address}</p>}
                <div className='conf1'>
                <motion.div className="heart-rate"
                transition={transition}
                initial={{ right:"-3rem" }}
                whileInView={{ right:"10rem" }}>
                    
                    <img src="./img_8.jpg" style={{ width:"200px" }} alt="" />
                   
                    <span>2024/08/25</span>
                    <span>Bussiness Conference</span>
                </motion.div>
                </div>
                <div className='conf2'>
                <motion.div className="heart-rate"
                transition={transition}
                initial={{ right:"-3rem" }}
                whileInView={{ right:"5rem" }}>
                    
                    <img src="./img_7.jpg" style={{ width:"200px" }} alt="" />
                   
                    <span>2024/08/25</span>
                    <span>Work Secrets  Conference</span>
                </motion.div>
                </div>
                <div className='conf3'>
                <motion.div className="heart-rate"
                transition={transition}
                initial={{ right:"-3rem" }}
                whileInView={{ right:"5rem" }}>
                    <img src="./img_4.jpg" style={{ width:"200px" }} alt="" />
                   
                    <span>2024/08/25</span>
                    <span>Data Science Intro</span>
                </motion.div>
                </div>
                <img src="./images/circle.png" className='circleimg'/>
              {/**<Blob/> */}
            </div>
</div>
<div style={{ backgroundImage:`linear-gradient(#D9E6F6,#DCCAE7)`}}>
<div class="row" style={{ display:"flex",justifyContent:"center",alignItems:"center" }}>
                <div class="col-md-12">
                    <div class="site-heading text-center" style={{ color:"#fff",marginTop:"100px" }}>
                        <h2>Your Upcomimg <span style={{ color:"#AFCFD5" }}> Conference List</span></h2>
                        <h4>Get to know your upcoming conferences</h4>
</div>
</div>
</div>
<ConferencesSlider/>
</div>
<UpcomingConf/>
<section id="create-conf-section">
  <AddConference/>
</section>

{/** my conferences section   https://www.youtube.com/watch?v=OTjmnF27ADk&list=LL  */}
        <Home2/>
        </div>
    )
}
export default ConfHome;