import React, { useState, useEffect } from 'react';
import axios from 'axios';

function JsonReader() {
  const [jsonData, setJsonData] = useState(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await axios.get('address.json'); // Replace with the actual path to your JSON file
        setJsonData(response.data);
      } catch (error) {
        console.error('Error fetching JSON data:', error);
      }
    }

    fetchData();
  }, []);

  if (!jsonData) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>JSON Data</h1>
      <ul>
        {jsonData.map(item => (
          <li key={item.id}>{item.name}</li>
        ))}
      </ul>
    </div>
  );
  
}

export default JsonReader;
