import { Image, ScrollControls, useScroll, useTexture } from '@react-three/drei';
import { Canvas, useFrame } from '@react-three/fiber';
import axios from 'axios';
import { easing } from 'maath';
import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import * as THREE from 'three';
import AddSpeakerUser from '../../home/AddSpeakerUser';
import ConfJoinParticipant from '../../home/ConfJoinParticipant';
import Bottom from './eventDetails/Bottom';
import EventDetailsCard from './eventDetails/EventDetailsCard';
import Top from './eventDetails/top';
import './util';


export const UpcomingConf = () => {
  const [events, setEvents] = useState([]);
  const [eventClicked, setEventClicked] = useState(null);
  const [showSpeakerForm, setShowSpeakerForm] = useState(false);
  const [showParticipantForm, setShowParticipantForm] = useState(false);
  const toggleSpeakerForm = (value) => {
    setShowSpeakerForm(value);
  };
  const toggleParticipantForm = (value) => {
    setShowParticipantForm(value);
  };

  useEffect(() => {
    const fetchDisplayedEvents = async () => {
      try {
        const response = await axios.get('http://localhost:5000/displayedEvents');
        setEvents(response.data);
      } catch (error) {
        console.error('Error fetching displayed events:', error);
      }
    };

    fetchDisplayedEvents();
  }, []);

  return (
    <>
   
      <div style={{ backgroundImage: "linear-gradient(#F2E6C5,#D8E5F5)" }}>
      <div class="row" style={{ display:"flex",justifyContent:"center",alignItems:"center"}}>
                <div class="col-md-12">
                    <div class="site-heading text-center" style={{ color:"#fff" }}>
                        <h2>Most Popular <span>Conferences</span></h2>
                        <h4>Get to know our upcoming conferences</h4>
                    </div>
                </div>
            </div>
        <Canvas camera={{ position: [0, 0, 100], fov:10 }} style={{backgroundColor:'transparent', height:"600px" }}>
          <ScrollControls pages={4} infinite style={{backgroundColor:'transparent', display: 'flex',justifyContent: 'center', alignItems: 'center', height: '100vh',opacity:0,touchAction:'none',animation:'fade-in 5s ease 1s forwards',height: '900px',width:'80%' }}>
            <Rig rotation={[0, 0, 0]}  style={{background:'transparent'}}>
              <Carousel radius={1.5} count={events.length} events={events} eventClicked={eventClicked} setEventClicked={setEventClicked} style={{background:'transparent'}}/>
            </Rig>
          </ScrollControls>
        </Canvas>

        {/**conff details */}
        <section id="admin-section" event={eventClicked}>
          <div className="splitscreen" style={{backgroundColor:"#fff", display:"flex",position:"relative" ,flex:1,width:"100%"}}>
            <div className="left" style={{ flex:1 ,position:"absolute"}}>
              <EventDetailsCard eventClicked={eventClicked} toggleSpeakerForm={toggleSpeakerForm} toggleParticipantForm={toggleParticipantForm}/>
            </div>
            <div className="right" style={{ flex:1}} >
              <Top eventClicked={eventClicked}/>
              <Bottom eventClicked={eventClicked} />
            </div>
          </div>
        </section>

      </div>
      {showSpeakerForm&&(<section id="speaker-add-section">
<AddSpeakerUser eventClicked={eventClicked}/>
</section>)}
      {showParticipantForm&&(<section id="Participant-add-section">
<ConfJoinParticipant eventClicked={eventClicked}/>
</section>)}
    </>
  );
};

function Rig(props) {
  const ref = useRef()
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.rotation.y = -scroll.offset * (Math.PI * 2) // Rotate contents
    state.events.update() // Raycasts every frame rather than on pointer-move
    easing.damp3(state.camera.position, [-state.pointer.x * 2, state.pointer.y + 1.5, 10], 0.3, delta) // Move camera
    state.camera.lookAt(0, 0, 0) // Look at center
  })
  return <group ref={ref} {...props} />
}
//event['img']
function Carousel({ radius, count,events ,eventClicked, setEventClicked}) {
  return Array.from({ length: count }, (_, i) => 
  {const event = events[i % events.length]; 
    return(
    
    <Card
    style={{ width:"200px",height:"350px" }}
      id={`card-${i}`} 
      key={i}
      event={event}
      eventClicked={eventClicked}
        setEventClicked={setEventClicked}
      position={[Math.sin((i / count) * Math.PI * 2) * radius,0, Math.cos((i / count) * Math.PI * 2) * radius]}
      rotation={[0,  (i / count) * Math.PI *2  ,0]}
      //rotation={[0, Math.PI + (i / count) * Math.PI * 2, 0]}
    />
  )})
}

function Card({id, event, setEventClicked,...props }) {
  const navigate = useNavigate();
  const ref = useRef()
  const [hovered, hover] = useState(false)
  const pointerOver = (e) => (e.stopPropagation(), hover(true))
  const pointerOut = () => hover(false)
  const pointerClick = (event) => {
    setEventClicked(event);
    console.log("clicked on ",id);
    const section = document.getElementById('admin-section');
    if (section) {
      section.scrollIntoView({ behavior: 'smooth' });
    }
  };
  useFrame((state, delta) => {
    ref.current.scale.setScalar(hovered ? 1.15 : 1);
    ref.current.material.radius = hovered ? 0.25 : 0.1;
    ref.current.material.zoom = hovered ? 1 : 1.5;
  });
  const url = event.confAffiche ? `files/${event.confAffiche}`: 'files/conferenceAfficheDefault.jpg'; 
  return (
    <Image ref={ref} url={url}
      transparent side={THREE.DoubleSide}
      onPointerOver={pointerOver} 
      onPointerOut={pointerOut} 
      className="reverseImg"
      style={{ width:"cover" }}
      onClick={()=>pointerClick(event)} {...props}>
      
      <bentPlaneGeometry args={[0.1, 1, 1, 20, 20]} />
    </Image>
  )
}

function Banner(props) {
  const ref = useRef()
  const texture = useTexture('/work_.png')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping
  const scroll = useScroll()
  useFrame((state, delta) => {
    ref.current.material.time.value += Math.abs(scroll.delta) * 4
    ref.current.material.map.offset.x += delta / 2
  })
  return (
    <mesh ref={ref} {...props}>
      <cylinderGeometry args={[1.6, 1.6, 0.14, 128, 16, true]} />
      <meshSineMaterial map={texture} map-anisotropy={16} map-repeat={[30, 1]} side={THREE.DoubleSide} toneMapped={false} />
    </mesh>
  )
}
