import axios from 'axios';
import React, { useEffect, useState } from 'react';
import Translator from './Translator.mjs';

export default function PushMong(props) {
    const[cn,scn]=useState('');
    const [useEffectCompleted, setUseEffectCompleted] = useState(false);
    const ind_mins = [
        {"id": "AF", "name": "Agriculture and Farmers Welfare"},
        {"id": "AH", "name": "Animal Husbandry, Dairying"},
        {"id": "AR", "name": "Agriculture Research and Education"},
        {"id": "AP", "name": "Administrative Reforms and Public Grievances"},
        {"id": "AT", "name": "Atomic Energy"},
        {"id": "AY", "name": "Ayush"},
        {"id": "BT", "name": "Bio Technology"},
        {"id": "CD", "name": "Central Board of Direct Taxes(Income Tax)"},
        {"id": "CE", "name": "Central Board of Excise and Customs"},
        {"id": "CP", "name": "Chemicals and Petrochemicals"},
        {"id": "CA", "name": "Civil Aviation"},
        {"id": "CL", "name": "Coal"},
        {"id": "CM", "name": "Commerce"},
        {"id": "CA", "name": "Consumer Affairs"},
        {"id": "CO", "name": "Cooperation"},
        {"id": "CR", "name": "Corporate Affairs"},
        {"id": "CU", "name": "Culture"},
        {"id": "DE", "name": "Defence"},
        {"id": "DF", "name": "Defence Finance"},
        {"id": "DP", "name": "Defence Production"},
        {"id": "DR", "name": "Defence Research and Development"},
        {"id": "DN", "name": "Development of North Eastern Region"},
        {"id": "DW", "name": "Drinking Water and Sanitation"},
        {"id": "ES", "name": "Earth Sciences"},
        {"id": "EA", "name": "Economic Affairs"},
        {"id": "EI", "name": "Electronics & Information Technology"},
        {"id": "EP", "name": "Empowerment of Persons with Disabilities"},
        {"id": "EF", "name": "Environment, Forest and Climate Change"},
        {"id": "EW", "name": "Ex Servicemen Welfare"},
        {"id": "EX", "name": "Expenditure"},
        {"id": "ET", "name": "External Affairs"},
        {"id": "FE", "name": "Fertilizers"},
        {"id": "FS", "name": "Financial Services"},
        {"id": "FB", "name": "Financial Services(Banking Division)"},
        {"id": "FI", "name": "Fisheries"},
        {"id": "FD", "name": "Food and Public Distribution"},
        {"id": "FP", "name": "Food Processing Industries"},
        {"id": "HF", "name": "Health & Family Welfare"},
        {"id": "HR", "name": "Health Research"},
        {"id": "HI", "name": "Heavy Industry"},
        {"id": "HE", "name": "Higher Education"},
        {"id": "HA", "name": "Home Affairs"},
        {"id": "HU", "name": "Housing and Urban Affairs"},
        {"id": "IB", "name": "Information and Broadcasting"},
        {"id": "IP", "name": "Investment & Public Asset Management"},
        {"id": "JU", "name": "Justice"},
        {"id": "LE", "name": "Labour and Employment"},
        {"id": "LR", "name": "Land Resources"},
        {"id": "LA", "name": "Legal Affairs"},
        {"id": "LD", "name": "Legislative Department"},
        {"id": "MM", "name": "Micro Small and Medium Enterprises"},
        {"id": "MF", "name": "Military Affairs"},
        {"id": "MI", "name": "Mines"},
        {"id": "MA", "name": "Minority Affairs"},
        {"id": "NE", "name": "New and Renewable Energy"},
        {"id": "NA", "name": "NITI Aayog"},
        {"id": "CI", "name": "O/o the Comptroller & Auditor General of India"},
        {"id": "OL", "name": "Official Language"},
        {"id": "PR", "name": "Panchayati Raj"},
        {"id": "PA", "name": "Parliamentary Affairs"},
        {"id": "PT", "name": "Personnel and Training"},
        {"id": "PG", "name": "Petroleum and Natural Gas"},
        {"id": "PH", "name": "Pharmaceutical"},
        {"id": "PO", "name": "Posts"},
        {"id": "PW", "name": "Power"},
        {"id": "PI", "name": "Promotion of Industry and Internal Trade"},
        {"id": "PE", "name": "Public Enterprises"},
        {"id": "RA", "name": "Railways, Railway Board"},
        {"id": "RE", "name": "Revenue"},
        {"id": "RT", "name": "Road Transport and Highways"},
        {"id": "RD", "name": "Rural Development"},
        {"id": "SE", "name": "School Education and Literacy"},
        {"id": "ST", "name": "Science and Technology"},
        {"id": "SI", "name": "Scientific & Industrial Research"},
        {"id": "SH", "name": "Shipping"},
        {"id": "SD", "name": "Skill Development and Entrepreneurship"},
        {"id": "SG", "name": "State Governments/Others"},
        {"id": "SJ", "name": "Social Justice and Empowerment"},
        {"id": "SP", "name": "Space"},
        {"id": "SS", "name": "Sports"},
        {"id": "SC", "name": "Staff Selection Commission"},
        {"id": "SA", "name": "Statistics and Programme Implementation"},
        {"id": "ST", "name": "Steel"},
        {"id": "TE", "name": "Telecommunication"},
        {"id": "TX", "name": "Textiles"},
        {"id": "TO", "name": "Tourism"},
        {"id": "TR", "name": "Tribal Affairs"},
        {"id": "UI", "name": "Unique Identification Authority of India"},
        {"id": "WR", "name": "Water Resources, River Development & Ganga Rejuvenation"},
        {"id": "WC", "name": "Women and Child Development"},
        {"id": "YA", "name": "Youth Affairs"}
    ];

    const states = [
        {"id": "AP", "name": "Andhra Pradesh"},
        {"id": "AR", "name": "Arunachal Pradesh"},
        {"id": "AS", "name": "Assam"},
        {"id": "BR", "name": "Bihar"},
        {"id": "CG", "name": "Chhattisgarh"},
        {"id": "GA", "name": "Goa"},
        {"id": "GJ", "name": "Gujarat"},
        {"id": "HR", "name": "Haryana"},
        {"id": "HP", "name": "Himachal Pradesh"},
        {"id": "JH", "name": "Jharkhand"},
        {"id": "KA", "name": "Karnataka"},
        {"id": "KL", "name": "Kerala"},
        {"id": "MP", "name": "Madhya Pradesh"},
        {"id": "MH", "name": "Maharashtra"},
        {"id": "MN", "name": "Manipur"},
        {"id": "ML", "name": "Meghalaya"},
        {"id": "MZ", "name": "Mizoram"},
        {"id": "NL", "name": "Nagaland"},
        {"id": "OD", "name": "Odisha"},
        {"id": "PB", "name": "Punjab"},
        {"id": "RJ", "name": "Rajasthan"},
        {"id": "SK", "name": "Sikkim"},
        {"id": "TN", "name": "Tamil Nadu"},
        {"id": "TS", "name": "Telangana"},
        {"id": "TR", "name": "Tripura"},
        {"id": "UP", "name": "Uttar Pradesh"},
        {"id": "UK", "name": "Uttarakhand"},
        {"id": "WB", "name": "West Bengal"}
    ];
    useEffect(() => {
        const fetchData = async () => {
          try {
            const response = await axios.get('http://localhost:3001/uniquecmno');
            const currentCompNo = response.data[0].CompNo;
            const newCompNo = currentCompNo + 1;
            await axios.put('http://localhost:3001/uniquecmno/1', { CompNo: newCompNo });
            const res = await axios.get('http://localhost:3001/gptData');
            console.log(res.data.department)
            const r = await axios.get(`http://localhost:5000/chatbotuser/${2}`)
            const t = r.data[0];
            console.log(t);
            function getIdFromName(name) {
                const state = states.find((state) => state.name.toLowerCase() === name.toLowerCase());
                return "TN";
            }
            function getIdFromDept(name) {
                const dept = ind_mins.find((dept) => dept.name.toLowerCase() === name.toLowerCase());
                return 'HU';
            }
            const CNo = getIdFromName(t.state) + getIdFromDept(res.data.department) + "624001" + String(newCompNo);
            scn(CNo);
            await axios.put('http://localhost:3001/uniquecmno/1', { CompNo: newCompNo, ActNo: CNo });
            console.log(newCompNo);
            
            const formData = {
              userid: 2,
              name: "Maginesh",
              gender: "Male",
              country: "India",
              state: "Tamilnadu",
              district: "Coimbatore",
              address: "SKCET,kuniyamuthur",
              locality: "Kuniyamuthur",
              pincode: "641008",
              email: "727722eucs097@skcet.ac.in",
              mobile: "7667792123",
              minstate: "",
              refno: "",
              refdate: "",
              department: res.data.department,
              complaintNo: CNo,
              priority: res.data.priority,
              grievance: res.data.sub,
              // ... other form data
              Attach: '',
            };
    // 
            // const notify = /* set notify value */;
            
            try {
              const submitResponse = await axios.post('http://localhost:5000/submit', formData);
              console.log(submitResponse.data);
        } catch (error) {
              console.error('Error submitting grievance:', error);
            }
            setUseEffectCompleted(true);
          } catch (error) {
            console.error('Error fetching uniquecmno:', error);
          }
        };
        fetchData();
      }, []);

  return (
    <div>
      {useEffectCompleted && (
        <Translator text={`Thank You.Your complaint number is ${cn}`} targetLang={props.lang} />
      )}
    </div>
  )
}
