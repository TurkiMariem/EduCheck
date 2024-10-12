const express = require('express');
const { MongoClient, ServerApiVersion } = require('mongodb');
const bodyParser = require('body-parser');
//const PushNotifications = require('@pusher/push-notifications-server');

const fs = require('fs');
const path = require('path');
const multer = require('multer');
const app = express();
//const bcrypt = require('bcrypt');
const bcrypt = require('bcryptjs'); // Import bcryptjs instead of bcrypt
const cors = require('cors');
app.use("/files", express.static("files"));
const port = process.env.PORT || 5000;
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
const mongoose = require('mongoose');
const sendEmail = require('./sendEmail');
app.use(express.urlencoded({ extended: true }));
const { getFileUrlFromIPFS, uploadFileToIPFS } = require('./ipfs');
//const { createCanvas, loadImage } = require('canvas');
app.use('/certificates', express.static(path.join(__dirname, 'certificates')));
///////////////save certificates
app.post('/generate-certificate', async (req, res) => {
  try {
    const base64Data = req.body.img.split(';base64,').pop();
    const filename = `certificate_${Date.now()}.png`;
    const filePath = path.join(__dirname, 'certificates', filename);

    fs.writeFile(filePath, base64Data, { encoding: 'base64' }, function (err) {
      if (err) {
        console.error('Error saving image:', err);
        return res.status(500).send('Error saving image');
      } else {
        console.log('Image saved successfully:', filePath);
        res.json({ filePath: `/certificates/${filename}` });
      }
    });
  } catch (error) {
    console.error('Error generating certificate:', error);
    res.status(500).send('Error generating certificate');
  }
});

////////////////////////////////////////////////////
// Connect to MongoDB using Mongoose
const uri = "mongodb+srv://dorrachakroun13:dorra@cluster0.dxbmnzk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  }
});
async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);
mongoose.connect(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverSelectionTimeoutMS: 30000,
})
.then(() => console.log("Connected to MongoDB"))
.catch((err) => console.error("Error connecting to MongoDB:", err));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null,  path.join(__dirname,'..','verifEducheck' ,'public', 'files'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now();
    cb(null, uniqueSuffix + file.originalname);
  },
});

/*const beamsClient = new PushNotifications({
  instanceId: '4e1c5286-875a-4d3f-934c-205103f25516',
  secretKey: '4C795970C478EB5F2425F0AD0C0B712EAEC264C7C599578EBFA2334E3F59A7DB',
});

app.post('/send-notification', async (req, res) => {
  const { userId, title, message } = req.body;

  try {
    const publishResponse = await beamsClient.publishToUsers([userId], {
      web: {
        notification: {
          title: title,
          body: message,
          deep_link: 'https://localhost:3000',
        },
      },
    });
    res.status(200).send(publishResponse);
  } catch (error) {
    console.error('Error sending notification:', error);
    res.status(500).send(error);
  }
});*/

const jwt = require('jsonwebtoken');

// Generate a secure random key
const secretKey = "dorra1515";

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers['Authorization'];
  console.log("authHeader",authHeader);
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(403).send('Invalid Authorization Header');
  }

  const token = authHeader.split(' ')[1];
  console.log(token);
  if (!token) {
    return res.status(403).send('Missing Token');
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    console.log(req.user);
    console.log("decoded",decoded);
    next();
  } catch (err) {
    return res.status(401).send('Invalid Token');
  }
};


const accountSchema = new mongoose.Schema({
  adresse:String ,
  location:String,
  affectedTo: String,
  used:{type:Boolean, default:false}
});

const universitySchema = new mongoose.Schema({
  universityName: String,
  instName: String,
  instAcronym: String,
  instRef: String,
});

const BlockchainAccount = mongoose.model('BlockchainAccount', accountSchema);
const University = mongoose.model('University', universitySchema);
/////////////
const instituteSchema = new mongoose.Schema({
  universityName: String,
  universityRef: String,
  instName: String,
  instAcronym: String,
  instRef: String,
  officerEmail: String,
  validatorEmail: String,
  contact: Number,
  website: String,
  status: {
    type: String,
    required: true,
    enum: ['created', 'approved','rejected'], // Status can be 'todo', 'in-progress', or 'completed'
    default: 'created',
  },
  officerFaceFeatures: {
    type: [Number], // Array of numbers to represent face features
    required: false,
  },
  validatorFaceFeatures: {
    type: [Number], // Array of numbers to represent face features
    required: false,
  }
});

// Create a model based on the schema
const Institute = mongoose.model('Institute', instituteSchema);
// Define instituteSchema for my data

const conferenceSchema = new mongoose.Schema({
  confName: String,
  confEmail: { type: String, unique: true },
  confPassword: String,
  confContact: Number,
  organisation: String,
  organisationPref: String,
  bio:String,
  profilePic:String,
  
});

const templateSchema = new mongoose.Schema({
  name: {type:String },
  image:{type:String },
  confEmail: {type:String },
  Areas: Array,
  fontFamily: Array,
  fontStyle: Array,
  fontSize: Array,
  colors: Array,
  rectangles: Array,
});
const diplomaTemplateSchema = new mongoose.Schema({
  name: {type:String,required:true ,unique:true},
  image:{type:String },
  officerEmail: {type:String , required:true},
  instituteId:String,
  Areas: Array,
  fontFamily: Array,
  fontStyle: Array,
  fontSize: Array,
  colors: Array,
  rectangles: Array,
  status:{type:String, default:"Pending"},
}, { timestamps: true });
// address, confTitle,confAffiche, confCategory,confDescription,selectedSpeakers,location,datetimes,startTime,endTime,
const eventSchema = new mongoose.Schema({
  address: String,
  conferenceId: {
    type: String,
    unique: true,
  },
  confTitle: {
    type: String,
    required: true,
  },
  confAffiche: String,
  confCategory: {
    type: String,
    required: true,
  },
  confDescription: {
    type: String,
    required: true,
  },
  selectedSpeakers: Array,
  selectedOrganizers: Array,
  confParticipants: String,
  datetimes: {
    type: String,
    required: true,
  },
  startTime: Array,
  endTime: Array,
  location: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['created', 'approved', 'rejected', 'completed', 'certified'],
    default: 'created',
  },
  sessions: String,
  boosted: { type: String, default: 'false' },
  displayed: { type: String, default: 'false' },
  userEmail: String,
});
const speakerSchema = new mongoose.Schema({
  name:String, //not required Optional
  email: String,
  picture:String,
  bio: String,
  topic: String,
  contact: String,
  availability: Array,
  confEmail:String,
});
const speakerUserSchema = new mongoose.Schema({
  name:String, //not required Optional
  email: String,
  picture:String,
  bio: String,
  topic: String,
  contact: String,
  availability: Array,
  cv:String,
  status: {
    type: String,
    enum: ['joined', 'accepted', 'rejected'], // Status can be 'todo', 'in-progress', or 'completed'
    default: 'joined',
  },
  conferenceId:String
});
const participantSchema = new mongoose.Schema({
  name:String, //not required Optional
  email: String,
  affiliation:String,
  interest: String,
  topic: String,
  contact: String,
  status: {
    type: String,
    enum: ['joined', 'accepted', 'rejected','certified'], // Status can be 'todo', 'in-progress', or 'completed'
    default: 'joined',
  },
  sessions:{
    type: String,
    default: 'all',
  },
  conferenceId:String,
  confEmail:String
});
const organizerSchema = new mongoose.Schema({
  name:String, //not required Optional
  email: String,
  picture:String,
  responsabilities: String,
  role: String,
  contact: String,
  availability: Array,
  confEmail:String,
});
const serviceSchema = new mongoose.Schema({
  title:String, 
  description: String,
  picture:String,
});
const collabSchema = new mongoose.Schema({
  title:String, 
  description: String,
  picture:String,
});
const stepSchema = new mongoose.Schema({
  title:String, 
  picture:String,
});
const stepConfSchema = new mongoose.Schema({
  titleConf:String, 
  pictureConf:String,
});
const stepInstSchema = new mongoose.Schema({
  titleInst:String, 
  pictureInst:String,
});

