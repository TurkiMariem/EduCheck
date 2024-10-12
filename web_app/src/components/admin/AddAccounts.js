import axios from 'axios';
import React, { Component } from "react";
import { Button, Card, Form } from 'semantic-ui-react';

class AddAccounts extends Component{
    constructor(props) {
        super(props);
    
      this.state={
        newAccount: {
          adresse: '',
          location: '',
          affectedTo: '',
          used: false,
        },
        accounts: [],
      };
      
    }
    //cycle de vie d'un composant dans React qui est appelé automatiquement une fois que le composant a été monté
    async componentDidMount() {
      this.fetchData();
    }
   
    async fetchData() {
      try {
        const response = await axios.get('http://localhost:5000/addAccount');
        this.setState({ accounts: response.data });
        console.log('accounts ',this.state.accounts);
      } catch (error) {
        console.error(error);
      }
    }
  
    handleInputChange = (event) => {
      const { name, value } = event.target;
      this.setState((prevState) => ({
        newAccount: {
          ...prevState.newAccount,
          [name]: value,
        },
      }));

    };
     checkAddressExists = (addressToCheck) => {
      let addressExists = false;
      for (const account of this.state.accounts) {
        if (account.adresse === addressToCheck) {
          addressExists = true;
          break;
        }
      }
      return addressExists;
    };
    isValidEthereumAddress=(address)=> {
      if (!/^(0x)?[0-9a-fA-F]{40}$/.test(address)) {
        // Check if it has the basic requirements of an address
        return false;
      } else if (/^(0x)?[0-9a-fA-F]{40}$/.test(address) || /^(0x)?[0-9A-Fa-f]{40}$/.test(address)) {
        // If it's all small caps or all all caps return true
        return true;
      } 
    }
    
    handleSubmit = async (event) => {
      event.preventDefault();
      const { newAccount, accounts } = this.state;
    
      // Check address doesn't exist
      if (!this.checkAddressExists(newAccount.adresse)) {
        // Check valid blockchain address
        if (this.isValidEthereumAddress(newAccount.adresse)) {
          try {
            console.log('Sending request to add account:', newAccount);  // Log the request data
            const response = await axios.post('http://localhost:5000/addAccount', newAccount);
            console.log('Response from server:', response.data);  // Log the response data
            this.setState({
              accounts: [...accounts, response.data],
              newAccount: {
                adresse: '',
                location: '',
                affectedTo: '',
                used: false,
              },
            });
          } catch (error) {
            console.error('Error from server:', error.response.data);  // Log the server error
          }
        } else {
          console.log("Blockchain Address is not valid");
          alert("Blockchain Address is not valid");
        }
      } else {
        console.log("Address exists");
        alert("Account Address already exists");
      }
    };
 
    render(){
        return(
        <main >
             <div className="hash" style={{ backgroundColor:"#D4DDEE" }}>
                <h2 style={{ color:"#758EBC" }}>Add Blockchain Account</h2>
                <div  className='signup'>
                <Card fluid centered>
                        <Card.Content>
                            <Form size='large' onSubmit={this.handleSubmit}>
                                <Form.Field required>
                                <p>Account Address</p>
                                    <input
                                        type="text"
                                        name="adresse"
                                        id="adresse"
                                        value={this.state.newAccount.adresse}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field>

                                <Form.Field required>
                                <p>Account Location</p>
                                    <input
                                        type="text"
                                        name="location"
                                        id="location"
                                        value={this.state.newAccount.location}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field>
                                <Form.Field required>
                                <p>Account Name</p>
                                    <input
                                        type="text"
                                        name="affectedTo"
                                        id="affectedTo"
                                        value={this.state.newAccount.affectedTo}
                                        onChange={this.handleInputChange}
                                    />
                                </Form.Field>
                                

                                <Form.Field>
                                    <Button style={{ backgroundColor:"#758EBC" ,left:230,top:10,position:"relative"}} type='submit' class="btn"  primary fluid size='large' >
                                        Add Account
                                    </Button>
                                </Form.Field>

                              </Form>
                        </Card.Content>
                  </Card>

                   
                </div>
              </div>
        </main>
        
    );
}
}
export default AddAccounts;