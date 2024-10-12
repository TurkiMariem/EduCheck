import axios from 'axios';
import React, { useEffect, useState } from 'react';
import AddAccounts from './AddAccounts';
import './styleAdmin.css';
function HandleAccounts() {
  const [addresses, setAddresses] = useState([]);
  const [filterText, setFilterText] = useState('');
  const [filteredAddresses, setFilteredAddresses] = useState([]);
  const [showNonUsedAddresses, setShowNonUsedAddresses] = useState(false);


  useEffect(() => {
    // Simulate fetching data from address.json
    fetchAccounts();
   
  }, []); // The empty array [] means this effect runs once, similar to componentDidMount


  const fetchAccounts = async () => {
    try {
      const response = await axios.get('http://localhost:5000/accounts');
      setAddresses( response.data);
      console.log("response.data adresses",response.data);
    } catch (error) {
      console.error('Error fetching accounts:', error);
     
    }
  };

  const handleFilterChange = (e) => {
    setFilterText(e.target.value);
  };


  const handleFilter = () => {
    const filteredAddresses = addresses.filter((address) =>
      address.affectedTo.toLowerCase().includes(filterText.toLowerCase())
    );
    setFilteredAddresses(filteredAddresses);
  };


  const handleShowNonUsedAddresses = () => {
    if (showNonUsedAddresses) {
      setFilteredAddresses(addresses); // Show all addresses
    } else {
      const nonUsedAddresses = addresses.filter((address) => !address.used);
      setFilteredAddresses(nonUsedAddresses); // Show non-used addresses
    }
    setShowNonUsedAddresses(!showNonUsedAddresses); // Toggle the state
  };

  const removeAddress = async (adresse) => {
    try {
      const response = await axios.delete(`http://localhost:5000/deleteAccount/${adresse}`);
      console.log('Account removed:', response.data);
     
    } catch (error) {
      console.error('Error removing account:', error);
    }
  };

  return (
    <main>
      <div  className="head-title">
      <div  className="left">
      <h1 className="google-search-heading">
          <span style={{color: '#4285F4'}}>A</span>
              <span style={{color: '#EA4335'}}>c</span>
              <span style={{color: '#FBBC05'}}>c</span>
              <span style={{color: '#4285F4'}}>o</span>
              <span style={{color: '#34A853'}}>u</span>
              <span style={{color: '#EA4335'}}>n</span>
              <span style={{color: '#4285F4'}}>t</span>
              <span style={{color: '#FBBC05'}}>s</span>
             
            </h1>
            </div>
            </div>
       <div>
        <input
          type="text"
          placeholder="Filter by 'Affected To'"
          value={filterText}
          onChange={handleFilterChange}
          style={{ marginBottom:"10px" }}
        />
        <button onClick={handleFilter} className="btn">Filter</button>
        <button onClick={handleShowNonUsedAddresses} className="btn">
          {showNonUsedAddresses ? 'Show All Addresses' : 'Show Non-Used Addresses'}
        </button>
      <div>
      <AddAccounts/>
      <div  className="table-data">
				<div  className="order">
					<div  className="head">
						<h3>Blockchaine Accounts</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
						<thead>
							<tr>
								<th>Address</th>
								<th>Location</th>
								<th>Affected To</th>
								<th>Used</th>
								<th>Action</th>
							</tr>
						</thead>
						<tbody>
  {filteredAddresses.map((address) => {
    const isUsed = address.used;
    const statusClassName = isUsed ? 'status yes' : 'status no';

    return (
      <tr key={address._id}>
        <td>{address.adresse}</td>
        <td>{address.location}</td>
        <td>{address.affectedTo}</td>
        <td><span className={statusClassName}>{isUsed ? 'Yes' : 'No'}</span></td>
        <td><i className='bx bx-trash-alt' onClick={() => removeAddress(address.adresse)}></i>
</td>
      </tr>
    );
  })}
</tbody>
					</table>
          </div>
    </div>
    </div>
</div>

</main>
  );
}



export default HandleAccounts;