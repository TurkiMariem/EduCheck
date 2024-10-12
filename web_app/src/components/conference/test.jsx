
import React, { useState } from 'react';
import Draggable from 'react-draggable';
const Speakers = () => {
	const [points, setPoints] = useState([]);
	const [rectangles, setRectangles] = useState([]);
    const [certificateImages, setCertificateImages] = useState([]);
	const [selectedRectangle, setSelectedRectangle] = useState(null);
    const participants = [
		{ name: 'Alice', date: '2022-03-01' },
		{ name: 'Bob', date: '2022-03-02' }
	];
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
		};
		setRectangles([...rectangles, newRectangle]);
		setPoints([]);
	  }
	};
  
	const handleSelectRectangle = (id) => {
	  setSelectedRectangle(id);
	};
  
	const handleDeleteRectangle = (id) => {
	  setRectangles(rectangles.filter(rectangle => rectangle.id !== id));
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
  
	const templateImage = new Image();
	templateImage.src = '../images/diplome2.jpg';
	templateImage.onload = () => {
		generateCertificates();
	}; 
	function generateCertificates() {
		const images = participants.map((participant) => {
			const canvas = document.createElement('canvas');
			const ctx = canvas.getContext('2d');
			canvas.width = templateImage.width;
			canvas.height = templateImage.height;
			ctx.drawImage(templateImage, 0, 0, canvas.width, canvas.height);
			ctx.font = 'bold 24px Arial';
			ctx.fillStyle = 'black';
			ctx.textAlign = 'center';
			ctx.fillText(participant.name, canvas.width / 2, 200);
			ctx.fillText(participant.date, canvas.width-130, 350);
	
			const certificateImageUrl = canvas.toDataURL('image/png');
			return certificateImageUrl;
		});
	
		setCertificateImages(images);
	}
  return (
    <div>
     <main>
			<div  className="head-title">
				<div  className="left">
				<h1 className="google-search-heading">
              <span style={{color: '#4285F4'}}>D</span>
              <span style={{color: '#EA4335'}}>a</span>
              <span style={{color: '#FBBC05'}}>s</span>
              <span style={{color: '#4285F4'}}>h</span>
              <span style={{color: '#34A853'}}>b</span>
              <span style={{color: '#EA4335'}}>o</span>
              <span style={{color: '#4285F4'}}>a</span>
              <span style={{color: '#EA4335'}}>r</span>
              <span style={{color: '#FBBC05'}}>d</span>
            </h1>
					</div>
					</div>
					<div>
					<h2>Certificate Tepmlate</h2>
					<div style={{ position: 'relative' }}>
				<img src={templateImage.src}
				  onClick={handleImageClick}
				  style={{ width: '100%', height: 'auto' }}
				/>
				 <h2>Selected Areas:</h2>
				 {points.map((point, index) => (
          <Draggable
            key={index}
            bounds="parent"
            position={{ x: point.x, y: point.y }}
            onDrag={(event, ui) => handleDrag(index, event, ui)}
          >
            <div
              style={{
                position: 'absolute',
                left: point.x,
                top: point.y,
                width: '10px',
                height: '10px',
                backgroundColor: 'red',
                cursor: 'move',
              }}
            ></div>
          </Draggable>
        ))}
        {rectangles.map((rectangle, index) => (
          <div
            key={rectangle.id}
            style={{
              position: 'absolute',
              left: Math.min(rectangle.x1, rectangle.x2),
              top: Math.min(rectangle.y1, rectangle.y2),
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
      <button onClick={handleAddRectangle}>Add Rectangle</button>
      <button onClick={() => handleDeleteRectangle(selectedRectangle)}>Delete Rectangle</button>
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
					</main>
					<div>
            {certificateImages.map((imageUrl, index) => (
                <img key={index} src={imageUrl} alt={`Certificate ${index + 1}`} />
            ))}
        </div>
		
    </div>
  );
};

export default Speakers;