const session = new mongoose.Schema({
  eventTitle:String,
  startTime:String,
  endTime:String,
  confId:String,});

const todoSchema = new mongoose.Schema({
  todoContent: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    enum: ['to-do', 'in-progress', 'completed'], // Status can be 'todo', 'in-progress', or 'completed'
    default: 'to-do',
  },
  userEmail: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  completedAt: {
    type: Date,
  },
});
const feedbackSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: false,
  },
  displayed: {
    type: Boolean,
    default: false,
  },
});
const notifications = new mongoose.Schema({
  content: { type: String, required: true },
  from: { type: String, required: true },
  to: { type: String, required: true },
  type:String,
  createdAt: { type: Date, default: Date.now },
});
const certificateSchema = new mongoose.Schema({
  participantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Participant',
    required: true,
  },
  conferenceId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conference',
    required: true,
  },
  ipfsHash: {
    type: String,
    required: true,
  },
  certifUrl:{
    type:String,
  },
  confEmail: {
    type: String,
    required: true,
  },
  certifId: {
    type: String,
    required: true,
  },
});
const studentSchema = new mongoose.Schema({
  studentName: { type: String, required: true },
  studentEmail: { type: String, required: true },
  studentCIN: { type: String, required: true },
  birthDay: { type: Date, required: true },
  mention: { type: String},
  remiseDay: { type: Date ,required: true},
  departmentID: { type: String, required: true },
  diplomeRef: { type: String ,default:null },
  diplomeReference: { type: String ,default:'001002004' },
  diplomeName: { type: String, required: true },
  diplomeHash:{ type: String },
  diplomeurl:{ type: String },
  instituteId:{type: String, required: true},
  status: { type: String, required: true,default:"ungraduated" },
});
const departmentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  ref: { type: String, required: true },
  diplomas: [{
    name: { type: String},
    ref: { type: String }
  }],
  instID:{ type: String, required: true }
});
// Create a model based on the schema
const Conference = mongoose.model('Conference', conferenceSchema);
const Eventt = mongoose.model('Eventt', eventSchema);
const Speaker = mongoose.model('Speaker', speakerSchema);
const SpeakerUser = mongoose.model('SpeakerUser', speakerUserSchema);
const Participant = mongoose.model('Participant', participantSchema);
const Organizer = mongoose.model('Organizer', organizerSchema);
const Service = mongoose.model('Service', serviceSchema);
const Collab = mongoose.model('Collab', collabSchema);
const Step = mongoose.model('Step', stepSchema);
const StepConf = mongoose.model('StepConf', stepConfSchema);
const StepStu = mongoose.model('StepStu', stepInstSchema);
const ToDo = mongoose.model('ToDo', todoSchema);
const Notification = mongoose.model('Notification', notifications);
const Session = mongoose.model('Session', session);
const Certificate = mongoose.model('Certificate', certificateSchema);
const Student = mongoose.model('Student', studentSchema);
const Department = mongoose.model('Department', departmentSchema);
const Template = mongoose.model('Template', templateSchema);
const DiplomaTemplate = mongoose.model('DiplomaTemplate', diplomaTemplateSchema);
const Feedback = mongoose.model('Feedback', feedbackSchema);

// Parse JSON bodies for POST requests
app.use(express.json());
// Serve static files from the public directory
app.use(express.static('public'));
const upload = multer({ storage: storage });

//////
app.post('/addAccount', async (req, res) => {
  const { adresse, location, affectedTo, used } = req.body;

  console.log('Received request:', req.body);  // Log the incoming request body
  const newAccount = new BlockchainAccount({
    adresse,
    location,
    affectedTo,
    used
  });

  try {
    await newAccount.save();
    res.status(201).json(newAccount);
  } catch (error) {
    console.error('Error creating account:', error);  // Log the error
    res.status(500).json({ error: 'Error creating account' });
  }
});

app.put('/updateAccount/:adresse', async (req, res) => {
  const { adresse } = req.params;
  const { location, affectedTo, used } = req.body;

  try {
    const account = await Account.findOneAndUpdate(
      { adresse },
      { $set: { location, affectedTo, used } },
      { new: true, runValidators: true }
    );
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json(account);
  } catch (error) {
    console.error('Error updating account:', error);
    res.status(500).json({ error: 'Error updating account' });
  }
});

// POST endpoint to create a new template with an image
app.post('/templates', upload.single('image'), async (req, res) => {
  console.log("templateReceived", req.body);

  const { name, confEmail, Areas, fontFamily, fontSize, fontStyle, colors, rectangles } = req.body;
  const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  console.log("Image:", image);

  try {
    const template = new Template({
      name,
      confEmail,
      Areas: JSON.parse(Areas),
      fontFamily: JSON.parse(fontFamily),
      fontSize: JSON.parse(fontSize),
      fontStyle: JSON.parse(fontStyle),
      colors: JSON.parse(colors),
      rectangles: JSON.parse(rectangles),
      image, // Store the image buffer directly in the database
    });
    await template.save();
    res.status(201).send(template);
  } catch (error) {
    res.status(400).send(error);
  }
});
// GET endpoint to fetch all templates
app.get('/templates', async (req, res) => {
  try {
    const templates = await Template.find();
    res.status(200).send(templates);
  } catch (error) {
    res.status(500).send(error);
  }
});
// PUT endpoint to update an existing template
app.put('/templates/:id', upload.single('image'), async (req, res) => {
  console.log("templateReceived", req.body);

  const allowedUpdates = ['name', 'confEmail', 'Areas', 'fontFamily', 'fontStyle', 'fontSize', 'colors', 'rectangles'];
  const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));

  if (req.file) {
    updates.push('image');
    req.body.image = req.file.filename;
  }

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const template = await Template.findById(req.params.id);
    if (!template) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      if (update === 'Areas' || update === 'fontFamily' || update === 'fontSize' || update === 'fontStyle' || update === 'colors' || update === 'rectangles') {
        template[update] = JSON.parse(req.body[update]);
      } else {
        template[update] = req.body[update];
      }
    });

    await template.save();
    res.send(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(400).send(error);
  }
});

