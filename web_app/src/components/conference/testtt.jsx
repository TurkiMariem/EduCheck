
import React, { useState } from 'react';
import Draggable from 'react-draggable';
import * as XLSX from 'xlsx';
const Certificate = () => {
	const [points, setPoints] = useState([]);
	const [rectangles, setRectangles] = useState([]);
    const [certificateImages, setCertificateImages] = useState([]);
	const [selectedRectangle, setSelectedRectangle] = useState(null);
	const [showCertificates, setShowCertificates] = useState(false);
	const [templateImageSrc, setTemplateImageSrc] = useState('');
	const [titles, setTitles] = useState([]);
	const [excelData, setExcelData] = useState([]);
	const [vars, setVars] = useState([]);
	const [areas, setAreas] = useState([]);

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
	  const handleExcelUpload = (event) => {
		const file = event.target.files[0];
		const reader = new FileReader();
		reader.onload = (e) => {
		  const data = new Uint8Array(e.target.result);
		  const workbook = XLSX.read(data, { type: 'array' });
		  const sheetName = workbook.SheetNames[0];
		  const sheet = workbook.Sheets[sheetName];
		  const excelData = XLSX.utils.sheet_to_json(sheet, { header: 1 });
		  setExcelData(excelData);
		  console.log("excelData",excelData);
		};
		reader.readAsArrayBuffer(file);
		//console.log(reader.readAsArrayBuffer(file));
	  };
	const templateImage = new Image();
	templateImage.src =templateImageSrc;
	
	function generateCertificates() {
		console.log("titles",titles);
		const indexes = titles.map((title) => excelData[0].indexOf(title));
		console.log('indexes', indexes);
		setVars(indexes);
		const certifiedParticipants = selectedParticipants.map((row) => {
			const participant = {};
			titles.forEach((title,i) => {
					participant[title] = row[vars[i]];
			});
			return participant;
		  });
		 
		//console.log("parts", participants);
		//console.log("Excell dataaa", excelData);
		const images = certifiedParticipants.map((participant,i) => {
		  const canvas = document.createElement('canvas');
		  const ctx = canvas.getContext('2d');
		  canvas.width = templateImage.width;
		  canvas.height = templateImage.height;
		  ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
		  titles.forEach((zone ,i)=> {
			const ctx = canvas.getContext('2d');
			ctx.font = 'bold 24px Arial';
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.fillText(participant[zone], ((rectangles[i].x1 + rectangles[i].x2) / 2), ((rectangles[i].y1 + rectangles[i].y2)/2 ));
		  });
		  const certificateImageUrl = canvas.toDataURL('image/png');
		  return certificateImageUrl;
		});
	  
		setCertificateImages(images);
		setShowCertificates(true);
	  }
	  
	function deleteCertificates(){
		setCertificateImages([]);
	}
	const [isCheckedAll, setIsCheckedAll] = useState(false);
	const [isCheckedAllShape, setIsCheckedAllShape] = useState(false);
	const [isChecked, setIsChecked] = useState({});
	const [isCheckedShape, setIsCheckedShape] = useState({});
	const [selectedAreas, setSelectedAreas] = useState([]);
	const handleCheckAll = (event) => {
	  const { checked } = event.target;
	  setIsCheckedAll(checked);
	  const newIsChecked = {};
	  excelData.forEach((student, index) => {
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
	const handleCheckShape = (index, checked) => {
	  setIsCheckedShape((prev) => ({ ...prev, [index]: checked }));
	};
	const isButtonEnabled = Object.values(isChecked).some((value) => value);
	const selectedRows = Object.keys(isChecked)
	.filter((index) => isChecked[index])
	.map((index) => parseInt(index));
	console.log("selectedRows",selectedRows);

	const selectedParticipants = selectedRows.map(index => excelData[index]);
	setAreas(selectedParticipants[0]);
	console.log('selectedParticipants', selectedParticipants);
	console.log('areas', areas);
	const handleAreaChange = (event) => {
		setSelectedAreas(event.target.value);
	  };
  return (
    <div>
     <main>
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
					</div>
					</div>
					<div>
						<div style={{ display:"flex",flex:1 }}>
					<h3 style={{color:"#FBBC05"}}>Certificate Tepmlate</h3>
					<div style={{position:"relative", right:"0px",display:"flex",flex:1 }}>
					<button onClick={handleAddRectangle}>Add Rectangle</button>
      <button onClick={() => handleDeleteRectangle(selectedRectangle)}>Delete Rectangle</button>
      <button onClick={() => handleDeleteRectangles()}>Delete All</button>
	  </div>
	  </div>
					<input type="file" accept="image/*" onChange={handleImageUpload} />
					<div >
					{templateImageSrc && (
            <div style={{ position: 'relative' }}>
              <img src={templateImageSrc} onClick={handleImageClick} />
            </div>
          )}
		  </div>
				 {points.map((point, index) => (
					<div>
          <Draggable
            key={index}
            bounds="parent"
            position={{ x: point.x, y: point.y }}
            onDrag={(event, ui) => handleDrag(index, event, ui)}
          >
            <div
              style={{
				position:'absolute',
				top:230,
                width: '10px',
                height: '10px',
                backgroundColor: 'red',
                cursor: 'move',
				zIndex:10
              }}
            ></div>
          </Draggable>
		  </div>
        ))}
        {rectangles.map((rectangle, index) => (
          <div
            key={rectangle.id}
            style={{
              position: 'absolute',
              left: Math.min(rectangle.x1+20, rectangle.x2+20),
              top: Math.min(rectangle.y1+230, rectangle.y2+230),
              width: Math.abs(rectangle.x2 - rectangle.x1),
              height: Math.abs(rectangle.y2 - rectangle.y1),
              border: selectedRectangle === rectangle.id ? '2px solid blue' : '2px solid red',
              pointerEvents: 'auto',
              cursor: 'pointer',
            }}
            onClick={() => handleSelectRectangle(rectangle.id)}
          ></div>
        ))}
		</div>
  
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
	  	</main>
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
				 {/*   <select mode="multiple" style={{width:"100%",backgroundColor:"#9CBEC5",color:"#576389", fontSize:"19px",borderRadius:"5%"}}  value={selectedAreas}
    onChange={handleAreaChange} >
         {areas.map(speaker => (
    <option value={speaker} key={speaker}>
      {speaker}
    </option>
        ))}
		 </select> */}
				  <input
          value={titles[i] || ''}
          onChange={(e) => {
            const updatedTitles = [...titles];
            updatedTitles[i] = e.target.value;
            setTitles(updatedTitles);
          }}
        />
				  </td>
				  <td><input type="week" name="" id="" /></td>
				  <td><input type="number" name="" id="" /></td>
				  <td><input type="color" name="" id="" /></td>
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
       {/* <h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>A</span>
              <span style={{color: '#EA4335'}}>d</span>
              <span style={{color: '#FBBC05'}}>d</span>{' '}{' '}
              <span style={{color: '#34A853'}}>M</span>
              <span style={{color: '#4285F4'}}>u</span>
              <span style={{color: '#EA4335'}}>l</span>
              <span style={{color: '#FBBC05'}}>t</span>
              <span style={{color: '#34A853'}}>i</span>
              <span style={{color: '#4285F4'}}>p</span>
              <span style={{color: '#EA4335'}}>l</span>
              <span style={{color: '#FBBC05'}}>e</span>{" "}{' '}
              <span style={{color: '#34A853'}}>D</span>
              <span style={{color: '#4285F4'}}>i</span>
              <span style={{color: '#EA4335'}}>p</span>
              <span style={{color: '#FBBC05'}}>l</span>
              <span style={{color: '#34A853'}}>o</span>
              <span style={{color: '#EA4335'}}>m</span>
              <span style={{color: '#FBBC05'}}>a</span>
		</h1> */}
            <main>
			<input type="file" accept=".xlsx,.xls" onChange={handleExcelUpload} />
            <div  className="table-data">
        <div  className="order">
					<div  className="head">
						<h3>Conference Attendants Information:</h3>
						<i  className='bx bx-search' ></i>
						<i  className='bx bx-filter' ></i>
					</div>
					<table>
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
            <button disabled={!isButtonEnabled} onClick={generateCertificates} style={{ width:"200px"}}>Generate Certificates</button>
          </td>
        </tr>
      </tfoot>
					</table>
          </div>
    </div>
    </main>
  </div>
    </div>
				
					<button onClick={generateCertificates}>Generate Certificates</button>
					<button onClick={deleteCertificates}>Delete Certificates</button>
					<button >Print Certificates</button>
			{showCertificates&&(	<div>
            {certificateImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Certificate ${index + 1}`}   />
            ))}
        </div>)}
		
    </div>
  );
};

export default Certificate;