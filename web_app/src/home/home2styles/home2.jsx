import React from 'react';
//import '../../stylehome2.css';
import Collab from './collaborators';
import Review from './feedback';
import How from './how';
import Services from './services';
const Home2 = () => {

    return(
    <>
<div className='home2'>
<Services/>

  </div>
  <div>
    <How/>
  </div>
  <div>
              <Collab/> 
             </div>
             <div className='testemonials'  >
          
                  <Review/>
              </div>
             
              </>)}
              export default Home2;