app.delete('/templates/:id', async (req, res) => {
  try {
    const template = await Template.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).send({ error: 'Template not found' });
    }

    res.send({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});
/////////////DiplomaTemplate
// POST endpoint to create a new template with an image
app.post('/diplomatemplates', upload.single('image'), async (req, res) => {
  console.log("templateReceived", req.body);

  const { name, officerEmail, instituteId, Areas, fontFamily, fontSize, fontStyle, colors, rectangles } = req.body;
  const image = req.file ? req.file.filename : null; // Get the filename of the uploaded image
  console.log("Image:", image);

  try {
    const template = new DiplomaTemplate({
      name,
      officerEmail,
      instituteId,
      Areas: JSON.parse(Areas),
      fontFamily: JSON.parse(fontFamily),
      fontSize: JSON.parse(fontSize),
      fontStyle: JSON.parse(fontStyle),
      colors: JSON.parse(colors),
      rectangles: JSON.parse(rectangles),
      image, // Store the image buffer directly in the database
    });
    await template.save();
    res.status(201).send(template);
  } catch (error) {
    res.status(400).send(error);
  }
});
// GET endpoint to fetch all templates
app.get('/diplomatemplates', async (req, res) => {
  try {
    const { instituteId } = req.query;
    let templates;

    if (instituteId) {
      templates = await DiplomaTemplate.find({ instituteId: instituteId });
    } else {
      templates = await DiplomaTemplate.find();
    }
// Add creation time to each template
const templatesWithCreationTime = templates.map(template => {
  const creationTime = template._id.getTimestamp();
  return { ...template.toObject(), creationTime };
});

res.status(200).json(templatesWithCreationTime);  // Ensure JSON response
  } catch (error) {
    res.status(500).json({ error: error.message });  // Ensure JSON response for errors
  }
});



app.get('/diplomatemplatename', async (req, res) => {
  try {
    console.log("Received request for template:", req.query.name);
    const templateDiplomaName = req.query.name;

    // Use async/await for Mongoose queries
    const template = await DiplomaTemplate.findOne({ name: templateDiplomaName });

    if (template) {
      res.json(template);
    } else {
      res.status(404).json({ error: 'DiplomaTemplate not found' });
    }
  } catch (error) {
    console.error('Server error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// PUT endpoint to update an existing template
app.put('/diplomatemplates/:id', upload.single('image'), async (req, res) => {
  console.log("templateReceived", req.body);

  const allowedUpdates = ['name', 'confEmail', 'Areas', 'fontFamily', 'fontStyle', 'fontSize', 'colors', 'rectangles','status'];
  const updates = Object.keys(req.body).filter(key => allowedUpdates.includes(key));

  if (req.file) {
    updates.push('image');
    req.body.image = req.file.filename;
  }

  const isValidOperation = updates.every((update) => allowedUpdates.includes(update));
  if (!isValidOperation) {
    return res.status(400).send({ error: 'Invalid updates!' });
  }

  try {
    const template = await DiplomaTemplate.findById(req.params.id);
    if (!template) {
      return res.status(404).send();
    }

    updates.forEach((update) => {
      if (update === 'Areas' || update === 'fontFamily' || update === 'fontSize' || update === 'fontStyle' || update === 'colors' || update === 'rectangles') {
        template[update] = JSON.parse(req.body[update]);
      } else {
        template[update] = req.body[update];
      }
    });

    await template.save();
    res.send(template);
  } catch (error) {
    console.error('Error updating template:', error);
    res.status(400).send(error);
  }
});

app.delete('/diplomatemplates/:id', async (req, res) => {
  try {
    const template = await DiplomaTemplate.findByIdAndDelete(req.params.id);

    if (!template) {
      return res.status(404).send({ error: 'Template not found' });
    }

    res.send({ message: 'Template deleted successfully' });
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/accounts', async (req, res) => {
  try {
    const accounts = await BlockchainAccount.find();
    res.json(accounts);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching accounts' });
  }
});

app.delete('/deleteAccount/:adresse', async (req, res) => {
  const { adresse } = req.params;

  try {
    const account = await BlockchainAccount.findOneAndDelete({ adresse });
    if (!account) {
      return res.status(404).json({ error: 'Account not found' });
    }
    res.json({ message: 'Account deleted successfully' });
  } catch (error) {
    console.error('Error deleting account:', error);
    res.status(500).json({ error: 'Error deleting account' });
  }
});


// Endpoint to get file URL from IPFS
app.get('/getFileUrlFromIPFS/:hash', (req, res) => {
  const hash = req.params.hash;
  const url = getFileUrlFromIPFS(hash);
  res.json({ url });
});
app.post('/uploadFileToIPFS', upload.single('file'), async (req, res) => {
  try {
    // Ensure a file was uploaded
    if (!req.file) {
      return res.status(400).send('No file uploaded');
    }

    console.log("req.file", req.file);

    // Upload the file to IPFS
    const ipfsHash = await uploadFileToIPFS(req.file.path, req.file.originalname);

    // Return the IPFS hash to the client
    res.json({ hash: ipfsHash });
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    res.status(500).send('Failed to upload file');
  }
});

app.get('/departments/:instID', async (req, res) => {
  try {
    const instID = req.params.instID;
    const departments = await Department.find({ instID: instID });
    res.json(departments);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error retrieving departments' });
  }
});

// POST /departments
// Create a new department
app.post('/departments', async (req, res) => {
  try {
    const { name, ref, diplomas,instID } = req.body;
    const department = new Department({ name, ref, diplomas,instID });
    await department.save();
    res.json(department);
  } catch (err) {
    console.error(err);
    res.status(400).json({ message: 'Error creating department' });
  }
});
// Update department diplomas
app.put('/departments/:id/diplomas', async (req, res) => {
  const { id } = req.params;
  const { diplomas } = req.body;

  try {
    const department = await Department.findByIdAndUpdate(id, { diplomas }, { new: true });
    if (!department) {
      return res.status(404).send('Department not found');
    }
    res.send(department);
  } catch (error) {
    res.status(400).send(error.message);
  }
});
// GET endpoint to get institute by officerEmail and status
/*app.get('/institutes', async (req, res) => {
  const { email } = req.query;

  if (!email) {
    return res.status(400).send({ error: 'Email query parameter is required' });
  }

  try {
    const institutes = await Institute.find({ officerEmail: email, status: 'approved' });
    res.status(200).json(institutes);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});*/
///////////////////
app.post('/get-students', async (req, res) => {
  const { studentIds } = req.body;

  try {
    const students = await Student.find({ _id: { $in: studentIds } });
    res.status(200).json(students);
  } catch (error) {
    console.error('Error fetching students:', error);
    res.status(500).send('Error fetching students');
  }
});
app.get('/institute/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const institute = await Institute.findById(id);
    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }
    res.json(institute);
  } catch (error) {
    console.error('Error fetching institute:', error);
    res.status(500).json({ error: 'Error fetching institute' });
  }
});
///////////////Students////////////////////
app.post('/students', async (req, res) => {
  try {
    const student = new Student(req.body);
    await student.save();
    res.status(201).send(student);
  } catch (error) {
    res.status(400).send(error);
  }
});
app.get('/students', async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/students/:id', async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.get('/students/institute/:instituteId', async (req, res) => {
  const { instituteId } = req.params;
  const { departmentId, diplomaRef ,status} = req.query;

  try {
    const query = { instituteId };

    if (departmentId) {
      query.departmentID = departmentId;
    }

    if (diplomaRef) {
      query.diplomeRef = diplomaRef;
    }
    if (status) {
      query.status = status;
    }

    console.log('Query:', query);

    const students = await Student.find(query);

    if (students.length === 0) {
      return res.status(404).send({ message: 'No students found for this query' });
    }

    res.status(200).send(students);
  } catch (error) {
    res.status(500).send(error);
  }
});

app.put('/students/:id', async (req, res) => {

  console.log("hello from /students/:id");
  try {
    const student = await Student.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(student);
    console.log("hello from /students/:id",student);
  } catch (error) {
    res.status(400).send(error);
  }
});

app.delete('/Students/:id', async (req, res) => {
  try {
    const student = await Student.findByIdAndDelete(req.params.id);
    if (!student) {
      return res.status(404).send();
    }
    res.status(200).send(student);
  } catch (error) {
    res.status(500).send(error);
  }
});

/////////// sessions  ///////////////////////////////////////////////
// POST request to create a new certificate
app.post('/certificates', async (req, res) => {
  const { participantId, conferenceId, ipfsHash,certifUrl, confEmail, certifId } = req.body;
console.log(req.body);
  try {
    const newCertificate = new Certificate({
      participantId,
      conferenceId,
      ipfsHash,
      certifUrl,
      confEmail,
      certifId,
    });

    await newCertificate.save();
    res.status(201).json({ message: 'Certificate created successfully', certificate: newCertificate });
  } catch (error) {
    console.error('Error creating certificate:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
// GET request to retrieve all certificates
app.get('/certificates', async (req, res) => {
  try {
    const certificates = await Certificate.find();
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error fetching certificates:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// GET request to retrieve certificates by confId
app.get('/certificates/conference/:confId', async (req, res) => {
  const { confId } = req.params;
  
  try {
    const certificates = await Certificate.find({ confId });
    res.status(200).json(certificates);
  } catch (error) {
    console.error('Error fetching certificates by conference ID:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
/////////// sessions  ///////////////////////////////////////////////
app.post('/sessions11', async (req, res) => {
  const { eventTitle, startTime, endTime, confId } = req.body;
  console.log('Received request to register Session:', req.body);
  try {
    const session = new Session({ eventTitle, startTime, endTime, confId });
    await session.save();
    console.log('Session Added successfully:', session);
    res.status(201).json({ message: 'Session registered successfully', session });
  } catch (error) {
    console.error('Error creating Session:', error);
    res.status(500).json({ error: 'Error creating Session' });
  }
});


app.get('/sessions11', async (req, res) => {
  try {
    const { id } = req.query;
    console.log(req.query);
    const filter = {};
    if (id) {
      filter.confId = id;
    }
   
    const sessions = await Session.find(filter);
    console.log(sessions);
    res.status(200).json(sessions);
  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).send('Error fetching sessions');
  }
});

app.put('/sessions11/:id', async (req, res) => {
  const { id } = req.params;
  const { eventTitle,startTime,endTime } = req.body;
  console.log(`Received request to update Session status with ID ${id} `);

  try {
    // Find the Session by ID and update their status
    const updatedSession = await Session.findByIdAndUpdate(id, { eventTitle,startTime,endTime }, { new: true });
    if (!updatedSession) {
      return res.status(404).json({ error: 'Session not found' });
    }

    console.log('Session status updated:', updatedSession);
    res.status(200).json({ message: 'Session status updated successfully', Session: updatedSession });
  } catch (error) {
    console.error('Error updating Session status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

/////////// joinedParticipants  ///////////////////////////////////////////////
app.post('/participants', async (req, res) => {
  const {name,email,affiliation,interest,topic,contact,status,sessions,conferenceId,confEmail } = req.body;
  console.log('Received request to register Participant:', req.body);
  try {
    const pp = new Participant({ name,email,affiliation,interest,topic,contact,status,sessions,conferenceId,confEmail});
    await pp.save();
    console.log('Participant Added successfully:', pp);
    res.status(201).send('Participant registered successfully');
  } catch (error) { 
    console.error('Error creating Participant:', error);
    res.status(500).send('Error creating Participant');
  }
});
app.get('/participants', async (req, res) => {
  try {
    const { conferenceId, confEmail, status } = req.query;
    console.log(req.query);
    const filter = {};
    if (conferenceId) {
      filter.conferenceId = conferenceId;
    }
    if (confEmail) {
      filter.confEmail = confEmail;
    }
    if (status) {
      filter.status = { $in: status.split(',') };
    }
    const participants = await Participant.find(filter);
    console.log(participants);
    res.status(200).json(participants);
  } catch (error) {
    console.error('Error fetching participants:', error);
    res.status(500).send('Error fetching participants');
  }
});

app.get('/participants/:id', async (req, res) => {
  try {
    const { id } = req.params;
    console.log('Request params:', req.params);

    const participant = await Participant.findById(id);

    if (!participant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    console.log('Fetched participant:', participant);
    res.status(200).json(participant);
  } catch (error) {
    console.error('Error fetching participant:', error);
    res.status(500).json({ error: 'Error fetching participant' });
  }
});


app.put('/participants/:id', async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  console.log(`Received request to update participant status with ID ${id} to ${status}`);

  try {
    // Find the participant by ID and update their status
    const updatedParticipant = await Participant.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedParticipant) {
      return res.status(404).json({ error: 'Participant not found' });
    }

    console.log('Participant status updated:', updatedParticipant);
    res.status(200).json({ message: 'Participant status updated successfully', participant: updatedParticipant });
  } catch (error) {
    console.error('Error updating participant status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});


/////////// joinedSpeakers   ///////////////////////////////////////////////
app.post('/newSpeakers', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'cv', maxCount: 1 }]), async (req, res) => {
  const {name,email,bio,topic,contact,availability,status,conferenceId } = req.body;
  const SpeakerPic = req.files && req.files['image'] && req.files['image'][0] ? req.files['image'][0].filename : null;
  const SpeakerCV =  req.files && req.files['cv'] && req.files['cv'][0] ? req.files['cv'][0].filename : null;
  console.log('Received request to register newSpeakerUser:', req.body);
  console.log('newSpeakerUser Pic:', SpeakerPic);
  console.log('newSpeakerUser CV:', SpeakerCV);
  try {
    const newSpeakerUser = new SpeakerUser({ name,email,SpeakerPic,SpeakerCV,bio,topic,contact,availability,status,conferenceId});
    await newSpeakerUser.save();
    console.log('newSpeakerUser Added successfully:', newSpeakerUser);
    res.status(201).send('newSpeakerUser registered successfully');
  } catch (error) {
    console.error('Error creating newSpeakerUser:', error);
    res.status(500).send('Error creating newSpeakerUser');
  }
});
///////////////// Notification ///////////
app.post('/notifications', async (req, res) => {
  const { content, from, to,type } = req.body;
  try {
    const newNotification = new Notification({ content, from, to,type });
    await newNotification.save();
    console.log('Notification saved successfully:', newNotification);
    res.status(201).json(newNotification);
  } catch (error) {
    console.error('Error saving notification:', error);
    res.status(500).json({ error: 'Failed to save notification' });
  }
});

// GET /notifications
app.get('/notifications', async (req, res) => {
  const { to } = req.query;
  try {
    let notifications;
    if (to) {
      notifications = await Notification.find({ to });
    } else {
      notifications = await Notification.find();
    }
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ error: 'Failed to fetch notifications' });
  }
});

app.delete('/notifications/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const deletedNotification = await Notification.findByIdAndDelete(id);
    if (!deletedNotification) {
      throw new Error('Notification not found');
    }
    console.log('Notification deleted successfully:', deletedNotification);
    res.status(204).send();
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ error: 'Failed to delete notification' });
  }
});
///////////ToDoList   //////////////////
app.post('/todo', async (req, res) => {
  try {
    const { todos,userEmail } = req.body;
    const newTodos = todos.map(todo => ({
      todoContent: todo.text,
      status: todo.status,
      userEmail: userEmail,
      createdAt: new Date(),
      updatedAt: new Date(),
      completedAt: todo.status === 'completed' ? new Date() : null,
    }));
    console.log('Received POST request to /todo',newTodos);
    await ToDo.insertMany(newTodos);
    res.status(200).send("task saved");
  } catch (error) {
    console.error('Error saving tasks:', error);
    res.status(500).send('Error saving tasks');
  }
});
app.get('/todocompleted', async (req, res) => {
  try {
    const { userEmail, status } = req.query;
    let tasks;
    if (status) {
      tasks = await ToDo.find({ userEmail: userEmail, status: status }).limit(10).skip(0);
    }
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});
app.get('/todo', async (req, res) => {
  try {
    const { userEmail ,status} = req.query;
    const statusArray = Array.isArray(status) ? status : [status];
    const tasks = await ToDo.find({ userEmail: userEmail, status: { $in: statusArray } }).limit(10).skip(0);
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).send('Error fetching tasks');
  }
});
app.put('/todo/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Updated speaker object from front-end

    // Map the 'text' field from 'updates' to 'todoContent' field
    const updateData = { todoContent: updates.text, status: updates.status };

    const updatedTask = await ToDo.findOneAndUpdate({ _id: id }, updateData, { new: true }).limit(10).skip(0);

    if (!updatedTask) {
      return res.status(404).send('Task not found');
    }

    res.json(updatedTask);
  } catch (error) {
    console.error('Error updating task:', error);
    res.status(500).send('Error updating task');
  }
});


app.delete('/todo/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedTask = await ToDo.findByIdAndDelete(id).limit(10).skip(0);

    if (!deletedTask) {
      return res.status(404).send('Task not found');
    }

    console.log("Deleted task:", deletedTask);
    res.json(deletedTask);
  } catch (error) {
    console.error('Error deleting task:', error);
    res.status(500).send('Error deleting task');
  }
});
///////////Speakers   //////////////////

app.post('/speakers', upload.single('image'), async (req, res) => {
  const { name, email, bio, topic, contact, availability,confEmail } = req.body;
  const picture = req.file ? req.file.filename : null; 
  
  try {
    const newSpeaker = new Speaker({ name,email,picture,bio,topic,contact,availability,confEmail});
    await newSpeaker.save();
    res.status(201).send('Speaker registered successfully');
  } catch (error) {
    console.error('Error creating Speaker:', error);
    res.status(500).send('Error creating Speaker');
  }
});
app.get('/speakers', async (req, res) => {
  try {
    const { confEmail } = req.query;
    console.log("confEmailserver",confEmail);
    const speakers = await Speaker.find({ confEmail: confEmail });
  
    res.json(speakers);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.put('/speakers/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Updated speaker object from front-end
    console.log("speaker id", id);
    console.log("updates", updates);

    const updatedSpeaker = await Speaker.findOneAndUpdate({ _id: id }, updates,{new: true });

    if (!updatedSpeaker) {
      return res.status(404).send('Speaker not found');
    }

    console.log("updatedSpeaker", updatedSpeaker);
    res.json(updatedSpeaker);
  } catch (error) {
    console.error('Error updating speaker:', error);
    res.status(500).send('Error updating speaker');
  }
});


app.delete('/speakers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSpeaker = await Speaker.findByIdAndDelete(id);

    if (!deletedSpeaker) {
      return res.status(404).send('Speaker not found');
    }

    console.log("Deleted speaker:", deletedSpeaker);
    res.json(deletedSpeaker);
  } catch (error) {
    console.error('Error deleting speaker:', error);
    res.status(500).send('Error deleting speaker');
  }
});
///////////organizers   //////////////////
app.post('/organizers', upload.single('image'), async (req, res) => {
  const { name, email, responsabilities, role, contact, availability,confEmail  } = req.body;
  const picture = req.file.filename;

  console.log('Received request to register organizer:', req.body);
  console.log('Organizer picture', picture);

  try {
    const newOrganizer = new Organizer({ name, email, responsabilities, picture, role, contact, availability,confEmail });
    await newOrganizer.save();
    console.log('organizer Added successfully:', newOrganizer);
    res.status(201).send('organizer registered successfully');
  } catch (error) {
    console.error('Error creating organizer:', error);
    res.status(500).send('Error creating organizer');
  }
});
app.get('/organizers', async (req, res) => {
  try {
    const { confEmail } = req.query;
    console.log("confEmailserver",confEmail);
    const organizers = await Organizer.find({ confEmail: confEmail });
  
    res.json(organizers);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.put('/organizers/:id', async(req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; // Updated speaker object from front-end
    console.log("organizer id", id);
    console.log("updates", updates);
    const updatedSpeaker = await Organizer.findOneAndUpdate({ _id: id }, updates,{new: true });

    if (!updatedSpeaker) {
      return res.status(404).send('organizer not found');
    }

    console.log("updatedorganizer", updatedSpeaker);
    res.json(updatedSpeaker);
  } catch (error) {
    console.error('Error updating organizer:', error);
    res.status(500).send('Error updating organizer');
  }
});


app.delete('/organizers/:id', async (req, res) => {
  try {
    const { id } = req.params;

    const deletedSpeaker = await Organizer.findByIdAndDelete(id);

    if (!deletedSpeaker) {
      return res.status(404).send('organizer not found');
    }

    console.log("Deleted organizer:", deletedSpeaker);
    res.json(deletedSpeaker);
  } catch (error) {
    console.error('Error deleting organizer:', error);
    res.status(500).send('Error deleting organizer');
  }
});
///////////organizers   //////////////////
app.post('/services', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const picture = req.file.filename;

  console.log('Received request to register service:', req.body);
  console.log('service picture', picture);

  try {
    const newservice = new Service({ title, description, picture });
    await newservice.save();
    console.log('service Added successfully:', newservice);
    res.status(201).send('service registered successfully');
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});
app.get('/services', async (req, res) => {
  try {
    const services = await Service.find();
    console.log("services",services);
    res.json(services);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.put('/services/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 
    if (req.file) {
      updates.picture = req.file.filename; 
    }
    console.log("service id", id);
    console.log("updates", updates);

    const updatedService = await Service.findOneAndUpdate({ _id: id }, updates, { new: true });
    
    if (!updatedService) {
      return res.status(404).send('Service not found');
    }

    console.log("updatedService", updatedService);
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).send('Error updating service');
  }
});

app.delete('/services/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpeaker = await Service.findByIdAndDelete(id);
    if (!deletedSpeaker) {
      return res.status(404).send('service not found');
    }
    console.log("Deleted service:", deletedSpeaker);
    res.json(deletedSpeaker);
  } catch (error) {
    console.error('Error deleting service:', error);
    res.status(500).send('Error deleting service');
  }
});
///////////collaborators   //////////////////
app.post('/collaborators', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const picture = req.file.filename;

  console.log('Received request to register service:', req.body);
  console.log('service picture', picture);

  try {
    const newCollab = new Collab({ title, description, picture });
    await newCollab.save();
    console.log('Collab Added successfully:', newCollab);
    res.status(201).send('Collab registered successfully');
  } catch (error) {
    console.error('Error creating Collab:', error);
    res.status(500).send('Error creating Collab');
  }
});
app.get('/collaborators', async (req, res) => {
  try {
    const collaborators = await Collab.find();
    console.log("collaborators",collaborators);
    res.json(collaborators);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.put('/collaborators/:id', upload.single('image'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body; 
    if (req.file) {
      updates.picture = req.file.filename; 
    }
    console.log("Collab id", id);
    console.log("updates", updates);

    const updatedCollab = await Collab.findOneAndUpdate({ _id: id }, updates, { new: true });
    
    if (!updatedCollab) {
      return res.status(404).send('Collab not found');
    }

    console.log("updatedCollab", updatedCollab);
    res.json(updatedCollab);
  } catch (error) {
    console.error('Error updating Collab:', error);
    res.status(500).send('Error updating Collab');
  }
});

app.delete('/collaborators/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpeaker = await Collab.findByIdAndDelete(id);
    if (!deletedSpeaker) {
      return res.status(404).send('Collab not found');
    }
    console.log("Deleted Collab:", deletedSpeaker);
    res.json(deletedSpeaker);
  } catch (error) {
    console.error('Error deleting Collab:', error);
    res.status(500).send('Error deleting Collab');
  }
});
///////////Steps   //////////////////
app.post('/steps', upload.single('image'), async (req, res) => {
  const { title, description } = req.body;
  const picture = req.file.filename;

  console.log('Received request to register service:', req.body);
  console.log('service picture', picture);

  try {
    const newservice = new Step({ title, description, picture });
    await newservice.save();
    console.log('service Added successfully:', newservice);
    res.status(201).send('service registered successfully');
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});
app.get('/steps', async (req, res) => {
  try {
    const steps = await Step.find();
    console.log("steps",steps);
    res.json(steps);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.put('/steps/:id', upload.single('picture'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { title: req.body.title }; // Extract only required fields

    if (req.file) {
      updates.picture = req.file.filename; // Assuming you store the file path
    }

    console.log("service id", id);
    console.log("updates", updates);

    const updatedService = await Step.findOneAndUpdate({ _id: id }, updates, { new: true });

    if (!updatedService) {
      return res.status(404).send('Service not found');
    }

    console.log("updatedService", updatedService);
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).send('Error updating service');
  }
});

app.delete('/steps/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpeaker = await Step.findByIdAndDelete(id);
    if (!deletedSpeaker) {
      return res.status(404).send('step not found');
    }
    console.log("Deleted step:", deletedSpeaker);
    res.json(deletedSpeaker);
  } catch (error) {
    console.error('Error deleting step:', error);
    res.status(500).send('Error deleting step');
  }
});
///////////Steps   //////////////////
app.post('/stepsStu', upload.single('image'), async (req, res) => {
  const { titleStu, descriptionStu } = req.body;
  const pictureStu = req.file.filename;

  console.log('Received request to register service:', req.body);
  console.log('service picture', pictureStu);

  try {
    const newservice = new StepStu({ titleStu, descriptionStu, pictureStu });
    await newservice.save();
    console.log('service Added successfully:', newservice);
    res.status(201).send('service registered successfully');
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});
app.get('/stepsStu', async (req, res) => {
  try {
    const steps = await StepStu.find();
    console.log("steps",steps);
    res.json(steps);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.put('/stepsStu/:id', upload.single('picture'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { titleStu: req.body.title }; // Extract only required fields

    if (req.file) {
      updates.pictureStu = req.file.filename; // Assuming you store the file path
    }

    console.log("service id", id);
    console.log("updates", updates);

    const updatedService = await StepStu.findOneAndUpdate({ _id: id }, updates, { new: true });

    if (!updatedService) {
      return res.status(404).send('Service not found');
    }

    console.log("updatedService", updatedService);
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).send('Error updating service');
  }
});

app.delete('/stepsStu/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpeaker = await StepStu.findByIdAndDelete(id);
    if (!deletedSpeaker) {
      return res.status(404).send('step not found');
    }
    console.log("Deleted step:", deletedSpeaker);
    res.json(deletedSpeaker);
  } catch (error) {
    console.error('Error deleting step:', error);
    res.status(500).send('Error deleting step');
  }
});
///////////StepsConf   //////////////////
app.post('/stepsConf', upload.single('image'), async (req, res) => {
  const { titleConf, descriptionConf } = req.body;
  const pictureConf = req.file.filename;

  console.log('Received request to register service:', req.body);
  console.log('service picture', pictureConf);

  try {
    const newservice = new StepConf({ titleConf, descriptionConf, pictureConf });
    await newservice.save();
    console.log('service Added successfully:', newservice);
    res.status(201).send('service registered successfully');
  } catch (error) {
    console.error('Error creating service:', error);
    res.status(500).send('Error creating service');
  }
});
app.get('/stepsConf', async (req, res) => {
  try {
    const steps = await StepConf.find();
    console.log("steps",steps);
    res.json(steps);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.put('/stepsConf/:id', upload.single('picture'), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { titleConf: req.body.title }; // Extract only required fields

    if (req.file) {
      updates.pictureConf = req.file.filename// Assuming you store the file path
    }

    console.log("service id", id);
    console.log("updates", updates);

    const updatedService = await StepConf.findOneAndUpdate({ _id: id }, updates, { new: true });

    if (!updatedService) {
      return res.status(404).send('Service not found');
    }

    console.log("updatedService", updatedService);
    res.json(updatedService);
  } catch (error) {
    console.error('Error updating service:', error);
    res.status(500).send('Error updating service');
  }
});

app.delete('/stepsConf/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSpeaker = await StepConf.findByIdAndDelete(id);
    if (!deletedSpeaker) {
      return res.status(404).send('step not found');
    }
    console.log("Deleted step:", deletedSpeaker);
    res.json(deletedSpeaker);
  } catch (error) {
    console.error('Error deleting step:', error);
    res.status(500).send('Error deleting step');
  }
});
///////////////////
app.post('/feedbacks', upload.single('image'), async (req, res) => {
  try {
    const { name, content } = req.body;
    const image = req.file ? req.file.filename : null;

    const newFeedback = new Feedback({ name, content, image });
    await newFeedback.save();

    res.status(201).json(newFeedback);
  } catch (error) {
    console.error('Error creating feedback:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.put('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = { displayed: true };

    console.log('Received PUT request for feedback ID:', id);
    console.log('Updates:', updates);

    const updatedFeedback = await Feedback.findByIdAndUpdate(id, updates, { new: true });

    if (!updatedFeedback) {
      return res.status(404).send('Feedback not found');
    }

    console.log('Feedback boosted successfully:', updatedFeedback);
    res.json(updatedFeedback);
  } catch (error) {
    console.error('Error updating feedback:', error);
    res.status(500).send('Error updating feedback');
  }});
app.get('/feedbacks', async (req, res) => {
  try {
    const feedbacks = await Feedback.find();
    res.status(200).json(feedbacks);
  } catch (error) {
    console.error('Error fetching feedbacks:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});
app.delete('/feedbacks/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const feedback = await Feedback.findByIdAndDelete(id);

    if (!feedback) {
      return res.status(404).send('Feedback not found');
    }

    res.status(200).send('Feedback deleted successfully');
  } catch (error) {
    console.error('Error deleting feedback:', error);
    res.status(500).send('Error deleting feedback');
  }
});
/////////// Events   ///////////////////////////////////////////////
app.post('/events', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'confParticipantsFile', maxCount: 1 }]), async (req, res) => {
  const { address,conferenceId, confTitle, confCategory, confDescription, selectedSpeakers,selectedOrganizers, location, datetimes, startTime, endTime, userEmail } = req.body;
  const confAffiche = req.files && req.files['image'] && req.files['image'][0] ? req.files['image'][0].filename : null;
  const confParticipants =  req.files && req.files['confParticipantsFile'] && req.files['confParticipantsFile'][0] ? req.files['confParticipantsFile'][0].filename : null;
  console.log('Received request to register Conference:', req.body);
  console.log('Affiche Conference:', confAffiche);
  console.log('Affiche Part:', confParticipants);
  try {
    const newEvent = new Eventt({ address,conferenceId: conferenceId, confTitle,confAffiche,confCategory, confDescription, selectedSpeakers, selectedOrganizers, confParticipants,location, datetimes, startTime, endTime, userEmail});
    await newEvent.save();

    console.log('Event Added successfully:', newEvent);
    res.status(201).send('Conference registered successfully');
  } catch (error) {
    console.error('Error creating Conference:', error);
    res.status(500).send('Error creating Conference');
  }
});
app.get('/events', async (req, res) => {
  const { status } = req.query;
  try {
    const events = await Eventt.find();
    if (status) {
      const statusArray = status.split(',');
      filteredEvents = events.filter(event => statusArray.includes(event.status));
      res.json(filteredEvents);
  }
    
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});
app.get('/events/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const event = await Eventt.findById(id);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    res.status(500).send('Error fetching event');
  }
});
////update event 
app.get('/displayedEvents', async (req, res) => {
  try {
    const displayedEvents = await Eventt.find({ displayed: true });
    res.json(displayedEvents);
  } catch (error) {
    console.error('Error fetching displayed events:', error);
    res.status(500).send('Error fetching displayed events');
  }
});
app.put('/boostEvent/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    if (!updates) {
      return res.status(400).send('No updates provided');
    }

    console.log('Received PUT request for event ID:', id);
    console.log('Updates:', updates);

    // Find the event by ID and update it
    const updatedEvent = await Eventt.findOneAndUpdate(
      { conferenceId: id },
      { $set: updates },
      { new: true }
    );

    if (!updatedEvent) {
      console.log('Event not found for ID:', id);
      return res.status(404).send('Event not found');
    }

    console.log('Event boosted successfully:', updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('Error updating event');
  }
});


