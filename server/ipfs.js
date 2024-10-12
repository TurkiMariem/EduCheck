const axioss=require('axios');
const { Readable } = require('stream');
const FormData = require('form-data');
const fs = require('fs');
function bufferToStream(buffer) {
  const stream = new Readable();
  stream.push(buffer);
  stream.push(null);
  return stream;
}
async function uploadFileToIPFS(filePath, filename) {
  try {
    const buffer = fs.readFileSync(filePath); // Read the file from disk
    const formData = new FormData();
    const fileStream = bufferToStream(buffer); // Convert buffer to readable stream
    formData.append('file', fileStream, filename); // Append the stream with the original filename

    const url = "http://localhost:5001/api/v0/add"; // URL of your local IPFS node's API endpoint
    const options = {
      headers: formData.getHeaders() // Use formData.getHeaders() to set the content type header
    };

    const res = await axioss.post(url, formData, options);
    return res.data.Hash; // Return the IPFS hash of the uploaded file
  } catch (error) {
    console.error('Error uploading file to IPFS:', error);
    throw error;
  }
}

 function getFileUrlFromIPFS(hash) {
  const ipfsGatewayUrl = "http://localhost:8080/ipfs"; // Local IPFS gateway URL
  return `${ipfsGatewayUrl}/${hash}`; // Construct the URL by appending the hash to the local IPFS gateway URL
}

module.exports = {
  uploadFileToIPFS,
  getFileUrlFromIPFS
};


/**
 * "HTTPHeaders": {
    "Access-Control-Allow-Origin": ["*"],
    "Access-Control-Allow-Methods": ["PUT", "POST", "GET"],
    "Access-Control-Allow-Headers": ["Authorization"]
  }
 */



