
import axios from "axios";

export const sendDiplomaEmail = async (to, subject, text, html, attachments) => {
    console.log("hello from sendDiplomaEmail", to, subject, text, html, attachments);
  
    let base64Attachments = [];
    if (attachments) {
      const attachmentPromises = attachments.map(async (attachment) => {
        const response = await fetch(attachment.path);
        const blob = await response.blob();
        const reader = new FileReader();
  
        return new Promise((resolve, reject) => {
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const base64data = reader.result.split(',')[1]; // Get base64 content without the prefix
            resolve({
              filename: attachment.filename,
              content: base64data,
              encoding: 'base64'
            });
          };
          reader.onerror = reject;
        });
      });
  
      base64Attachments = await Promise.all(attachmentPromises);
    }
  
    const data = {
      to,
      subject,
      text,
      html,
      attachments: base64Attachments
    };
  
    try {
      const response = await axios.post('http://localhost:5000/send-email', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log(response.data);
    } catch (error) {
      console.error('There was an error sending the email!', error);
    }
  };


