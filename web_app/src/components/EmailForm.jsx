import axios from 'axios';

async function EmailForm (emailData) {
    const formData = new FormData();
    formData.append('to', emailData.to);
    formData.append('subject', emailData.subject);
    formData.append('text', emailData.text);
    formData.append('attachmentPath', emailData.attachment);
    try {
      await axios.post('http://localhost:5000/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Email sent successfully');
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    }
};

export default EmailForm;