app.put('/myevents/:id', upload.fields([{ name: 'image', maxCount: 1 }, { name: 'confParticipantsFile', maxCount: 1 }]), async (req, res) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Check for uploaded files and add to updates
    if (req.files && req.files['image'] && req.files['image'][0]) {
      updates.confAffiche = req.files['image'][0].filename;
    }
    if (req.files && req.files['confParticipantsFile'] && req.files['confParticipantsFile'][0]) {
      updates.confParticipants = req.files['confParticipantsFile'][0].filename;
    }

    console.log('Received PUT request for event ID:', id);
    console.log('Updates:', updates);

    // Find the event by ID and update it
    const updatedEvent = await Eventt.findOneAndUpdate({ conferenceId: id }, updates, { new: true });
    console.log('Event updated successfully:', updatedEvent);
    res.json(updatedEvent);
  } catch (error) {
    console.error('Error updating event:', error);
    res.status(500).send('Error updating event');
  }
});

app.get('/boosted-events', async (req, res) => {
  try {
    const boostedEvents = await Eventt.find({ boosted: "true" });
    res.json(boostedEvents);
  } catch (error) {
    console.error('Error fetching boosted events:', error);
    res.status(500).send('Error fetching boosted events');
  }
});

const moment = require('moment');

app.get('/upcomingEvents', async (req, res) => {
  try {
    const currentDate = new Date();  // Convert to UTC date string
    const currentWeekEndDate = moment().add(7, 'days');  // Convert to UTC date string
console.log(currentDate);
console.log(currentWeekEndDate);
const events = await Eventt.find().exec();

    // Sample code to extract datetimes from the first event
    const firstEvent = events[0];
    const datetimesArray = firstEvent.datetimes.split(',');

    // Assuming datetimes is a comma-separated string of dates
    const firstDate = datetimesArray[0]; // Get the first date from the datetimes array

    const filteredEvents = events.filter(event => {
      return event.datetimes.includes(firstDate);
    });

    res.json(filteredEvents);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});



app.get('/myevents', async (req, res) => {
  try {
    const { status, confEmail } = req.query;
    let events = [];

    if (status) {
      const statusArray = status.split(',');
      events = await Eventt.find({ userEmail: confEmail, status: { $in: statusArray } });
    } else {
      events = await Eventt.find({ userEmail: confEmail });
    }

    console.log("events", events);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});


app.get('/myevents/:id', async (req, res) => {
  try {
    const { id } = req.params;
    //const objectId = mongoose.Types.ObjectId(id);
    const events = await Eventt.find({_id:id});
    console.log("events",events);
    res.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    res.status(500).send('Error fetching events');
  }
});


// Define a route to delete a conference by ID
app.delete('/myevents/:id', async (req, res) => {
  const { id } = req.params;
  try {
    // Find the conference by ID and delete it
    const deletedConference = await Eventt.findByIdAndDelete(id);
    
    if (!deletedConference) {
      return res.status(404).send('Conference not found');
    }

    res.status(200).send('Conference deleted successfully');
  } catch (error) {
    console.error('Error deleting conference:', error);
    res.status(500).send('Error deleting conference');
  }
});
////////////////////////
const { execFile } = require('child_process');
const vision = require('@google-cloud/vision');
const clientDiploma = new vision.ImageAnnotatorClient({
  keyFilename: './public/pfe-verif-diploma.json'
});

async function analyzeImage(filePath) {
  const [result] = await clientDiploma.safeSearchDetection(filePath);
  const detections = result.safeSearchAnnotation;
  let analysisResult = 'Document appears authentic';
  if (detections.adult === 'VERY_LIKELY' || detections.spoof === 'VERY_LIKELY') {
    analysisResult = 'Document appears to be fake or manipulated';
  }
  return analysisResult;
}
///////////////////
const pythonExecutable = 'C:\\Python311\\python.exe'; // Full path to python.exe

app.post('/api/analyze-diploma', upload.single('diploma'), (req, res) => {
  const filePath = path.join(__dirname, req.file.path);
  const scriptPath = path.join(__dirname, 'analyze_ela.py'); // Full path to the Python script

  execFile(pythonExecutable, [scriptPath, filePath], (error, stdout, stderr) => {
    if (error) {
      console.error(`ExecFile error: ${error}`);
      return res.status(500).json({ error: 'Image analysis failed' });
    }

    if (stderr) {
      console.error(`Python script error: ${stderr}`);
      return res.status(500).json({ error: 'Image analysis failed' });
    }

    // Delete the uploaded file to clean up
    fs.unlink(filePath, (err) => {
      if (err) {
        console.error(`Error deleting file: ${err}`);
      }
    });

    res.json({ analysisResult: stdout.trim() });
  });
});
// Assuming 'Institute' is your Mongoose model
// Route to get all institutes
// Handle POST requests to add a new user
//////////////////conferences ////////////////////////////////////////////////////////////
app.post('/conferences', async (req, res) => {
  const { confName,confEmail,confPassword,confContact,
    organisation,organisationPref,bio,profilePic} = req.body;
  console.log('Received request to register Conference:', req.body);
  try {
    const existingConferencier = await Conference.findOne({ confEmail });
    if (existingConferencier) {
      // Email already exists, send a response indicating the failure
      console.log('Conference with this email already exists:', confEmail);
      return res.status(400).send('Conference with this email already exists');
    }
    const newConference = new Conference({ confName,confEmail,confPassword,confContact,
      organisation,organisationPref,bio,profilePic});
    await newConference.save();
    //alert('Conference registered successfully')
    console.log('Conference Account saved successfully:', newConference);
    res.status(201).send('Conference registered successfully');
  } catch (error) {
    console.error('Error creating Conference:', error);
    res.status(500).send('Error creating Conference');
  }
});
app.get('/conferences', async (req, res) => {
  try {
    const conferences = await Conference.find();
    res.json(conferences);
  } catch (error) {
    console.error('Error fetching conferences:', error);
    res.status(500).send('Error fetching Conferences');
  }
});

app.post('/loginConferencier', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await Conference.findOne({ confEmail: email });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Email not found' });
    }

    // Compare the password using bcryptjs
    const passwordMatch = await bcrypt.compare(password, user.confPassword);

    if (passwordMatch) {
      const token = jwt.sign({ userId: user._id }, secretKey, { expiresIn: '1h' });
      return res.status(200).json({ success: true, message: 'Login successful', token });
    } else {
      return res.status(401).json({ success: false, message: 'Incorrect password' });
    }

  } catch (error) {
    console.error('Error logging in conferencier:', error);
    res.status(500).json({ success: false, message: 'An error occurred. Please try again later.' });
  }
});


