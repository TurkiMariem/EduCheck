import React, { Component } from 'react';
import { Button, Card, Form, Grid, Modal } from "semantic-ui-react";
import Web3 from 'web3';
import { getContractInstance } from '../../contractServices';
import { getFileUrlFromIPFS } from '../../ipfs';
import VerifyDiploma from '../VerifyDiploma';

class ListDiploma extends Component {
  constructor(props) { 
    super(props);
    this.state = {
      studentList: [],
      selectedStudent: null,
      errorMessage: null,
      imageUrl: null,
      instituteInfo: {},
      showDetailsModal: false,
      showDiplomaModal: false
    };
  }
  //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
  async componentDidMount() {
    const storageContract = await getContractInstance();
    if (!storageContract || !storageContract.instance) {
      console.error("Erreur lors de la récupération de l'instance du contrat");
      this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
      return;
    }

    const web3 = new Web3(window.ethereum);
    const accounts = await web3.eth.getAccounts();
    const accountAddress = accounts[0];

    const students = await storageContract.instance.methods
      .getStudentsForInstitute(accountAddress)
      .call({ from: accountAddress });
    
    console.log("la liste complete",students);
    if (!students || students.length === 0) {
      this.setState({ errorMessage: "Aucun étudiant enregistré pour cet institut" });
      return;
    }

    this.setState({
      studentList: students,
      
    });
  }
  //fonction pour afficher les details de student
  handleStudentClick = async(event, student) => {
    event.preventDefault();
  if (this.state.selectedStudent) {
    // hide the form if it's already displayed for the clicked student
    this.setState({ selectedStudent: null, imageUrl: null, showDetailsModal: false });
  } else {
    // display the form for the clicked student
    this.setState({ selectedStudent: student ,imageUrl: null, showDetailsModal: true });
  }
};
  //fonction pour affiche le diplome
  viewDiploma = async (ipfsHash) => {
    const diplomaUrl = await getFileUrlFromIPFS(ipfsHash);
    this.setState({imageUrl: diplomaUrl, showDiplomaModal: true});
  };

  render() {
    const { studentList, selectedStudent, imageUrl, showDetailsModal, showDiplomaModal } = this.state;
    const style={
      paddingRight: '200px'
    }
    return (
      <div style={style}>
      <div className="sign-up">
        
        <div className="getinst">
        <div className="table-wrapper">
        
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Details</th>
          <th>Diploma</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {studentList.map((student) => (
          <tr key={student.numCIN}>
            <td>{student.name}</td>
            
            <td>
              <button onClick={(e) => this.handleStudentClick(e, student)}>View Details</button>
            </td>
            <td>
              <button onClick={() => this.viewDiploma(student.ipfsHash)}>View Diploma</button>
            </td>
            <td className={'validated'}>
                {student.validated}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
    </div>
          {selectedStudent && (
            <Modal open={showDetailsModal} onClose={() => this.setState({ showDetailsModal: false })}>
              <Modal.Header>Student Details</Modal.Header>
              <Modal.Content>
                <Card fluid centered>
                  <Card.Content>
                    <Form size="large" className="list-diploma-form">
                    <div>
                        <label>Name:</label>
                        <input type="text" value={selectedStudent.name} readOnly />
                      </div>
                      <div>
                        <label>Email:</label>
                        <input type="text" value={selectedStudent.email} readOnly />
                      </div>
                      <div>
                        <label>Department:</label>
                        <input type="text" value={selectedStudent.department} readOnly />
                      </div>
                      
                      <div>
                        <label>Date of birth:</label>
                        <input type="text" value={selectedStudent.dateOfBirth} readOnly />
                      </div>
                      <div>
                        <label>Mention:</label>
                        <input type="text" value={selectedStudent.mention} readOnly />
                      </div>
                      <div>
                        <label>Graduation date:</label>
                        <input type="text" value={selectedStudent.dateRemiseDiplome} readOnly />
                      </div>
                      <div>
                        <label>CIN:</label>
                        <input type="text" value={selectedStudent.numCIN} readOnly />
                      </div>
                      <div>
                        <label>Id:</label>
                        <input type="text" value={selectedStudent.id} readOnly />
                      </div>
                      <div>
                        <label>IPFS</label>
                        <input type="text" value={selectedStudent.ipfsHash} readOnly />
                      </div>
                      <div>
                        <label>Status:</label>
                        <input type="text" value={selectedStudent.validated} readOnly />
                      </div>
                    </Form>
                  </Card.Content>
                </Card>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.setState({ showDetailsModal: false })}>Close</Button>
              </Modal.Actions>
            </Modal>
          )}
          {imageUrl && (
            <Modal open={showDiplomaModal} onClose={() => this.setState({ showDiplomaModal: false })}
            style={{ width: "60%", height: "70%" }}>
              <Modal.Header>Diploma</Modal.Header>
              <Modal.Content>
                <Form size="large" className="list-image-form">
                <Grid container justify="center">
                  <img src={imageUrl} alt="Diploma" className="diploma-image" />
                </Grid>
                </Form>
              </Modal.Content>
              <Modal.Actions>
                <Button onClick={() => this.setState({ showDiplomaModal: false })}>Close</Button>
              </Modal.Actions>
            </Modal>
          )}
        </div>
      </div>
      <VerifyDiploma />
      </div>
    );
  }
}

export default ListDiploma;