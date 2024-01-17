import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Translator from './Translator.mjs';

export default function GetStats(props) {
    const [stat,setStat] = useState('');
    const [cno,scno] = useState('');
    const [got,setGot] = useState(false);
    useEffect(() => {
        async function fetchCnoData() {
          try {
            const response = await axios.get('http://localhost:3001/uniquecmno');
            scno(response.data[0].StatNo);
            const res = await axios.get(`http://localhost:5000/cnostatus/${response.data[0].StatNo}`);
            setStat(res.data[0].status)
            setGot(true);
            // setDepartmentData(response.data);
          } catch (error) {
            console.error('Error fetching department data:', error);
          }
        }
        fetchCnoData();
      }, []);
  return (
    <div>
      {got && (
        <Translator text={`The status of your ${cno} is  ${stat}. Check your dashboard for further details.`} targetLang={props.lang} />
      )}
    </div>
  )
}
