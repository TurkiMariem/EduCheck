import axios from 'axios';
import React, { useEffect, useState } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function PendingTemplate() {
  const [showDiplomaModal, setshowDiplomaModal] = useState(false);
  const [templates, settemplates] = useState([]);
  const [selectedTemplate, setselectedTemplate] = useState([]);
  const [isZoomed, setisZoomed] = useState(false);
  const instId=localStorage.getItem('instituteID');
  const [templateImageUrl, setTemplateImageUrl] = useState('');
  const [change, setchange] = useState(false);

  useEffect(() => {
    async function getTemplates() {
      console.log("instId", instId);
      try {
        const response = await axios.get(`http://localhost:5000/diplomatemplates`, {
          params: { instituteId: instId }
        });
        const diplomaTemplate = response.data;
        console.log("diplomaTemplate", diplomaTemplate);
        settemplates(diplomaTemplate);
        return diplomaTemplate;
      } catch (error) {
        console.error('Failed to fetch the diploma template:', error);
      }
    }
    
    getTemplates();
  }, [instId,change]);
  
  const handleTemplateClick = async (event, template) => {
    event.preventDefault();
    if (selectedTemplate) {
      // Hide the form if it's already displayed for the clicked template
      setselectedTemplate(null);
      setshowDiplomaModal(false);
      setTemplateImageUrl('');
    } else {
      // Display the form for the clicked template
      setselectedTemplate(template);
      console.log("template", template);
      setshowDiplomaModal(true);
      const imageUrl = await testTemplate(template);
    if (imageUrl) {
      setTemplateImageUrl(imageUrl);
    }
    }
  };
  
  const testTemplate = async (template) => {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const img = new Image();
    img.src = `/files/${template.image}`;  // Ensure this URL is correct and accessible
    
    try {
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = () => {
          console.error('Error loading template image:', template.image);
          reject(new Error('Failed to load template image'));
        };
      });
  
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
  
      await Promise.all(
        template.Areas.map(async (zone, i) => {
          if (zone === 'qrCode') {
            const qrCodeImage = new Image();
            qrCodeImage.src = '/qrcode.png';  // Ensure this URL is correct and accessible
            
            await new Promise((resolve, reject) => {
              qrCodeImage.onload = resolve;
              qrCodeImage.onerror = () => {
                console.error('Error loading QR code image:', 'qrcode.png');
                reject(new Error('Failed to load QR code image'));
              };
            });
  
            const width = template.rectangles[i].x2 - template.rectangles[i].x1;
            const height = template.rectangles[i].y2 - template.rectangles[i].y1;
            ctx.drawImage(qrCodeImage, template.rectangles[i].x1, template.rectangles[i].y1, width, height);
            ctx.fillText('Educheck.tn', (template.rectangles[i].x1 + template.rectangles[i].x2) / 2, (template.rectangles[i].y1 + template.rectangles[i].y2) / 2 + height / 1.5);
          } else {
            const fontSize = template.fontSize[i] || '30px';
            const fontFamily = template.fontFamily[i] || 'Times New Roman';
            const fontStyle = template.fontStyle[i] || 'Normal';
            ctx.font = `${fontStyle} ${fontSize} ${fontFamily}`;
            ctx.fillStyle = template.colors[i];
            ctx.textAlign = 'center';
            ctx.fillText(zone || '', (template.rectangles[i].x1 + template.rectangles[i].x2) / 2, (template.rectangles[i].y1 + template.rectangles[i].y2) / 2);
          }
        })
      );
  
      return canvas.toDataURL('image/png');
    } catch (error) {
      console.error("Error generating Diplomas:", error);
    }
  };
  
  
