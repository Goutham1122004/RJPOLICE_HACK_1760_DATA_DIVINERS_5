import axios from 'axios';
import React, { useCallback, useEffect, useState } from 'react';
import translate from 'translate';
import Translator from './Translator.mjs';
import "./btn.css";

function OtherDepts({ lang, triggerNextStep }) {
    const [data, setData] = useState([]);
    const [translatedData, setTranslatedData] = useState([]);

    const translateDepartments = useCallback(async () => {
        try {
            const translations = await Promise.all(
                data.map(async (dept) => await translate(dept, { from: 'en', to: lang }))
            );
            setTranslatedData(translations);
        } catch (error) {
            console.error('Error translating departments:', error);
        }
    }, [data, lang]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get('http://localhost:3001/gptData');
                setData(response.data.relateddepartments);
            } catch (error) {
                console.error('Error fetching data from JSON Server:', error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        if (data.length > 0) {
            translateDepartments();
        }
    }, [data, lang, translateDepartments]);
    
    const handleChange = async (dept) => {
        const response = await axios.get('http://localhost:3001/gptData');
        triggerNextStep({ value: 'translaed_dept', trigger: '14' });
        await axios.post('http://localhost:3001/gptData', {department: dept ,summary: response.data.summary,priority: response.data.priority,relateddepartments: response.data.relateddepartments})
    };
    return (
        <div>
            {translatedData.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    {translatedData.map((translatedDept, index) => (
                        <button key={index} onClick={() => handleChange(translatedDept)}>
                            {translatedDept}
                        </button>
                    ))}
                </div>
            ) : (
                <Translator text='No other Departments are related to your Grievance' targetLang={lang}/>
            )}
        </div>
    );
}

export default OtherDepts;
