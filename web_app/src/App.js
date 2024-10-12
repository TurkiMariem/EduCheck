//import PushNotifications from '@pusher/push-notifications-web';
import VerifyDiplomaNotFound from 'home/VerifyDiplomaNotFound';
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AddConference from './components/admin/AddConference';
import AddInstitute from './components/admin/AddInstitute';
import AdminDash from './components/admin/AdminDash';
import DiplomaList from './components/admin/DiplomaList';
import HandleAccounts from './components/admin/HandleAccounts';
import SelectInstitute from './components/admin/SelectInstitute';
import ConfHome from './components/conference/ConfHome';
import ConferenceDash from './components/conference/ConferenceDash';
import ConferenceDetails from './components/conference/ConferenceDetails';
import AddDiploma from './components/institute/AddDiploma';
import AddMultipleDiploma from './components/institute/AddMultipleDiploma';
import FilterDiploma from './components/institute/FilterDiploma';
import InstituteDash from './components/institute/InstituteDash';
import ValidatorDash from './components/validator/ValidatorDash';
import Home from './home/Home';
import Sign from './home/Sign';
import VerifyDiploma from './home/VerifyDiploma';
import Facee from './home/face';

function App() {
 /* useEffect(() => {
    const beamsClient = new PushNotifications.Client({
      instanceId: '4e1c5286-875a-4d3f-934c-205103f25516',
    });

    beamsClient.start()
      .then(() => beamsClient.addDeviceInterest('hello'))
      .then(() => console.log('Successfully registered and subscribed!'))
      .catch(console.error);

    beamsClient.on('notification', (payload) => {
      console.log('Received notification:', payload);
      // Handle the notification (e.g., show a toast or update the UI)
    });

    return () => {
      beamsClient.stop();
    };
  }, []); */
  return (
    <Router>
    <Routes>
    <Route path='/' element={<Home/>}></Route>
     <Route path='/admin' element={<AdminDash/>}/>
     <Route path='/addInstitute' element={<AddInstitute/>}/>
     <Route path='/selectInstitute' element={<SelectInstitute/>}/>
     <Route path='/addConference' element={<AddConference/>}/>
     <Route path='/accounts' element={<HandleAccounts/>}/>
     <Route path='/diplomas' element={<DiplomaList/>}/>
     <Route path='/institute' element={<InstituteDash/>}/>
     <Route path='/addDiploma' element={<AddDiploma/>}/>
     <Route path='/addMultiDiploma' element={<AddMultipleDiploma/>}/>
     <Route path='/filterDiploma' element={<FilterDiploma/>}/>
     <Route path='/diplomaList' element={<DiplomaList/>}/>
     <Route path='/validator' element={<ValidatorDash/>}/>
     <Route path='/login' element={<Sign/>}/>
     <Route path='/conferenceHome' element={<ConfHome/>}/>
     <Route path='/conference' element={<ConferenceDash/>}/>
     <Route path='/conference/:id' element={<ConferenceDetails/>}/>
     <Route path='/certificate' element={<ConferenceDash selectedItem="Certificates" />}/>
     <Route path='/generateCertificate' element={<ConferenceDash selectedItem="generateCertificates" />}/>
     <Route path='/certificateStudent' element={<InstituteDash selectedItem="diplomaTemplate" />}/>
     <Route path="/verifier/:id" element={<VerifyDiploma />} />
     <Route path="/verifierNotFound/:id" element={<VerifyDiplomaNotFound />} />
     <Route path="/registerFaceInstitute/:id" element={<Facee />} />
     <Route path="/loginFaceInstitute/:id" element={<Facee />} />
  </Routes>
  </Router>
  );
}

export default App;