app.post('/institutes', async (req, res) => {
  const { universityName, instName, instAcronym, instRef, officerEmail, validatorEmail, contact, website, statusInst } = req.body;
  const universityRef = "023"; // Example static value; replace with actual logic if needed
  
  console.log('Received request to register institute:', req.body);
  try {
    const newInstitute = new Institute({
      universityName,
      universityRef,
      instName,
      instAcronym,
      instRef,
      officerEmail,
      validatorEmail,
      contact,
      website,
      status: statusInst
    });
    await newInstitute.save();
    console.log('Institute saved successfully:', newInstitute);
    res.status(201).send('Institute registered successfully');
  } catch (error) {
    console.error('Error creating Institute:', error?.message ?? error);
    res.status(500).send('Error creating Institute');
  }
});


// Handle POST requests to add a new conference
app.patch('/institutes/:instituteId', async (req, res) => {
  const { instituteId } = req.params;
  const { status } = req.body;
  console.log(`Received request to update institute status with id ${instituteId}:`, req.body);

  try {
    const institute = await Institute.findById(instituteId);
    if (!institute) {
      console.error(`Institute with id ${instituteId} not found`);
      res.status(404).send(`Institute with id ${instituteId} not found`);
      return;
    }

    institute.status = status;
    await institute.save({ timeout: 300000 });
    console.log(`Institute status updated successfully for institute with id ${instituteId}:`, institute);
    res.status(200).send(`Institute status updated successfully for institute with id ${instituteId}`);
  } catch (error) {
    console.error(`Error updating institute status with id ${instituteId}:`, error?.message ?? error);
    res.status(500).send(`Error updating institute status with id ${instituteId}`);
  }
});
// Handle POST requests to add a new conference
app.post('/universities', async (req, res) => {
  const {universityName,instName,
    instAcronym,instRef} = req.body;
  console.log('Received request to register University:', req.body);
  try {
    const newUniversity = new University({ universityName,instName,instAcronym,instRef});
    await newUniversity.save({ timeout: 300000 });
    console.log('University saved successfully:', newUniversity);
    res.status(201).send('University registered successfully');
  } catch (error) {
    console.error('Error creating University:', error);
    res.status(500).send('Error creating University');
  }
});
app.get('/universities', async (req, res) => {
  try {
    const universities = await University.find();
    res.json(universities);
  } catch (error) {
    console.error('Error fetching universities:', error);
    res.status(500).send('Error fetching universities');
  }
});

