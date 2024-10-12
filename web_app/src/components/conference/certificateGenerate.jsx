
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import QRCode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import { Tooltip } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';
import { sendDiplomaEmail } from 'sendEmail';
import Web3 from 'web3';
import * as XLSX from 'xlsx';
import { getContractInstanceConf } from '../../contractServices';
import CertificateTemplate from './certificateTemplate';
const GenerateCertificate = () => {
	const location = useLocation();
	const selectedParticipantsConf = location.state?.participants || [];
	const confDetails = location.state?.confDetails || false;
    const [certificateImages, setCertificateImages] = useState(['']);
	const [showCertificates, setShowCertificates] = useState(false);
	const [templateImageSrc, setTemplateImageSrc] = useState('');
	const [templateImage, setTemplateImage] = useState(null);
    const [selectedTemplate, setSelectedTemplate] = useState(null);
	const [titles, setTitles] = useState([]);
	const [excelData, setExcelData] = useState([]);
	const [vars, setVars] = useState([]);
	const [areas, setAreas] = useState(['id','name','email','sessions','affiliation','conferenceId','contact','status', 'qrCode']);
	const [confId, setconfId] = useState(location.state?.confId);
	const [confTitle, setconfTitle] = useState(location.state?.confTitle);
	const fileInputRef = useRef(null);
	const [certifsUrl, setcertifsUrl] = useState([]);
	const [certificatesUrls, setcertificatesUrls] = useState([]);
	const [diplomaIds, setDiplomaIds] = useState([]);
	const [FileUrl, setFileUrl] = useState('');
	const [IPFSHASH, setIPFSHASH] = useState([]);
	const [ParticipantsToCertifie, setParticipantsToCertifie] = useState(null);
	const [ImagesNoQrCode, setImagesNoQrCode] = useState([]);
	const [SelectedParticipants, setSelectedParticipants] = useState([]);
	const [SelectedParticipants1, setSelectedParticipants1] = useState();
	const [isCheckedAll, setIsCheckedAll] = useState(false);
	const [isChecked, setIsChecked] = useState({});
	const [vars1, setVars1] = useState();
	const [emailAttachments, setEmailAttachments] = useState([]);
	const [participantsIds, setparticipantsIds] = useState([]);

  const handleTemplateSet = (template) => {
    setSelectedTemplate(template);
    setTemplateImage(template.image);
  };

const getFileUrl = async (hash) => {
    try {
      const response = await axios.get(`http://localhost:5000/getFileUrlFromIPFS/${hash}`);
      return response.data.url;
    } catch (error) {
      console.error('Error fetching file URL from IPFS:', error);
    }
  };
const uploadFileToIPFS = async (file) => {
	console.log("uploadFileToIPFSfile",file);
	try {
	  const formData = new FormData();
	  formData.append('file', file);
	  const response = await axios.post('http://localhost:5000/uploadFileToIPFS', formData, {
		headers: {
		  'Content-Type': 'multipart/form-data'
		}
	  });
	  return response.data.hash;
	} catch (error) {
	  console.error('Error uploading file:', error);
	  throw new Error('Failed to upload file');
	}
  };
	  const isButtonEnabled = Object.values(isChecked).some((value) => value);
	useEffect(() => {
	const selectedRows = confDetails? Object.keys(isChecked)
	.filter((index) => isChecked[index])
	.map((index) => parseInt(index)):
	Object.keys(isChecked)
	.filter((index) => isChecked[index])
	.map((index) => parseInt(index));
	const selectedParticipants = selectedRows.map(index => excelData[index]); 
	//const selectedParticipants5=selectedParticipants.slice(1);
	setSelectedParticipants(selectedParticipants);
	const selectedParticipants1 = selectedRows.map(index => selectedParticipantsConf[index]);
	setSelectedParticipants1(selectedParticipants1)
	//{confDetails!="true" &&SelectedParticipants.slice(1)}
	const handleFileRead = async (e) => {
			const content = e.target.result;
			const workbook = XLSX.read(content, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
			setExcelData(excelData);
if(confDetails==='true'){
	setAreas(['name','email','sessions','affiliation','conferenceId','contact','status', 'qrCode']);
}else{
			setAreas(prevAreas => [...(excelData[0] || []), 'qrCode']);
}
		};
	
		const reader = new FileReader();
		reader.onload = handleFileRead;
	}, [ParticipantsToCertifie,selectedTemplate,ImagesNoQrCode,IPFSHASH,vars,titles,participantsIds]);
	

	function generateCertifId(value) {
		const hash = sha256(value);
		return hash.toString();
	}

	  const handleExcelUpload = () => {
		const file = fileInputRef.current.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
		const content = e.target.result;
		const workbook = XLSX.read(content, { type: 'binary' });
		const sheetName = workbook.SheetNames[0];
		const sheet = workbook.Sheets[sheetName];
		const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
		setExcelData(excelData);
		if(confDetails=='true'){
			setAreas(['name','email','sessions','affiliation','conferenceId','contact','status', 'qrCode']);
		}else{
		  setAreas(prevAreas => [...(excelData[0] || []), 'qrCode']);
		}
		  console.log("areas", areas);
		};
		reader.readAsBinaryString(file);
	  };
	
	const generateIDD = async () => {
		let newCertifsUrl = [];
		let newDiplomaIds = [];
		const dataToUse1 = confDetails === "true" ? selectedParticipantsConf[0] : excelData[0];
		let indexes = [];
	  
		if (confDetails && selectedParticipantsConf && selectedParticipantsConf.length > 0) {
		  const indexes1 = selectedTemplate.Areas.map((title) => dataToUse1[title]);
		  setVars1(indexes1);
		  console.log("indexes1",indexes1);
		} else if (excelData && excelData.length > 0) {
		  indexes = selectedTemplate.Areas.map((title) => excelData[0]?.indexOf(title) ?? -1);
		  setVars(indexes);
		}
		
	  
		const dataToUse = confDetails ? SelectedParticipants1 : SelectedParticipants;
		if (dataToUse && Array.isArray(dataToUse)) {
		  dataToUse.forEach((row) => {
			console.log(row);
			if (Array.isArray(row)) {
			  const id = generateCertifId(row.join(''));
			  console.log("id", id);
			  newCertifsUrl.push(`http://localhost:3000/verifier/${id}`);
			  newDiplomaIds.push(id);
			} else if (typeof row === 'object' && row !== null) {
			  const id = generateCertifId(JSON.stringify(row));
			  console.log("id", id);
			  newCertifsUrl.push(`http://localhost:3000/verifier/${id}`);
			  newDiplomaIds.push(id);
			} else {
			  console.error("Row is not an array or object:", row);
			}
		  });
		} else {
		  console.error("Data is not an array:", dataToUse);
		}
	  
		// Update the state with the new arrays
		setcertifsUrl(newCertifsUrl);
		setDiplomaIds(newDiplomaIds);
	  
		return { newCertifsUrl, newDiplomaIds };
	  };
	  
	//// end generate id
	const uploadCertificatesToIPFS = async (ImagesNoQrCode) => {
		setIPFSHASH([]);
		for (const imageUrl of ImagesNoQrCode) {
			// Convert the base64 image URL to a Blob
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			// Upload the Blob to IPFS
			const fileHash = await uploadFileToIPFS(blob);
			// Do something with the fileHash, such as storing it or displaying it
			setIPFSHASH(prevIPFSHASH => [...prevIPFSHASH, fileHash]);
			
			const fileUrl = await getFileUrl(fileHash);
			const fileUrl2=`http://bafybeiaqq7ma477ltz37e2khdhpcq7ujxsy342x3lo5b77f34ouefngi4i.ipfs.localhost:8080/?filename='+${fileHash}`;
			// Stockage de l'URL dans l'état local
			setFileUrl(...FileUrl,fileUrl);
			// Affichage de l'URL dans la console
		}
	};

	const updateParticipantsStatusToCertified = async (participantId) => {
		console.log("hello from updateParticipantsStatusToCertified",participantId);
		try {
		  const response = await fetch(`http://localhost:5000/participants/${participantId}`, {
			method: 'PUT',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({ status: 'certified' }),
		  });
	  
		  if (!response.ok) {
			throw new Error('Failed to update participant status');
		  }
	  
		  const data = await response.json();
		  console.log('Participant status updated successfully:', data);
		  return data;
		} catch (error) {
		  console.error('Error updating participants status:', error);
		}
	  };
	  const saveCertificateInMongo = async (participantId, conferenceId, ipfsHash,certifUrl, confEmail, certifId) => {
		console.log("hello from saveCertificateInMongo ",participantId, conferenceId, ipfsHash, confEmail, certifId);
		try {
		  const response = await axios.post('http://localhost:5000/certificates', {
			participantId,
			conferenceId,
			ipfsHash,
			certifUrl,
			confEmail,
			certifId,
		  });
		  console.log('Certificate created successfully:', response.data);
		  return response.data;
		} catch (error) {
		  console.error('Error creating certificate:', error);
		  throw error;
		}
	  };
	  
	  const saveToBlockchaine = async () => {
		const confEmail = localStorage.getItem('confEmail');
		const dataToUse = confDetails ? SelectedParticipants1 : SelectedParticipants;
//send email
  console.log("emailAttachments",emailAttachments);
		 SelectedParticipants1.map(async(part,i)=>{
			await sendDiplomaEmail(part.email,"Congratulation for your certificate",null,
		` <title>Congratulations On Your Certificate</title>
		</head>
		<body>
			<div class="container">
				<div class="header">
					<h1>Congratulations!</h1>
				</div>
				<div class="content">
	  <h1>Dear ${part.name},</h1>
	  <p>We are delighted to inform you that your attendance at the conference named <strong>${confTitle}</strong> has been confirmed. Your participation and contributions were invaluable, and we hope you found the event enriching and insightful.</p>
	  <p>Please find your certificate of attendance attached below. This certificate is a testament to your active engagement and dedication to furthering your knowledge and skills.</p>
	  <p>We look forward to your continued involvement in our future events and wish you the best in all your professional and personal endeavors.</p>
	 <p>Once again, thank you for being a part of this conference.</p>
	  <p>Best regards,</p>
	  <p><strong>The EduCheck Team</strong></p>
	</div>
				<div class="footer">
					<p>If you have any questions, feel free to contact us at this email or call us at +216 52759645.</p>
				</div>
			</div>
		</body>`,
		[emailAttachments[i]]
		  );
	
		  });
		
	  console.log("transaction saveToBlockchaine",participantsIds,confId,confEmail,IPFSHASH,diplomaIds);  
		const storageContract = await getContractInstanceConf();
		if (!storageContract || !storageContract.instance) {
		  console.error("Erreur lors de la récupération de l'instance du contrat");
		  this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
		  return;
		}
	  
		const web3 = new Web3(window.ethereum);
		const accounts = await web3.eth.getAccounts();
		const accountAddress = accounts[0];
	  
		console.log(SelectedParticipants[0]);
		console.log("hello", "accountAddress", accountAddress, "confID ", conferenceId, "IPFSHASH", IPFSHASH, "DIplomaID", diplomaIds);
	  
		// Convert all IDs and hashes to strings
		const stringParticipantsIds = participantsIds.map(id => String(id));
		console.log(stringParticipantsIds);
		const stringIPFSHASH = IPFSHASH.map(hash => String(hash));
		console.log(stringIPFSHASH);
		const stringDiplomaIds = diplomaIds.map(id => String(id));
		console.log(stringDiplomaIds);
	  
		const etat = await storageContract.instance.methods
		  .addCertificates(stringParticipantsIds, confEmail, conferenceId, stringIPFSHASH, stringDiplomaIds)
		  .send({ from: accountAddress });
	  
		console.log(`Certificates Saved Successfully`, etat);
	 
		// Update the status of selected participants to certified
		if (confDetails === 'true') {
		  SelectedParticipants1.map(async (part) => {
			await updateParticipantsStatusToCertified(part._id);
			console.log("part1 updated success");
		  });
		} else {
		  SelectedParticipants.map(async (part) => {
			await updateParticipantsStatusToCertified(part[0]);
			console.log("part updated success");
		  });
		}
	  
		// Save certificates in MongoDB
		if (confDetails === 'true') {
		  SelectedParticipants1.map(async (part, i) => {
			console.log("error", part._id, conferenceId, IPFSHASH[i], confEmail, diplomaIds[i]);
			const result = await saveCertificateInMongo(part._id, conferenceId, IPFSHASH[i],emailAttachments[i].path, confEmail, diplomaIds[i]);
			console.log('Certificate created:', result);
		  });
		} else {
		  SelectedParticipants.map(async (part, i) => {
			const result = await saveCertificateInMongo(part[0], conferenceId, IPFSHASH[i],emailAttachments[i].path, confEmail, diplomaIds[i]);
			console.log('Certificate created:', result);
		  });
		}
	  
		alert(`Certificates Saved Successfully!`);
	  };
	  
	  const generateCertificates = async () => {
		try {
		  const { newCertifsUrl, newDiplomaIds } = await generateIDD();
	  
		  const dataToUse = confDetails ? SelectedParticipants1 : SelectedParticipants;
		  console.log("dataToUse",dataToUse);
		  setparticipantsIds(
			confDetails
			  ? SelectedParticipants1.map(part => part._id)
			  : SelectedParticipants.map(row => row[0])
		  );
		  const certifiedParticipants = dataToUse.map((row, j) => {
			const participant = {};
			console.log("titles from generate certificate", selectedTemplate.Areas);
			for (let i = 0; i < selectedTemplate.Areas.length; i++) {
			  const title = selectedTemplate.Areas[i];
			  if (title !== 'qrCode') {
				if (confDetails === 'true') {
				  participant[title] = row[title];
				} else {
					console.log("vars",vars);
					console.log("vars",vars1); //undefined
				  participant[title] = row[vars[i]]; }}}
			console.log("participant55", participant);
			return participant;
		  });
		  await setParticipantsToCertifie(certifiedParticipants);
		  const images = await Promise.all(
			certifiedParticipants.map(async (participant, j) => {
			  console.log("dorra", participant);
			  console.log("helooooo", newCertifsUrl[j]);
			  const canvas = document.createElement('canvas');
			  const ctx = canvas.getContext('2d');
			  canvas.width = selectedTemplate.image.width;
			  canvas.height = selectedTemplate.image.height;
			  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
			  await Promise.all(
				selectedTemplate.Areas.map(async (zone, i) => {
				  if (zone === 'qrCode') {
					const url = `http://localhost:3000/verifier/${newDiplomaIds[j]}`;
					const qrCodeDataUrl = await QRCode.toDataURL(url);
					const qrCodeImage = new Image();
					qrCodeImage.src = qrCodeDataUrl;
					// Wait for the image to load before drawing
					await new Promise((resolve, reject) => {
					  qrCodeImage.onload = resolve;
					  qrCodeImage.onerror = reject;
					});
					const width = selectedTemplate.rectangles[i].x2 - selectedTemplate.rectangles[i].x1;
					const height= selectedTemplate.rectangles[i].y2 - selectedTemplate.rectangles[i].y1;
					ctx.drawImage(qrCodeImage, selectedTemplate.rectangles[i].x1, selectedTemplate.rectangles[i].y1, width, height);
				  } else {
					const fontSize = selectedTemplate.fontSize[i] || '30px';
					const fontFamily = selectedTemplate.fontFamily[i] || 'Times New Roman';
					const fontStyle = selectedTemplate.fontStyle[i] || 'Normal';
					ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;
					ctx.fillStyle = selectedTemplate.colors[i];
					ctx.textAlign = 'center';
					ctx.fillText(
					  participant[zone] || '',
					  (selectedTemplate.rectangles[i].x1 + selectedTemplate.rectangles[i].x2) / 2,
					  (selectedTemplate.rectangles[i].y1 + selectedTemplate.rectangles[i].y2) / 2
					);
				  }
				})
			  );
			  const base64Data = canvas.toDataURL('image/png');
			  return { participant, imageUrl: base64Data };
			})
		  );
		  setCertificateImages(images.map(img => img.imageUrl));
		  const imagesUrls = await Promise.all(
			images.map(async (img, j) => {
			  const response = await fetch('http://localhost:5000/generate-certificate', {
				method: 'POST',
				headers: {
				  'Content-Type': 'application/json',
				},
				body: JSON.stringify({
				  img: img.imageUrl,
				}),
			  });
	  
			  if (!response.ok) {
				throw new Error('Error generating certificate');
			  }
	  
			  const { filePath } = await response.json();
			  return { filePath };
			})
		  );

		  setcertificatesUrls(imagesUrls.map(img => img.filePath));
		  const emailAttachments = imagesUrls.map(({ filePath }, i) => ({
			filename: `certificate${ParticipantsToCertifie[i]}.png`,
			path: `http://localhost:5000${filePath}`,
		  }));
	  
		  setEmailAttachments(emailAttachments);
		  setShowCertificates(true);
	  
		  const imagesNoQrCode = await Promise.all(
			certifiedParticipants.map(async (participant, j) => {
			  const canvas = document.createElement('canvas');
			  const ctx = canvas.getContext('2d');
			  canvas.width = templateImage.width;
			  canvas.height = templateImage.height;
			  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
	  
			  await Promise.all(
				selectedTemplate.Areas.map(async (zone, i) => {
				  if (zone === 'qrCode') {
					ctx.fillText(" ", (selectedTemplate.rectangles[i].x1 + selectedTemplate.rectangles[i].x2) / 2, (selectedTemplate.rectangles[i].y1 + selectedTemplate.rectangles[i].y2) / 2);
				  } else {
                    const fontSize = selectedTemplate.fontSize[i] || '30px';
					const fontFamily = selectedTemplate.fontFamily[i] || 'Times New Roman';
					const fontStyle = selectedTemplate.fontStyle[i] || 'Normal';
					ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;
					ctx.fillStyle = selectedTemplate.colors[i];
					ctx.textAlign = 'center';
					ctx.fillText(
					  participant[zone] || '',
					  (selectedTemplate.rectangles[i].x1 + selectedTemplate.rectangles[i].x2) / 2,
					  (selectedTemplate.rectangles[i].y1 + selectedTemplate.rectangles[i].y2) / 2
					);
				  }
				})
			  );
			  return canvas.toDataURL('image/png');
			})
		  );
	  
		 // console.log("imagesNoQrCode", imagesNoQrCode);
		  setImagesNoQrCode(imagesNoQrCode);
		 // console.log("ImagesNoQrCode", imagesNoQrCode);
		  uploadCertificatesToIPFS(imagesNoQrCode); // Use the correct variable name here
		} catch (error) {
		  console.error("Error generating certificates:", error);
		}
	  };
	  
	//// end funtion generate certificates
	
	// Function to load image asynchronous
	  
	function deleteCertificates(){
		setCertificateImages([]);
		setImagesNoQrCode([]);
		setcertifsUrl([]);
		setIPFSHASH([]);
		setDiplomaIds([]);
	}

	const handleCheckAll = (event) => {
	  const { checked } = event.target;
	  setIsCheckedAll(checked);
	  const newIsChecked = {};
	  excelData.forEach((student, index) => {
		newIsChecked[index] = checked;
	  });
	  selectedParticipantsConf.forEach((student, index) => {
		newIsChecked[index] = checked;
	  });

	  setIsChecked(newIsChecked);
	};

	const handleCheck = (index, checked) => {
	  setIsChecked((prev) => ({ ...prev, [index]: checked }));
	};

	const [conferenceId, setConferenceId] = useState(location.state?.confId||'');
	
    const handleChangeConfId = (e) => {
        setConferenceId(e.target.value);
        setconfId(e.target.value);
       // onConferenceIdChange(e.target.value);
    };

  return (
    <div>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>C</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#FBBC05'}}>r</span>
              <span style={{color: '#4285F4'}}>t</span>
              <span style={{color: '#34A853'}}>i</span>
              <span style={{color: '#EA4335'}}>f</span>
              <span style={{color: '#4285F4'}}>i</span>
              <span style={{color: '#EA4335'}}>c</span>
              <span style={{color: '#FBBC05'}}>a</span>
			  <span style={{color: '#4285F4'}}>t</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#FBBC05'}}>s</span>
            </h1>
			{/*<button onClick={generateIDD}>generateIDD</button>*/}
					</div>
					</div>
					<div>
					{confDetails!=='true'&&(
					<div>
					<h3 style={{color:"#FBBC05"}}>Attendants To certificate</h3>
					<span style={{ color:"#576389" }}>Upload the excel file containing the attendants you want to certificate</span>
					<Tooltip text="The xlsx File Should include the participant infos in order Id, Name, Email, Sessions, Affiliation, ConferenceId,  Contact, Status">
        <span style={{ textDecoration: 'underline', color: '#4285F4' }}>ℹ️ Info</span>
      </Tooltip>
					<input
  type="file"
  accept=".xlsx,.xls"
  ref={fileInputRef}
  onChange={handleExcelUpload}
/>
</div>)}
 <CertificateTemplate onTemplateSet={handleTemplateSet} certiDetails={true}/>
		</div>			
          <div  className="head-title">
            <div  className="left">
            <main>
            <div  className="table-data">
        <div  className="order">
					<div  className="head">
						<h3>Conference Attendants Information:</h3>
						<Tooltip text="The xlsx File Should include the participant infos in order Id, Name, Email, Sessions, Affiliation, ConferenceId,  Contact, Status">
        <span style={{ textDecoration: 'underline', color: '#4285F4' }}>ℹ️ Info</span>
      </Tooltip>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					{confDetails==="true"?(
					<table>
						<thead>
							<tr>
                <th style={{fontWeight:"10",fontSize:"14px"}}><input
              type="checkbox"
              checked={isCheckedAll}
              onChange={handleCheckAll}
            />check All</th>
          <th>Name</th>
          <th>Email</th>
          <th>Sessions</th>
          <th>Affiliation</th>
          <th>Conference ID</th>
          <th>Contact</th>
          <th>Status</th>
		</tr>
						</thead>
						<tbody>
							
            {selectedParticipantsConf.map((row, index) => (
  <tr key={index}>
    <td><input type="checkbox"
                checked={isChecked[index] || false}
                onChange={(e) => handleCheck(index, e.target.checked)}/>
            </td>
			<td>{row.name}</td>
			<td>{row.email}</td>
			<td>{row.sessions}</td>
			<td>{row.affiliation}</td>
			<td>{row.conferenceId}</td>
			<td>{row.contact}</td>
			<td className={row.status === "joined" ? "status pending" : "status yes"}>{row.status}</td>
                    </tr>))}
</tbody>
<tfoot>
        <tr>
          <td colSpan="9">
            <button disabled={!isButtonEnabled} onClick={generateCertificates} className='status yes'>Generate Certificates</button>
			<button disabled={!isButtonEnabled} onClick={deleteCertificates}  className='status no'>Delete Certificates</button>
			<button  className='status pending'>Print Certificates</button>
          </td>
        </tr>
      </tfoot>
					</table>):
					(<table>
						<thead>
							<tr>
                <th style={{fontWeight:"10",fontSize:"14px"}}><input
              type="checkbox"
              checked={isCheckedAll}
              onChange={handleCheckAll}
            />check All</th>
              {Array.isArray(excelData[0]) &&
        excelData[0].map((cell, index) => (
          <th key={index}>{cell}</th>
        ))}
							</tr>
						</thead> 
						<tbody>
							
            {excelData.slice(1).map((row, index) => (
  <tr key={index}>
    <td><input type="checkbox"
                checked={isChecked[index] || false}
                onChange={(e) => handleCheck(index, e.target.checked)}/>
            </td>
			{Array.isArray(row) ? (
          row.map((cell, cellIndex) => (
            <td key={cellIndex}>{cell}</td>
          ))
        ) : (
          <td>{row}</td>
        )}
              
                    </tr>))}
</tbody>
<tfoot>
        <tr>
          <td colSpan="9">
            <button disabled={!isButtonEnabled} onClick={generateCertificates} className='btn status yes'>Generate Certificates</button>
			<button disabled={!isButtonEnabled} onClick={deleteCertificates} className="btn status no">Delete Certificates</button>
			<button disabled={!isButtonEnabled} className='status pending btn' >Print Certificates</button>
          </td>
        </tr>
      </tfoot>
					</table>)}
          </div>
    </div>
    </main>
  </div>
    </div>
			{showCertificates&&(	<div>
				
            {certificateImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Certificate ${index + 1}`}   />
            ))}
        </div>)}
		{!confDetails &&(
		<div>
            <label htmlFor="conferenceId">Conference ID:</label>
            <input
                type="text"
                id="conferenceId"
                name="conferenceId"
                value={conferenceId}
                onChange={handleChangeConfId}
            />
        </div>)}
	<span><button style={{ backgroundColor:"#DDE5BF", color:"#53BB6F" }} onClick={saveToBlockchaine}>Save Certificates in blockchaine and send emails to the participants</button>
	</span>	
    </div>
  );
};

export default GenerateCertificate;