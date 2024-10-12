/*'use strict';

const vision = require('@google-cloud/vision');
const client = new vision.ImageAnnotatorClient({
  keyFilename: './public/pfe-verif-diploma.json'
});
const path = require('path');
const faceapi = require('face-api.js');
const canvas = require('canvas');
const fs = require('fs');
const express = require('express');
const multer = require('multer');
const bodyParser = require('body-parser');
const app = express();
const port = 3001;
const cors = require('cors');
const axioss = require('axios');
/*const tf = require('@tensorflow/tfjs-node');
const initializeTensorFlowBackend = async () => {
  try {
    await tf.setBackend('tensorflow');
    await tf.ready();
    console.log('TensorFlow.js backend is ready');
  } catch (error) {
    console.error('Error initializing TensorFlow backend:', error);
    throw error;
  }
};


const initializeModels = async () => {
  await faceapi.nets.ssdMobilenetv1.loadFromDisk('./models');
  console.log('ssdMobilenetv1 loaded');
  await faceapi.nets.faceLandmark68Net.loadFromDisk('./models');
  console.log('faceLandmark68Net loaded');
  await faceapi.nets.faceRecognitionNet.loadFromDisk('./models');
  console.log('faceRecognitionNet loaded');
};

const runServer = async () => {
  app.use(cors());

  const upload = multer({ dest: 'uploadFaces' });
  const { Canvas, Image, ImageData } = canvas;
  faceapi.env.monkeyPatch({ Canvas, Image, ImageData });

 // await initializeTensorFlowBackend();
  await initializeModels();

  // Serve models and static files
  app.use('/models', express.static(path.join(__dirname, 'models')));
  app.use('/uploadFaces', express.static(path.join(__dirname, 'uploadFaces')));
  app.use(bodyParser.json());

  // Registration endpoint
  app.post('/registerFace', upload.single('image'), async (req, res) => {
    try {
      const userId = req.body.userId;
      const imagePath = path.join(__dirname, 'uploadFaces', req.file.filename);
      console.log("imagePath", imagePath);

      const img = await canvas.loadImage(imagePath);
      console.log("img", img);
      console.log('Is img an instance of canvas.Image?', img instanceof canvas.Image);
      // Log the image dimensions to ensure it's correctly loaded
      console.log('Image width:', img.width);
      console.log('Image height:', img.height);

      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      console.log("detections", detections);

      if (!detections) {
        console.log('No face detected in the image.');
        return res.status(400).send('No face detected');
      }

      // Store the face descriptor
      const faceDescriptor = detections.descriptor;
      console.log('faceDescriptor', faceDescriptor);
      // Upload image to IPFS
    const imageBuffer = fs.readFileSync(imagePath);

    // Store user data including IPFS hash
    const userData = {
      userId,
      faceDescriptor
    };
      console.log("userData", userData);

      fs.writeFileSync(`./data/${userId}.json`, JSON.stringify(userData));
      res.send('User registered successfully');
    } catch (err) {
      console.error('Error in registration endpoint:', err);
      res.status(500).send('Internal server error');
    }
  });

  app.post('/loginFace', upload.single('image'), async (req, res) => {
    try {
      const { userId }  = req.body;
      const imagePath = path.join(__dirname, 'uploadFaces', req.file.filename);
      const img = await canvas.loadImage(imagePath);
    console.log(img);
      const detections = await faceapi.detectSingleFace(img).withFaceLandmarks().withFaceDescriptor();
      console.log("detections", detections);

      if (!detections) {
        console.log('No face detected in the image.');
        return res.status(400).send('No face detected');
      }

      // Load the stored face descriptor
      const userData = JSON.parse(fs.readFileSync(`./data/${userId}.json`));
      const storedDescriptor = new Float32Array(Object.values(userData.faceDescriptor));
      console.log('storedDescriptor', storedDescriptor);

      const distance = faceapi.euclideanDistance(detections.descriptor, storedDescriptor);
      console.log('distance', distance);

      // A threshold of 0.6 is typically used for a good balance between false positives and false negatives
      if (distance < 0.6) {
        res.send('User authenticated successfully');
        console.log('User authenticated successfully');
      } else {
        res.send('User authenticated successfully');
        console.log('User authenticated successfully');
        res.status(401).send('Authentication failed');
      }
    } catch (err) {
      console.error('Error in login endpoint:', err);
      res.status(500).send('Internal server error');
    }
  });

  app.post('/api/add-face', upload.single('image'), async (req, res) => {
    try {
      const image = req.file.buffer;

      const [result] = await client.faceDetection(image);
      const faces = result.faceAnnotations;

      if (faces.length > 0) {
        res.json({ success: true, message: 'Face detected successfully.', faces });
      } else {
        res.json({ success: false, message: 'No face detected.' });
      }
    } catch (error) {
      console.error('Error detecting face:', error);
      res.status(500).json({ error: error.message });
    }
  });

  app.listen(port, () => {
    console.log(`Server running on port ${port}`);
  });
};

runServer().catch(console.error);

*/