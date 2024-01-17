import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Translator from './Translator'; // Make sure to import the Translator component

function GetDept(props) {
  const [departmentData, setDepartmentData] = useState(null);

  useEffect(() => {
    async function fetchDepartmentData() {
      try {
        const response = await axios.get('http://localhost:3001/gptData');
        setDepartmentData(response.data);
      } catch (error) {
        console.error('Error fetching department data:', error);
      }
    }

    fetchDepartmentData();
  }, []);

  // Check if departmentData is defined before accessing its properties
  const departmentName = departmentData?.department;
  const sub = departmentData?.sub;

  return (
    <div>
      {departmentName ? (
        <Translator text={`Your grievance has been submitted to the department of ${departmentName} under the category of ${sub}`} targetLang={props.lang} />
      ) : (
        <p>Loading department data...</p>
      )}
    </div>
  );
}

export default GetDept;
