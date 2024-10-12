
import axios from 'axios';
import sha256 from 'crypto-js/sha256';
import { format, parseISO } from 'date-fns';
import QRCode from 'qrcode';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useLocation } from 'react-router-dom';
import { sendDiplomaEmail } from 'sendEmail';
import Web3 from 'web3';
import * as XLSX from 'xlsx';
import { getContractInstanceInst } from '../../contractServices';
const DiplomaTemplate = ({students, confDetails, departmentID, diplomaRef,departmentName,departmentRef,diplomeName }) => {
	console.log(students, confDetails, departmentID, diplomaRef,departmentName,departmentRef,diplomeName );
	const location = useLocation();
	const selectedStudents = students;
	const [diplomaName, setdiplomaName] = useState(departmentName+'-'+diplomeName);
	const [points, setPoints] = useState([]);
	const [rectangles, setRectangles] = useState([]);
    const [certificateImages, setCertificateImages] = useState(['']);
	const [selectedRectangle, setSelectedRectangle] = useState(null);
	const [showCertificates, setShowCertificates] = useState(false);
	const [templateImageSrc, setTemplateImageSrc] = useState('');
	const [selectedFontFamily, setSelectedFontFamily] = useState([]);
	const [selectedFontStyles, setSelectedFontStyles] = useState([]);
	const [selectedColors, setSelectedColors] = useState([]);
    const [selectedFontSize, setSelectedFontSize] = useState([]);
	const [titles, setTitles] = useState([]);
	const [excelData, setExcelData] = useState([]);
	const [vars, setVars] = useState([]);
	const [emailAttachments, setEmailAttachments] = useState();
	const [areas, setAreas] = useState(['id','studentName','studentCIN','birthDay','studentEmail','diplomeName','mention','diplomeRef','diplomeReference','departmentID','instituteId','remiseDay','diplomeHash', 'qrCode']);
	const [selectedAreas, setSelectedAreas] = useState(rectangles.map(() => []));
	const [selectedStyles, setSelectedStyles] = useState([]);
	const [certificatesUrls, setcertificatesUrls] = useState([]);
	const [confId, setconfId] = useState(location.state?.confId);
	const fileInputRef = useRef(null);
	const [certifsUrl, setcertifsUrl] = useState([]);
	const [diplomaIds, setDiplomaIds] = useState([]);
	const [FileUrl, setFileUrl] = useState('');
	const [IPFSHASH, setIPFSHASH] = useState([]);
	const [ParticipantsToCertifie, setParticipantsToCertifie] = useState(null);
	const [ImagesNoQrCode, setImagesNoQrCode] = useState([]);
	const [SelectedParticipants, setSelectedParticipants] = useState([]);
	const [SelectedParticipants1, setSelectedParticipants1] = useState();
	const [isCheckedAll, setIsCheckedAll] = useState(false);
	const [isCheckedAllShape, setIsCheckedAllShape] = useState(false);
	const [isChecked, setIsChecked] = useState({});
	const [isCheckedShape, setIsCheckedShape] = useState({});
	const [vars1, setVars1] = useState();
	const [officerEmail, setofficerEmail] = useState();
	const [studentsIds, setstudentsIds] = useState([]);
	const [numCINs, setNumCINs] = useState([]);
	const [mentions, setMentions] = useState([]);
	const [InstituteId, setInstituteId] = useState('');
	const [validatorEmail, setvalidatorEmail] = useState();
	  const uploadFileToIPFS = async (file) => {
		console.log("uploadFileToIPFSfile",file);
		try {
		  const formData = new FormData();
		  formData.append('file', file);
	  
		  // Make a POST request to the server's upload file endpoint
		  const response = await axios.post('http://localhost:5000/uploadFileToIPFS', formData, {
			headers: {
			  'Content-Type': 'multipart/form-data'
			}
		  });
	  
		  // If the request is successful, return the IPFS hash of the uploaded file
		  return response.data.hash;
		} catch (error) {
		  // Handle errors, such as network issues or server errors
		  console.error('Error uploading file:', error);
		  throw new Error('Failed to upload file');
		}
	  };

	  const isButtonEnabled = Object.values(isChecked).some((value) => value);
	useEffect(() => {
		//localStorage.setItem('officerEmail','dorrachakroun13@gmail.com');
		const officerEmail=localStorage.getItem('officerEmail');
		const validatorEmail=localStorage.getItem('validatorEmail');
		setofficerEmail(officerEmail);
		setvalidatorEmail(validatorEmail);
		const instituteEmail=localStorage.getItem('instituteEmail');
		const instituteName=localStorage.getItem('instituteName');
		const instituteID=localStorage.getItem('instituteID');
		setInstituteId(instituteID);
		console.log("instituteEmail,instituteName,instituteID",instituteEmail,instituteName,instituteID,officerEmail,validatorEmail);
		console.log("selectedStudents",selectedStudents);
		console.log("confDetails",confDetails);
	/*	const defaultFontFamily = new Array(titles.length).fill('Times New Roman');
        const defaultFontStyles = new Array(titles.length).fill('bold');
        const defaultFontSize = new Array(titles.length).fill('30px');

        setSelectedFontFamily(defaultFontFamily);
        setSelectedFontStyles(defaultFontStyles);
        setSelectedFontSize(defaultFontSize);*/
	const selectedRows = confDetails? Object.keys(isChecked)
	.filter((index) => isChecked[index])
	.map((index) => parseInt(index)):
	Object.keys(isChecked)
	.filter((index) => isChecked[index])
	.map((index) => parseInt(index));
	console.log("selectedRows",selectedRows);
	//console.log("selectedStudents",selectedStudents);
	const selectedParticipants = selectedRows.map(index => excelData[index]); 
	//const selectedParticipants5=selectedParticipants.slice(1);
	setSelectedParticipants(selectedParticipants);
	const selectedParticipants1 = selectedRows.map(index => selectedStudents[index]);
	console.log("selectedParticipants11",selectedParticipants1);
	setSelectedParticipants1(selectedParticipants1);
	//{confDetails!="true" &&SelectedParticipants.slice(1)}
	//console.log('selectedParticipants', SelectedParticipants);
		const handleFileRead = async (e) => {
			const content = e.target.result;
			const workbook = XLSX.read(content, { type: 'binary' });
			const sheetName = workbook.SheetNames[0];
			const sheet = workbook.Sheets[sheetName];
			const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
			setExcelData(excelData);
			console.log("excelData", excelData);
if(confDetails==='true'){
	setAreas(['id','studentName','studentCIN','birthDay','studentEmail','diplomeName','mention','diplomeRef','diplomeReference','departmentID','instituteId','remiseDay','diplomeHash', 'qrCode']);
}else{
	setAreas(prevAreas => [...(excelData[0] || []), 'qrCode']);
}
			
			console.log("areas", areas);
		};
	
		const reader = new FileReader();
		reader.onload = handleFileRead;
		console.log("ImagesNoQrCode updated:", ImagesNoQrCode);
		console.log("IPFSHASH updated:", IPFSHASH);
	}, [ParticipantsToCertifie,selectedFontFamily,selectedFontSize,selectedFontStyles, SelectedParticipants,SelectedParticipants1,ImagesNoQrCode,IPFSHASH,vars,titles,diplomaIds,mentions,studentsIds]);


	// Make sure to add any dependencies if needed
	
	const handleImageClick = (event) => {
	  const rect = event.target.getBoundingClientRect();
	  const x = event.clientX - rect.left;
	  const y = event.clientY - rect.top;
	  setPoints([...points, { x, y }]);
	};
  
	const handleDrag = (index, event, ui) => {
	  const { x, y } = ui;
	  const newPoints = [...points];
	  newPoints[index] = { x, y };
	  setPoints(newPoints);
	};
  
	const handleAddRectangle = () => {
	  if (points.length === 2) {
		const newRectangle = {
		  id: Date.now(),
		  x1: points[0].x,
		  y1: points[0].y,
		  x2: points[1].x,
		  y2: points[1].y,
		  titles
		};
		setRectangles([...rectangles, newRectangle]);
		setPoints([]);
		setTitles([]);
	  }
	};
  
	const handleSelectRectangle = (id) => {
	  setSelectedRectangle(id);
	};
  
	const handleDeleteRectangle = (id) => {
	  setRectangles(rectangles.filter(rectangle => rectangle.id !== id));
	  setSelectedRectangle(null);
	  setTitles([]);
	};
	const handleDeleteRectangles = () => {
	  setRectangles([]);
	  setPoints([]);
	  setTitles([]);
	  setSelectedRectangle(null);
	};
	function generateCertifId(value) {
		const hash = sha256(value);
		return hash.toString();
	}
	const handleDragRectangle = (id, event, ui) => {
	  const { x, y } = ui;
	  setRectangles(rectangles.map(rectangle => {
		if (rectangle.id === id) {
		  return {
			...rectangle,
			x1: rectangle.x1 + x,
			x2: rectangle.x2 + x,
			y1: rectangle.y1 + y,
			y2: rectangle.y2 + y,
		  };
		}
		return rectangle;
	  }));
	};
	const handleImageUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
		  setTemplateImageSrc(e.target.result);
		};
		reader.readAsDataURL(file);
	  };
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
		  console.log("excelData", excelData);
		  if(confDetails=='true'){
			setAreas(['id','studentName','studentCIN','birthDay','studentEmail','diplomeName','mention','diplomeRef','diplomeReference','departmentID','instituteId','remiseDay','diplomeHash', 'qrCode']);
		}else{
			setAreas(prevAreas => [...(excelData[0] || []), 'qrCode']);
		}
		  console.log("areas", areas);
		};
		reader.readAsBinaryString(file);
	  };
	  
	const templateImage = new Image();
	templateImage.src =templateImageSrc;

	const generateIDD = async () => {
		let newCertifsUrl = [];
		let newDiplomaIds = [];
		console.log("selectedParticipants", SelectedParticipants);
		console.log("selectedParticipants1", SelectedParticipants1);
		console.log("dddd", selectedStudents[0]);
		console.log("dddd", excelData[0]);
		const dataToUse1 = confDetails === "true" ? selectedStudents[0] : excelData[0];
		let indexes = [];
	  
		if (confDetails && selectedStudents && selectedStudents.length > 0) {
		  const indexes1 = titles.map((title) => dataToUse1[title]);
		  console.log('indexes', indexes1);
		  setVars1(indexes1);
		} else if (excelData && excelData.length > 0) {
		  indexes = titles.map((title) => excelData[0]?.indexOf(title) ?? -1);
		}
		console.log('indexes', indexes);
		setVars(indexes);
	  
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
		console.log("newCertifsUrl", newCertifsUrl);
		console.log("newDiplomaIds", newDiplomaIds);
	  
		// Update the state with the new arrays
		setcertifsUrl(newCertifsUrl);
		setDiplomaIds(newDiplomaIds);
	  
		return { newCertifsUrl, newDiplomaIds };
	  };
	  
	

