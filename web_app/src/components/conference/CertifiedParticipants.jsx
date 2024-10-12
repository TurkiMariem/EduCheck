import React from 'react';

function CertifiedParticipants() {
  return (
    <main>
    {!confDetails &&(
    <div className="head-title">
      <div className="left">
        <h1 className="google-search-heading">
  <span style={{color: '#4285F4'}}>P</span>
  <span style={{color: '#EA4335'}}>a</span>
  <span style={{color: '#FBBC05'}}>r</span>
  <span style={{color: '#34A853'}}>t</span>
  <span style={{color: '#EA4335'}}>i</span>
  <span style={{color: '#4285F4'}}>c</span>
  <span style={{color: '#EA4335'}}>p</span>
  <span style={{color: '#FBBC05'}}>a</span>
  <span style={{color: '#4285F4'}}>n</span>
  <span style={{color: '#34A853'}}>t</span>
  <span style={{color: '#EA4335'}}>s</span>
        </h1>
      </div>
    </div>)}
    <div className="table-data">
      <div className="order" style={{ backgroundColor: confDetails?"#FFF2C6":"#D4DDEE" }}>
        <div className="head">
          <h3 style={{ color:"#FFCE26" }}>Your Certified Participants List</h3>
          <input
      type="file"
      accept=".xlsx"
      ref={fileInputRef}
      style={{ display: 'none' }}
      onChange={handleChange}
    />
          <input style={{ color:"#FFCE26" }} type="file" onChange={handleUploadXLSXFile} /> 
          <i className='bx bx-search' onClick={handleSearchClick}></i>
                  {showSearchInput && (
                      <input
                          type="text"
                          placeholder="Enter conference ID"
                          value={searchConferenceId}
                          onChange={handleInputChange}
                      />
                  )}
          <div style={{ position:"relative" }}>
          <i style={{ position:"absolute"}} className='bx bx-filter' onClick={()=>{console.log(!showSuggestions); setshowSuggestions(!showSuggestions)}}></i>
          {showSuggestions && (
              <ul style={{ zIndex:1000,position:"absolute",right:"100%",top:"100%",backgroundColor:"#fff" ,padding:"20px",borderRadius:"20%"}}>
                  {statusSuggestions.map((status, index) => (
                       <li key={index} style={{ marginRight: '10px', marginBottom: '5px' }}>
                       <label style={{ display: 'flex', alignItems: 'center' }}>
                           <input
                               type="checkbox"
                               checked={selectedStatuses.includes(status)}
                               onChange={() => handleStatusSelection(status)}
                           />
                           <td><span style={{ marginLeft: '5px' }} className={`status yes`}>{status}</span></td>
                       </label>
                   </li>
                  ))}
              </ul>
          )}
          </div>
        </div>
        <table>
  <thead>
    <tr>
      <th>
        <input
          type="checkbox"
          checked={isCheckedAll}
          onChange={handleCheckAll}
        />
      </th>
      <th>Participant Name</th>
      <th>Email</th>
      <th>Why Interested?</th>
      <th>Contact</th>
      <th>Affiliate</th>
      <th>Status</th>
      <th>Session Attended</th>
      <th>Action</th>
    </tr>
  </thead>
  <tbody>
            {participants.map((participant, index) => {
              return (
                <tr key={index}>
                   <td><input type="checkbox"
              checked={isChecked[index] || false}
              onChange={(e) => handleCheck(index, e.target.checked)}/>
          </td>
                  <td>
                    <p>{participant.name}</p>
                  </td>
                  <td>{participant.email}</td>
                  <td>{participant.interest}</td>
                  <td>{participant.contact}</td>
                  <td>{participant.affiliation}</td>
           
          <td>All</td>
   
                </tr>
              );
            })}
           
          </tbody> 
       
        </table>
        <td style={{display:"flex", flex:1,width:"100%"}}><input type="checkbox"
              checked={isCheckedFile || false}
              onChange={(e) => handleFileCheck( e.target.checked)}/>
              <p>Want to upload Excel File habing the list of the selected participants ?</p>
          </td>
      </div>
    </div>
  </main>
  )
}

export default CertifiedParticipants