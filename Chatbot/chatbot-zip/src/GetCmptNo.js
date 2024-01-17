import axios from 'axios';
import React, { useEffect, useState } from 'react';

function GetCmptNo({triggerNextStep}) {
    const [l,sl] = useState([]);
  useEffect(() => {
    async function fetchCNo() {
      try {
        const response = await axios.get(`http://localhost:5000/chatbotstatus/${2}`);
        sl(response.data);
      } catch (error) {
        console.error('Error fetching CNo.:', error);
      }
    }

    fetchCNo();
  }, []);

  const handleChange = async (option) =>{
    const response = await axios.get('http://localhost:3001/uniquecmno');
    const t = response.data[0];
    await axios.put('http://localhost:3001/uniquecmno/1',{CompNo: t.CompNo,ActNo: t.ActNo,StatNo: option.option});
    triggerNextStep({ value: 'retrieve_status', trigger: 'statdet' });
  }

  return (
    <div style={{display:'flex',flexDirection:'column',gap:'0.4em'}}>
      {l.map((option, index) => (
        <button key={index} onClick={() => {
            handleChange({option});
        }}>
          {option}
        </button>
      ))}
    </div>
  );
}

export default GetCmptNo;