const getFileUrl = async (hash) => {
    try {
      const response = await axios.get(`http://localhost:5000/getFileUrlFromIPFS/${hash}`);
      return response.data.url;
    } catch (error) {
      console.error('Error fetching file URL from IPFS:', error);
    }
  };
	const uploadCertificatesToIPFS = async (ImagesNoQrCode) => {
		console.log("hello from uploadCertificatesToIPFS");
		setIPFSHASH([]);
		console.log("ImagesNoQrCode from uploadCertificatesToIPFS",ImagesNoQrCode);
		for (const imageUrl of ImagesNoQrCode) {
			console.log("imageUrl",imageUrl);
			// Convert the base64 image URL to a Blob
			const response = await fetch(imageUrl);
			const blob = await response.blob();
			// Upload the Blob to IPFS
			const fileHash = await uploadFileToIPFS(blob);
			// Do something with the fileHash, such as storing it or displaying it
			console.log(`File uploaded to IPFS with hash: ${fileHash}`);
			setIPFSHASH(prevIPFSHASH => [...prevIPFSHASH, fileHash]);
			
			const fileUrl = await getFileUrl(fileHash);
			const fileUrl2=`http://bafybeiaqq7ma477ltz37e2khdhpcq7ujxsy342x3lo5b77f34ouefngi4i.ipfs.localhost:8080/?filename='+${fileHash}`;
			// Stockage de l'URL dans l'état local
			setFileUrl(...FileUrl,fileUrl);
			// Affichage de l'URL dans la console
			console.log("L'URL du fichier est : ", fileUrl);
			console.log("L'URL du fichier local est : ", fileUrl2);
		}
		console.log("IPFSHASHIPFSHASH",IPFSHASH);
	};

	const updateStudentsDiplomaUrl = async (participantId, diplomaHash, diplomaPath) => {
		console.log("hello from updateStudentsDiplomaUrl", participantId);
		try {
		  const response = await fetch(`http://localhost:5000/students/${participantId}`, {
			method: 'PUT',
			headers: {
			  'Content-Type': 'application/json',
			},
			body: JSON.stringify({
			  status: 'pending certificate',
			  diplomeHash: diplomaHash,
			  diplomeurl: diplomaPath
			}),
		  });
		  if (!response.ok) {
			throw new Error('Failed to update student status');
		  }
		  const data = await response.json();
		  console.log('Student status updated successfully:', data);
		  return data;
		} catch (error) {
		  console.error('Error updating student status:', error);
		}
	  };
	  
	  const saveCertificateInMongo = async (participantId, conferenceId, ipfsHash,certifUrl, confEmail, certifId) => {
		console.log("hello from saveCertificateInMongo ",participantId, conferenceId, ipfsHash,certifUrl, confEmail, certifId);
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
	  console.log("studentsIds",studentsIds);
	const saveToBlockchaine = async () => {
		await setstudentsIds(
			confDetails?
			SelectedParticipants1.map(part=>part._id):
			SelectedParticipants.map((row) => row[0]));
		await setMentions(
			confDetails?
			SelectedParticipants1.map(part=>part.mention):
			SelectedParticipants.map((row) => row[5]));
		await setNumCINs(
			confDetails?
			SelectedParticipants1.map(part=>part.studentCIN):
			SelectedParticipants.map((row) => row[3]));
			const mens=mentions.map(mention => mention.toString());
		const nums=numCINs.map(cin => cin.toString());
		const ipfs=  IPFSHASH.map(hash => hash.toString());
		const dipIds=  diplomaIds.map(dipId => dipId.toString())
		const stuIds=studentsIds.map(student => student.toString());
		

		const dataToUse = confDetails ? SelectedParticipants1 : SelectedParticipants;
		console.log("cercer", certificateImages);
		console.log("cercer1", certificateImages);
		//console.log("IPFSHASH from saveToBlockchaine", IPFSHASH);
	
		const storageContract = await getContractInstanceInst();
		if (!storageContract || !storageContract.instance) {
			console.error("Erreur lors de la récupération de l'instance du contrat");
			this.setState({ errorMessage: "Erreur lors de la récupération de l'instance du contrat" });
			return;
		}
		const web3 = new Web3(window.ethereum);
		const accounts = await web3.eth.getAccounts();
		const accountAddress = accounts[0];
		console.log(SelectedParticipants[0]);
	
	console.log("hello","accountAddress",accountAddress,InstituteId/*instid*/, selectedStudents[0].diplomeReference /*diplomereference*/,
	studentsIds,
	mentions,
	 numCINs,
	  IPFSHASH,
	  diplomaIds);
		const etat = await storageContract.instance.methods
			.addDiplomas(accountAddress,InstituteId/*instid*/, selectedStudents[0].diplomeReference /*diplomereference*/,
				stuIds,
				mens,
				 nums,
				  ipfs,
				  dipIds)
			.send({ from: accountAddress});
		console.log(`Diplomas Saved Successfully`, etat);
		/// update the status of selected participants to certified ! 
		//if confDetails 
 {confDetails==='true'?SelectedParticipants1.map(async(part,i)=>{
	await updateStudentsDiplomaUrl(part._id,IPFSHASH[i],emailAttachments[i].path);
	console.log("part1 updated success");
 }):
SelectedParticipants.map(async(part,i)=>{
	await updateStudentsDiplomaUrl(part[0],IPFSHASH[i],emailAttachments[i].path);
	console.log("part updated success");
 })
}
 {confDetails==='true'?SelectedParticipants1.map(async(part,i)=>{
	console.log("errror",part._id,InstituteId,IPFSHASH[i],officerEmail,diplomaIds[i]);
	const result = await saveCertificateInMongo(part._id,InstituteId,IPFSHASH[i],emailAttachments[i].path,officerEmail,diplomaIds[i]);
	console.log('Certificate created:', result);
 }):
SelectedParticipants.map(async(part,i)=>{	
	const result = await saveCertificateInMongo(part[0],InstituteId,IPFSHASH[i],emailAttachments[i].path,officerEmail,diplomaIds[i]);
			console.log('Certificate created:', result);
	
 }) 
} 
		alert(`Certificates Saved Successfully !`);
		await sendDiplomaEmail(validatorEmail,"New Pending Diplomas",null,
		`	<html>
			<title>New Pending Diplomas</title>
	<h1>New Pending Diplomas !</h1>
	  <p>Dear Institute.name Validator,

	  I hope this message finds you well.
	  
	  We want to inform you that new diplomas have been submitted to your EduCheck account. Please take a moment to verify and validate these documents at your earliest convenience.
	  
	  Thank you for your prompt attention to this matter.</p>
	  <p>Best regards,</p>
	  <p><strong>The EduCheck Team</strong></p>
	
					<p>If you have any questions, feel free to contact us at this email or call us at +216 52759645.</p>
		</html>`,
		null
	 
		  );
	
	//	window.location.reload();
		// send Email to participant with certificate sendNotification(studentEmail,studentID,studentHash);
		/*selectedParticipants.slice(1).map((row, j) => {
		sendEmail(selectedParticipants,certificateImages[j]);
		})*/
	}
	
	const generateCertificates = async () => {
		try {
		  const { newCertifsUrl, newDiplomaIds } = await generateIDD(); // Wait for generateIDD to finish before proceeding
		  console.log("newCertifsUrl", newCertifsUrl);
		  console.log("newDiplomaIds", newDiplomaIds);
		  console.log("selectedParticipantsgenerateCertificates", SelectedParticipants);
		  console.log("selectedParticipantsgenerateCertificates1", SelectedParticipants1);
	  
		  const dataToUse = confDetails ? SelectedParticipants1 : SelectedParticipants;
		  await setstudentsIds(
			confDetails?
			SelectedParticipants1.map(part=>part._id):
			SelectedParticipants.map((row) => row[0]));
		await setMentions(
			confDetails?
			SelectedParticipants1.map(part=>part.mention):
			SelectedParticipants.map((row) => row[5]));
		await setNumCINs(
			confDetails?
			SelectedParticipants1.map(part=>part.studentCIN):
			SelectedParticipants.map((row) => row[3]));
		  console.log("dataToUse", dataToUse);
	  
		  const certifiedParticipants = dataToUse.map((row, j) => {
			console.log("row", row);
			console.log("j", j);
	  
			const participant = {};
			console.log("titles from generate certificate", titles);
	  
			for (let i = 0; i < titles.length; i++) {
			  const title = titles[i];
			  if (title !== 'qrCode') {
				if (confDetails === 'true') {
				  participant[title] = row[title];
				} else {
				  participant[title] = row[vars[i]];
				}
			  }
			}
			console.log("participant55", participant);
			return participant;
		  });
	  
		  console.log("certifiedParticipants", certifiedParticipants);
		  await setParticipantsToCertifie(certifiedParticipants);
		  console.log("ParticipantsToCertifie", ParticipantsToCertifie);
	  
		  const images = await Promise.all(
			certifiedParticipants.map(async (participant, j) => {
			  console.log("dorra", participant);
			  console.log("helooooo", newCertifsUrl[j]);
			  const canvas = document.createElement('canvas');
			  const ctx = canvas.getContext('2d');
			  canvas.width = templateImage.width;
			  canvas.height = templateImage.height;
			  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
	  
			  console.log("hello error ", titles);
			  await Promise.all(
				titles.map(async (zone, i) => {
				  console.log("heloo2222", newCertifsUrl[j]);
				  console.log("dorra2222", newDiplomaIds[j]);
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
	  
					const width = rectangles[i].x2 - rectangles[i].x1;
					const height = rectangles[i].y2 - rectangles[i].y1;
					ctx.drawImage(qrCodeImage, rectangles[i].x1, rectangles[i].y1, width, height);
				  } else {
					const fontSize = selectedFontSize[i] || '30px';
					const fontFamily = selectedFontFamily[i] || 'Times New Roman';
					const fontStyle = selectedFontStyles[i] || 'Normal';
					ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;
					ctx.fillStyle = selectedColors[i];
					ctx.textAlign = 'center';
					ctx.fillText(
					  participant[zone] || '',
					  (rectangles[i].x1 + rectangles[i].x2) / 2,
					  (rectangles[i].y1 + rectangles[i].y2) / 2
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
			  console.log("filePath", filePath);
			  return { filePath };
			})
		  );
	  
		  setcertificatesUrls(imagesUrls.map(img => img.filePath));
		  console.log("filepathhh", certificatesUrls);
	  
		  const emailAttachments = imagesUrls.map(({ filePath }, i) => ({
			filename: `certificate${ParticipantsToCertifie[i]}.png`,
			path: `http://localhost:5000${filePath}`,
		  }));
	  
		  setEmailAttachments(emailAttachments);
		  setShowCertificates(true);
	  
		  const imagesNoQrCode = await Promise.all(
			certifiedParticipants.map(async (participant, j) => {
			  console.log("helooooo", certifsUrl[j]);
			  const canvas = document.createElement('canvas');
			  const ctx = canvas.getContext('2d');
			  canvas.width = templateImage.width;
			  canvas.height = templateImage.height;
			  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
	  
			  await Promise.all(
				titles.map(async (zone, i) => {
				  console.log("heloo2222", certifsUrl[j]);
				  if (zone === 'qrCode') {
					ctx.fillText(" ", (rectangles[i].x1 + rectangles[i].x2) / 2, (rectangles[i].y1 + rectangles[i].y2) / 2);
				  } else {
					const fontSize = selectedFontSize[i] || '30px';
					const fontFamily = selectedFontFamily[i] || 'Times New Roman';
					const fontStyle = selectedFontStyles[i] || 'Normal';
					ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;
					ctx.fillStyle = selectedColors[i];
					ctx.textAlign = 'center';
					ctx.fillText(
					  participant[zone] || '',
					  (rectangles[i].x1 + rectangles[i].x2) / 2,
					  (rectangles[i].y1 + rectangles[i].y2) / 2
					);
				  }
				})
			  );
	  
			  return canvas.toDataURL('image/png');
			})
		  );
	  
		  console.log("imagesNoQrCode", imagesNoQrCode);
		  setImagesNoQrCode(imagesNoQrCode);
		  console.log("ImagesNoQrCode", imagesNoQrCode);
		  uploadCertificatesToIPFS(imagesNoQrCode); // Use the correct variable name here
		} catch (error) {
		  console.error("Error generating certificates:", error);
		}
	  };

		//////////////////
	
			
	
	//// end funtion generate certificates
	
	// Function to load image asynchronous

	function deleteCertificates(){
		setCertificateImages([]);
		setImagesNoQrCode([]);
		setcertifsUrl([]);
		setIPFSHASH([]);
		setDiplomaIds([]);
		setstudentsIds([]);
		setMentions([]);
		setNumCINs([]);
	}
	
	const handleCheckAll = (event) => {
	  const { checked } = event.target;
	  setIsCheckedAll(checked);
	  const newIsChecked = {};
	  excelData.forEach((student, index) => {
		newIsChecked[index] = checked;
	  });
	  selectedStudents.forEach((student, index) => {
		newIsChecked[index] = checked;
	  });

	  setIsChecked(newIsChecked);
	};
	const handleCheck = (index, checked) => {
	  setIsChecked((prev) => ({ ...prev, [index]: checked }));
	};
	const handleCheckAllShapes = (event) => {
	  const { checked } = event.target;
	  setIsCheckedAllShape(checked);
	  const newIsChecked = {};
	  rectangles.forEach((rect, index) => {
		newIsChecked[index] = checked;
	  });
	  setIsCheckedShape(newIsChecked);
	};
	const handleAreaChange = (index, value) => {
		const newSelectedAreas = [...selectedAreas];
		newSelectedAreas[index] = value;
			setSelectedAreas(newSelectedAreas);
		const updatedTitles = [...titles];
		updatedTitles[index] = value;
	
			setTitles(updatedTitles);
	
		//setTitles(updatedTitles);
	
		console.log("titles", updatedTitles);
	};
	const [conferenceId, setConferenceId] = useState('');

    const handleChangeConfId = (e) => {
        setConferenceId(e.target.value);
        setconfId(e.target.value);
       // onConferenceIdChange(e.target.value);
    };
	const handleCheckShape = (index, checked) => {
	  setIsCheckedShape((prev) => ({ ...prev, [index]: checked }));
	};
	const handleFontFamilyChange = (index, fontFamily) => {
		const updatedSelectedFontFamily = [...selectedFontFamily];
		updatedSelectedFontFamily[index] = fontFamily;
		setSelectedFontFamily(updatedSelectedFontFamily);
		console.log("selectedFontFamily",selectedFontFamily);
	};
	const handleFontStyleChange = (index, fontStyle) => {
		const updatedSelectedFontStyles = [...selectedFontStyles];
		updatedSelectedFontStyles[index] = fontStyle;
		setSelectedFontStyles(updatedSelectedFontStyles);
		console.log("selectedFontStyles",selectedFontStyles);
	};
	const handleFontSizeChange = (index, fontSize) => {
		const updatedSelectedFontSize = [...selectedFontSize];
		updatedSelectedFontSize[index] = fontSize;
		setSelectedFontSize(updatedSelectedFontSize);
	};
	
	
	const handleColorChange = (index, color) => {
		const updatedSelectedColors = [...selectedColors];
		updatedSelectedColors[index] = color;
		setSelectedColors(updatedSelectedColors);
		console.log("selectedColors",selectedColors);
	};
	
	const formatDate = (dateString) => {
		const dateObject = parseISO(dateString);
		if (isNaN(dateObject)) {
		  return 'Invalid Date';
		}
		return format(dateObject, 'MM/dd/yyyy');
	  };

  return (
    <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>D</span>
              <span style={{color: '#EA4335'}}>I</span>
              <span style={{color: '#FBBC05'}}>P</span>
              <span style={{color: '#4285F4'}}>L</span>
              <span style={{color: '#34A853'}}>O</span>
              <span style={{color: '#EA4335'}}>M</span>
              <span style={{color: '#4285F4'}}>A</span>
              <span style={{color: '#EA4335'}}>S</span>{' '}{' '}
              <span style={{color: '#FBBC05'}}>T</span>
			  <span style={{color: '#4285F4'}}>E</span>
              <span style={{color: '#EA4335'}}>M</span>
              <span style={{color: '#FBBC05'}}>P</span>
			  <span style={{color: '#4285F4'}}>L</span>
              <span style={{color: '#34A853'}}>A</span>
              <span style={{color: '#EA4335'}}>T</span>
              <span style={{color: '#4285F4'}}>E</span>
            </h1>
			{/*<button onClick={generateIDD}>generateIDD</button>*/}
					</div>
					</div>
					<div>
					{confDetails!=='true'&&(
					<div>
					<h3 style={{color:"#FBBC05"}}>Students To certificate</h3>
					<span style={{ color:"#576389" }}>Upload the excel file containing the Students you want to certificate</span>
					<input
  type="file"
  accept=".xlsx,.xls"
  ref={fileInputRef}
  onChange={handleExcelUpload}
/>
</div>)}
						<div style={{ display:"flex",flex:1 ,marginTop:"30px"}}>
					<h3 style={{color:"#FBBC05"}}>Diploma Tepmlate</h3>
					<div style={{position:"relative",justifyContent: "flex-end",display:"flex",flex:1 }}>
	<button style={{ backgroundColor:"#DDE5BF",color:"#53BB6F" }} onClick={handleAddRectangle}>Add Rectangle</button>	
    <button style={{ backgroundColor:"#FFE0D3",color:"#FD7238" }} onClick={() => handleDeleteRectangle(selectedRectangle)}>Delete Rectangle</button>
    <button style={{ backgroundColor:"#F3C4C2",color:"#DB504A" }} onClick={() => handleDeleteRectangles()}>Delete All</button>
	  </div>
	  </div>
					<input type="file" accept="image/*" onChange={handleImageUpload} />
					<div style={{ position: 'relative' }}>
					{templateImageSrc && (
              <img src={templateImageSrc} onClick={handleImageClick} />
          )}
		
				 {points.map((point, index) => (
          <Draggable
			 key={index}
			 bounds="parent"
			 position={{ x: point.x, y: point.y }}
			 onDrag={(event, ui) => handleDrag(index, event, ui)}
		   >
            <div
              style={{
				position:'absolute',
				top:confDetails==='true'? 0:370,
                width: '10px',
                height: '10px',
                backgroundColor: 'red',
                cursor: 'move',
				zIndex:10
              }}
            ></div>
        </Draggable>
        ))}
        {rectangles.map((rectangle, index) => (
			 <Draggable
			 key={index}
			 bounds="parent"
			 position={{ x: rectangle.x, y: rectangle.y }}
			 onDrag={(event, ui) => handleDrag(index, event, ui)}
		   >
          <div
            key={rectangle.id}
            style={{
              position: 'absolute',
              left: Math.min(rectangle.x1+20, rectangle.x2+20),
              top: confDetails==='true'? Math.min(rectangle.y1, rectangle.y2):Math.min(rectangle.y1+370, rectangle.y2+370),
              width: Math.abs(rectangle.x2 - rectangle.x1),
              height: Math.abs(rectangle.y2 - rectangle.y1),
              border: selectedRectangle === rectangle.id ? '2px solid blue' : '2px solid red',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => handleSelectRectangle(rectangle.id)}
          ></div>
		    </Draggable>
        ))}
		
	
  
      {selectedRectangle && (
        <Draggable
          bounds="parent"
          position={{ x: 0, y: 0 }}
          onDrag={(event, ui) => handleDragRectangle(selectedRectangle, event, ui)}
        >
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              zIndex: 999,
              pointerEvents: 'none',
            }}
          ></div>
        </Draggable>
      )}
	  </div>
		</div>
		<main>
	  <div  className="table-data">
				<div  className="order"  style={{ backgroundColor:"#DAE1BC" }}>
					<div  className="head">
						<h3>Selected Areas</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
	<table>
            <thead>
              <tr>
			  <th style={{fontWeight:"10",fontSize:"14px"}}><input
              type="checkbox"
              checked={isCheckedAllShape}
              onChange={handleCheckAllShapes}
            />check All</th>
			  <th>Shape Id</th>
                <th>Zone assigned for</th>
                <th>Font Family</th>
                <th>Font Style</th>
                <th>Font Size</th>
                <th>Font Color</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {rectangles.map((rectangle,i) => (
                <tr key={rectangle.id}>
					<td><input type="checkbox"
                checked={isCheckedShape[rectangle.id] || false}
                onChange={(e) => handleCheckShape(rectangle.id, e.target.checked)}/>
            </td>
					<td>
					{i}
					</td>
                  <td>
				  <select
    mode="multiple"
    style={{ width: "100%", backgroundColor: "#9CBEC5", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
    value={selectedAreas[i]}
    onChange={(e) => handleAreaChange(i, e.target.value)}
>
    {areas.map(speaker => (
        <option value={speaker} key={speaker}>
            {speaker}
        </option>
    ))}
</select>
				  </td>
				  <td>
				  <select
            style={{ width: "100%", backgroundColor: "#9CBEC5", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
            value={selectedFontFamily[i] || 'Times New Roman'}
            onChange={(e) => handleFontFamilyChange(i, e.target.value)}
          >
			<option value="Times New Roman">Times New Roman</option>
            <option value="Arial">Arial</option>
            <option value="Verdana">Verdana</option>
            <option value="Helvetica">Helvetica</option>
            <option value="Courier New">Courier New</option>
            <option value="Georgia">Georgia</option>
            <option value="Palatino">Palatino</option>
            <option value="Garamond">Garamond</option>
          </select>
    </td>
	<td>
	<select
            style={{ width: "100%", backgroundColor: "#9CBEC5", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
            value={selectedFontStyles[i] || 'bold'}
            onChange={(e) => handleFontStyleChange(i, e.target.value)}
          >
			 <option value="bold">Bold</option>
            <option value="normal">Normal</option>
           
            <option value="italic">Italic</option>
            <option value="bold italic">Bold Italic</option>
            <option value="underline">Underline</option>
          </select>
                        </td>
    <td>
	<select
            style={{ width: "100%", backgroundColor: "#9CBEC5", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
            value={selectedFontSize[i] || '30px'}
            onChange={(e) => handleFontSizeChange(i, e.target.value)}
          >
			 <option value="30px">30</option>
            <option value="12px">12</option>
            <option value="14px">14</option>
            <option value="16px">16</option>
            <option value="18px">18</option>
            <option value="20px">20</option>
            <option value="22px">22</option>
            <option value="24px">24</option>
            <option value="26px">26</option>
            <option value="28px">28</option>
            <option value="32px">32</option>
            <option value="34px">34</option>
            <option value="36px">36</option>
            <option value="38px">38</option>
            <option value="40px">40</option>
            <option value="42px">42</option>
            <option value="44px">44</option>
            <option value="46px">46</option>
            <option value="48px">48</option>
            <option value="50px">50</option>
            <option value="52px">52</option>
            <option value="54px">54</option>
            <option value="56px">56</option>
            <option value="58px">58</option>
            <option value="60px">60</option>
            <option value="62px">62</option>
            <option value="64px">64</option>
            <option value="66px">66</option>
            <option value="68px">68</option>
            <option value="70px">70</option>
          </select>
    </td>
				  <td>   <input
        type="color"
        value={selectedColors[i] || "#000000"} // Default color is black
        onChange={(e) => handleColorChange(i, e.target.value)}
    /></td>
                  <td>
                    <button onClick={() => handleDeleteRectangle(rectangle.id)}>Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table> 
		  </div>
		  </div>
		  </main>
          <div  className="head-title">
            <div  className="left">
            <main>
            <div  className="table-data">
        <div  className="order">
					<div  className="head">
						<h3>Students Information:</h3>
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
             
          <th>Student Name</th>
          <th>Email</th>
          <th>CIN Number</th>
          <th>Birth Day</th>
          <th>Mention</th>
          <th>Diplomated Day</th>
          <th>Diploma Name</th>
          <th>Diploma Ref</th>
          <th>Diploma Reference</th>
          <th>Department Id</th>
          <th>Status</th>
        
							</tr>
						</thead>
						<tbody>
							
            {selectedStudents.map((row, index) => (
  <tr key={index}>
    <td><input type="checkbox"
                checked={isChecked[index] || false}
                onChange={(e) => handleCheck(index, e.target.checked)}/>
            </td>
			<td>{row.studentName}</td>
			<td>{row.studentEmail}</td>
			<td>{row.studentCIN}</td>
			<td>{formatDate(row.birthDay)}</td>
			<td>{row.mention}</td>
			<td>{formatDate(row.remiseDay)}</td>
			<td>{row.diplomeName}</td>
			<td>{row.diplomeRef}</td>
			<td>{row.diplomeReference}</td>
			<td>{row.departmentID}</td>
			<td ><span className={row.status === "graduated" ? "status yes" : "status pending"}>{row.status}</span></td>
                    </tr>))}
</tbody>
<tfoot>
        <tr>
          <td colSpan="9">
            <button disabled={!isButtonEnabled} onClick={generateCertificates} className='status yes'>Generate Certificates</button>
			<button disabled={!isButtonEnabled} onClick={deleteCertificates}  className='status no'>Delete Certificates</button>
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
				{console.log("certificateImagesssss",certificateImages)}
            {certificateImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Certificate ${index + 1}`}   />
            ))}
        </div>)}
		
	<span><button style={{ backgroundColor:"#DDE5BF", color:"#53BB6F" }} onClick={saveToBlockchaine}>Send Diplomas To Validator </button>
	</span>	
    </main>
  );
};

export default DiplomaTemplate;