// Assuming 'Institute' is your Mongoose model
// Route to get all institutes
app.get('/institutes', async (req, res) => {
  try {
    const { status } = req.query;
    let institutes = await Institute.find();

    if (status) {
      const statusArray = status.split(',');
      institutes = institutes.filter(inst => statusArray.includes(inst.status));
    }
    
    res.json(institutes);
  } catch (error) {
    console.error('Error fetching institutes:', error);
    res.status(500).send('Error fetching institutes');
  }
});

app.put('/updateFaceFeatures/:instRef', async (req, res) => {
  const { instRef } = req.params;
  const { officerFaceFeatures, validatorFaceFeatures } = req.body;

  try {
    const update = {};
    if (officerFaceFeatures) update.officerFaceFeatures = officerFaceFeatures;
    if (validatorFaceFeatures) update.validatorFaceFeatures = validatorFaceFeatures;

    const institute = await Institute.findOneAndUpdate(
      { instRef },
      { $set: update },
      { new: true, runValidators: true }
    );

    if (!institute) {
      return res.status(404).json({ error: 'Institute not found' });
    }
    res.json(institute);
  } catch (error) {
    console.error('Error updating face features:', error);
    res.status(500).json({ error: 'Error updating face features' });
  }
});

///// loginInstitute
app.post('/loginInstitute', async (req, res) => {
  const { email, password } = req.body;
  try {
    // Check if there is a conference with the given email and password
    const institute = await Institute.findOne({ email, password });
    if (institute) {
     // alert('Login successfully ')
      return true;
    } else {
     // alert('No Registered institute Account witth those credentials please login again ! ')
      return false;
    }
  } catch (error) {
    // Handle any errors
    console.error('Error logging in institute:', error);
    return false;
  }
});

app.post('/send-email', (req, res) => {
  const { to, subject, text, html, attachments } = req.body;

  const formattedAttachments = attachments ? attachments.map(att => ({
    filename: att.filename,
    content: Buffer.from(att.content, 'base64'), // Ensure content is a Buffer
    encoding: 'base64'
  })) : [];

  sendEmail(to, subject, text, html, formattedAttachments)
    .then(() => res.send('Email sent successfully'))
    .catch(error => {
      console.error('Error sending email:', error);
      res.status(500).send('Error sending email');
    });
});


// Start the server
app.listen(port, () => {
  console.log(`connected http://localhost:${port}`);
});