async function setDiplomaTemplateStatus(templateId, status) {
  try {
    const url = `http://localhost:5000/diplomatemplates/${templateId}`;
  
    // Make the PUT request to update the template status
    const response = await axios.put(url, {status:"valid"}, {
      headers: {
        'Content-Type': 'application/json'
      }
    });

    console.log('Template status updated successfully:', response.data);
    toast(`Template status updated successfully to ${status}!`)
    setchange(!change);
    return response.data;
  } catch (error) {
    console.error('Error updating template status:', error);
    throw error;
  }
}
  return (
    (
      <main>
        <div className="head-title">
          <div className="left">
            <h1 className="google-search-heading">
              <span style={{ color: '#4285F4' }}>P</span>
              <span style={{ color: '#EA4335' }}>e</span>
              <span style={{ color: '#FBBC05' }}>n</span>
              <span style={{ color: '#34A853' }}>d</span>
              <span style={{ color: '#4285F4' }}>i</span>
              <span style={{ color: '#EA4335' }}>n</span>
              <span style={{ color: '#FBBC05' }}>g</span>{" "}{" "}
              <span style={{ color: '#4285F4' }}>T</span>
              <span style={{ color: '#EA4335' }}>e</span>
              <span style={{ color: '#FBBC05' }}>m</span>
              <span style={{ color: '#4285F4' }}>p</span>
              <span style={{ color: '#34A853' }}>l</span>
              <span style={{ color: '#EA4335' }}>a</span>
              <span style={{ color: '#4285F4' }}>t</span>
              <span style={{ color: '#EA4335' }}>e</span>
              <span style={{ color: '#FBBC05' }}>s</span>
            </h1>
            <div style={{ display:"flex",flex:1 }}>
            <div className="table-data" style={{ width: "100%" }}>
              <div className="order">
                <div className="head">
                  <h3>Recent Pending Templates</h3>
                  <i className='bx bx-search'></i>
                  <i className='bx bx-filter'></i>
                </div>
                <table>
                  <thead>
                    <tr>
                      <th>Template Name</th>
                      <th>Details</th>
                      <th>Created At</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {templates && templates.map((template) => (
                      <tr key={template._id}>
                        <td>{template.name}</td>
                        <td>
                          <button className="status completed" onClick={(e) => { handleTemplateClick(e, template); setshowDiplomaModal(true) }}>View Diploma Template</button>
                        </td>
                        <td>{new Date(template.creationTime).toLocaleString()}</td>
                        <td> <span className={`status ${template.status}`}>{template.status}</span></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
            <div style={{  display: "flex",marginLeft:"80px",height:"fit-content" }}>
              {selectedTemplate && showDiplomaModal && templateImageUrl && (
                <div className="table-data" style={{ flex: "0 0 50%", marginRight: "10px" }}>
                  <div className="order" style={{ backgroundColor: "#FDF2D2" }}>
                    <div className="head">
                      <h3>Template Diploma Test File</h3>
                      <span onClick={() => setshowDiplomaModal(false)}>
                        <i className='bx bx-window-close'></i>
                      </span>
                      <span onClick={() => setisZoomed(true)}>
                        <i className='bx bxs-zoom-in'></i>
                      </span>
                    </div>
                    <table>
                      <tbody>
                        <tr><th>{selectedTemplate.name}</th></tr>
                            <img src={templateImageUrl} alt="Template Preview" className="zoom" width="600px"/>
                          
                        <tr>
                          <td>
                            <button className="validateButton status yes" onClick={() => setDiplomaTemplateStatus(selectedTemplate._id, "valid")}>Validate</button>
                            <button className="removeButton status no" onClick={() => setDiplomaTemplateStatus(selectedTemplate._id, "rejected")}>Reject</button>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
            </div>
          </div>
        </div>
        {isZoomed && (
          <div style={{ zIndex: 7000, position: "fixed", top: 0, left: 0, height: "100%", width: "100%" }}>
            <main>
              <span onClick={() => setisZoomed(false)}>
                <i color="#6F718F" className='bx bx-window-close'></i>
              </span>
              <img src={templateImageUrl} alt="Diploma" className="diploma-image" style={{ backgroundColor: "#6F718F", padding: "50px", justifyContent: "center", width: "100%", height: "100%", objectFit: "cover" }} />
            </main>
          </div>
        )}
        <ToastContainer />
        <style jsx>{`
          .zoom {
            transition: transform 0.2s; /* Animation */
            width: 200px; /* Adjust as needed */
            height: auto;
          }
  
          .zoom:hover {
            transform: scale(1.5); /* (150% zoom - Adjust as needed) */
          }
        `}</style>
      </main>
    ))
}

export default PendingTemplate