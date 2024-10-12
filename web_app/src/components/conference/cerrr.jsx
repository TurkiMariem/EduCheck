
import axios from 'axios';
import React, { useEffect, useRef, useState } from 'react';
import Draggable from 'react-draggable';
import { useLocation } from 'react-router-dom';
const CertificateTemplate = () => {
	const location = useLocation();
	const confDetails = location.state?.confDetails || false;
	const [points, setPoints] = useState([]);
	const [rectangles, setRectangles] = useState([]);
	const [selectedRectangle, setSelectedRectangle] = useState(null);
	const [templateImageSrc, setTemplateImageSrc] = useState('');
	const [templateImage, setTemplateImage] = useState(null);
	const [selectedFontFamily, setSelectedFontFamily] = useState([]);
	const [selectedFontStyles, setSelectedFontStyles] = useState([]);
	const [selectedColors, setSelectedColors] = useState([]);
  const [selectedFontSize, setSelectedFontSize] = useState([]);
	const [templateImageBase64, setTemplateImageBase64] = useState('');
	const [titles, setTitles] = useState([]);
	const [vars, setVars] = useState([]);
	const [areas, setAreas] = useState(['id','name','email','sessions','affiliation','conferenceId','contact','status', 'qrCode']);
	const [selectedAreas, setSelectedAreas] = useState([]);
	const [selectedTemplate, setSelectedTemplate] = useState({ name: '', rectangles: [] });
	const [isCheckedAllShape, setIsCheckedAllShape] = useState(false);
	const [isChecked, setIsChecked] = useState({});
	const [isCheckedShape, setIsCheckedShape] = useState({});
  const [newCertificateName, setNewCertificateName] = useState('');
	const [templates, setTemplates] = useState([]);
  const [error, setError] = useState('');
  const [testImageUrl, setTestImageUrl] = useState();
  const [showTestImage, setShowTestImage] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    const getTemplates = async () => {
      try {
        const templatesData = await fetchTemplates();
        console.log("templatesData",templatesData);
        setTemplates(templatesData);
		   // setRectangles(templatesData.rectangles.map(() => []))
        setSelectedColors(templatesData.colors);
        setSelectedFontFamily(templatesData.fontFamily);
        setSelectedFontStyles(templatesData.fontStyles);
        setSelectedFontSize(templatesData.fontSize);
        setRectangles(templatesData.rectangles)
      } catch (error) {
        setError('Error fetching templates');
      }
    };
    getTemplates();
  }, []);

	useEffect(() => {
	const selectedRows = confDetails? Object.keys(isChecked)
	.filter((index) => isChecked[index])
	.map((index) => parseInt(index)):
	Object.keys(isChecked)
	.filter((index) => isChecked[index])
	.map((index) => parseInt(index));
	console.log("selectedRows",selectedRows);

	}, [selectedFontFamily,selectedFontSize,selectedFontStyles,vars,titles]);
	

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
  
	const handleAddRectangle = async() => {
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
      console.log("rectangles",rectangles);
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
	const fetchTemplates = async () => {
        try {
          const response = await axios.get('http://localhost:5000/templates');
          return response.data;
        } catch (error) {
          console.error('Error fetching templates:', error);
          throw error;
        }
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
		  updatedTitles[index] = value ;
		  setTitles(updatedTitles);
		  console.log("titles", updatedTitles);
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
	
	const getRectangles = () => {
		if (!selectedTemplate) return rectangles;
		return selectedTemplate.name === 'New Certificate Template' ? rectangles : selectedTemplate.rectangles || [];
};

  const handleImageUpload = (event) => {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onload = (e) => {
        setTemplateImageSrc(e.target.result); // Set the image source for preview
      };
      reader.readAsDataURL(file);
    };
	  
	  const saveTemplate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newCertificateName);
    formData.append('confEmail', localStorage.getItem('confEmail'));
    formData.append('Areas', JSON.stringify(selectedAreas));
    formData.append('fontFamily', JSON.stringify(selectedFontFamily));
    formData.append('fontSize', JSON.stringify(selectedFontSize));
    formData.append('fontStyle', JSON.stringify(selectedFontStyles));
    formData.append('colors', JSON.stringify([])); // Add colors array if necessary
    formData.append('rectangles', JSON.stringify(rectangles));
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]); // Append the file object to FormData
    }
    try {
      const response = await axios.post('http://localhost:5000/templates', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Template created:', response.data);
      alert("template Saved Successfuly !")
      // Handle success (e.g., show a message, clear the form, etc.)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error creating template:', error);
    }
  };
  const updateTemplate = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', newCertificateName);
    formData.append('confEmail', localStorage.getItem('confEmail'));
    formData.append('Areas', JSON.stringify(selectedAreas));
    formData.append('fontFamily', JSON.stringify(selectedFontFamily));
    formData.append('fontSize', JSON.stringify(selectedFontSize));
    formData.append('fontStyle', JSON.stringify(selectedFontStyles));
    formData.append('colors', JSON.stringify([])); // Add colors array if necessary
    formData.append('rectangles', JSON.stringify(rectangles));
    if (fileInputRef.current && fileInputRef.current.files[0]) {
      formData.append('image', fileInputRef.current.files[0]); // Append the file object to FormData
    }
  
    try {
      const response = await axios.put(`http://localhost:5000/templates/${selectedTemplate._id}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('Template updated:', response.data);
      alert("Template Updated Successfully!");
      // Handle success (e.g., show a message, clear the form, etc.)
    } catch (error) {
      // Handle error (e.g., show an error message)
      console.error('Error updating template:', error);
    }
  };
  
  const handleTemplateChange = (value) => {
    if (value === 'new') {
      setSelectedTemplate({ name: 'New Certificate Template', rectangles: [] });
      setSelectedAreas(['']);
      setTemplateImage(null);
      setTemplateImageSrc(null);
      setRectangles([]);
      setTestImageUrl('')
    
    } else {

      const template = templates[value];
      setSelectedTemplate(template);
      setRectangles(template.rectangles || []); 
      setSelectedAreas(template.Areas );
      setSelectedColors(template.colors);
      setSelectedFontFamily(template.fontFamily);
      setSelectedFontSize(template.fontSize);
      setSelectedFontStyles(template.fontStyle);
      if (template && template.image) {
        setTemplateImageSrc(`/files/${template.image}`);
      }
    }
  };

  const testTemplate = async () => {
    if (!templateImageSrc) {
      console.error("Template image is not set");
      return;
    }
    setShowTestImage(true);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = templateImageSrc;
    await new Promise((resolve, reject) => {
      img.onload = resolve;
      img.onerror = reject;
    });
  
    canvas.width = img.width;
    canvas.height = img.height;
    ctx.drawImage(img, "20px", "20px" , canvas.width, canvas.height);
  
    try {
      console.log("titles", titles);
      await Promise.all(
        titles.map(async (zone, i) => {
          if (zone === 'qrCode') {
            const qrCodeImage = new Image();
            qrCodeImage.src = './qrcode.png';
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
              zone || '',
              (rectangles[i].x1 + rectangles[i].x2) / 2,
              (rectangles[i].y1 + rectangles[i].y2) / 2
            );
          }
        })
      );
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error("Error generating certificates:", error);
    }
  };
  
  const generateTestImage = async () => {
    const imageDataUrl = await testTemplate();

  if (imageDataUrl) {
    // You can now use the image data URL, for example, to display the image
    const imgElement = document.createElement('img');
    imgElement.src = imageDataUrl;
    document.body.appendChild(imgElement);
  }
    
  };

  const deleteTemplate = async (templateId) => {
    try {
      const response = await axios.delete(`http://localhost:5000/templates/${templateId}`);
      console.log('Template deleted:', response.data);
      alert("Template Deleted Successfully!");
      setTemplates(templates.filter(template => template._id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
    }
  };

  return (
    <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>T</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#FBBC05'}}>m</span>
              <span style={{color: '#4285F4'}}>p</span>
              <span style={{color: '#34A853'}}>l</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#4285F4'}}>t</span>
              <span style={{color: '#EA4335'}}>e</span>
              <span style={{color: '#FBBC05'}}>s</span>
            </h1>
					</div>
					</div>
					<div>
					<h3 style={{color:"#FBBC05"}}>Certificate Name</h3>
      <div style={{ display: "flex", flex: 1, flexDirection: "column", gap: "10px" }}>
        <select
          style={{ width: "50%", backgroundColor: "#C9DFE3", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
          value={templates&&templates.indexOf(selectedTemplate)}
          onChange={(e) => handleTemplateChange(e.target.value)}
        >
          <option value="" disabled>Select a template</option>
          {templates&&templates.map((template, index) => (
            <option key={template._id} value={index}>
              {template.name}
            </option>
          ))}
          <option value="new">New Certificate Template</option>
        </select>
        {selectedTemplate && selectedTemplate.name === 'New Certificate Template' && (
          <input
            type="text"
            placeholder="Enter new certificate name"
            value={newCertificateName}
            onChange={(e) => setNewCertificateName(e.target.value)}
            style={{ width: "50%", backgroundColor: "#C9DFE3", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
          />
        )}
      </div>
					<div style={{ display:"flex",flex:1 ,marginTop:"30px"}}>
					<h3 style={{color:"#FBBC05"}}>Certificate Template</h3>
					<div style={{position:"relative",justifyContent: "flex-end",display:"flex",flex:1 }}>
	<button style={{ backgroundColor:"#DDE5BF",color:"#53BB6F" }} onClick={handleAddRectangle}>Add Rectangle</button>	
    <button style={{ backgroundColor:"#FFE0D3",color:"#FD7238" }} onClick={() => handleDeleteRectangle(selectedRectangle)}>Delete Rectangle</button>
    <button style={{ backgroundColor:"#F3C4C2",color:"#DB504A" }} onClick={() => handleDeleteRectangles()}>Delete All</button>
	  </div>
	  </div>
    <input 
            type="file"
            accept="image/*"
            id="image"
            name="image"
            onChange={handleImageUpload}
            ref={fileInputRef} // Attach the ref here
          />
        <div style={{ position: 'relative' }} >
          {templateImageSrc && (
            <img src={templateImageSrc} onClick={handleImageClick} alt="Template Preview" />
          )}
		
				 {points.map((point, index) => (
          <Draggable key={index}
			 bounds="parent"
			 position={{ x: point.x, y: point.y }}
			 onDrag={(event, ui) => handleDrag(index, event, ui)} >
            <div
              style={{
				        position:'absolute',
				        top: 0,
                width: '10px',
                height: '10px',
                backgroundColor: 'red',
                cursor: 'move',
				zIndex:10
              }}
            ></div>
        </Draggable>
        ))}
        {selectedTemplate.rectangles.map((rectangle, index) => (
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
              left: Math.min(rectangle.x1, rectangle.x2),
              top:Math.min(rectangle.y1, rectangle.y2),
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
			{getRectangles().map((rectangle, i) => (
                <tr key={rectangle.id}>
            <td>
              <input type="checkbox"
                checked={isCheckedShape[rectangle.id] || false}
                onChange={(e) => handleCheckShape(rectangle.id, e.target.checked)}
              />
            </td>
					<td>
					{i}
					</td>
                  <td>
				  <select mode="multiple"
    style={{ width: "100%", backgroundColor: "#9CBEC5", color: "#576389", fontSize: "19px", borderRadius: "5%" }}
    value={selectedAreas[i] || ''}
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
            onChange={(e) => handleFontSizeChange(i, e.target.value)} >
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
	<span><button style={{ backgroundColor:"#D4DDEE", color:"#758EBC" }} onClick={generateTestImage}>Test Template</button></span>
	<span><button style={{ backgroundColor:"#DDE5BF", color:"#53BB6F" }} onClick={saveTemplate}>Save Template</button></span>
	{selectedTemplate&&(<span><button style={{ backgroundColor:"#FFF2C6", color:"#FBCB25" }} onClick={updateTemplate}>Update Template</button></span>)}
  <span><button style={{ backgroundColor:"#FFE0D3", color:"#FD7238" }} onClick={(e)=>deleteTemplate(selectedTemplate._id)}>Delete Template</button></span>
  {showTestImage&&(	<div>
                <img src={testImageUrl}   />
        </div>)}
    </main>
  );
};

export default CertificateTemplate;