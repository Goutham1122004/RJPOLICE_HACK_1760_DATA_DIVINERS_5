import axios from 'axios';                                                                                                                   
import OpenAI from 'openai';
import { PropTypes } from 'prop-types';
import React, { Component } from 'react';
import ChatBot from 'react-simple-chatbot';
import { ThemeProvider } from 'styled-components';
import CustomOptions from './CustomOptions';
import GetCmptNo from './GetCmptNo';
import GetDept from './GetDept';
import GetStats from './GetStats';
import LocationComponent from './Map';
import PushMong from './PushMong';
import Translator from './Translator.mjs';
import ReactDOM from 'react-dom';
import "react-responsive-carousel/lib/styles/carousel.min.css"; // requires a loader
import { useState } from 'react';
// import Carousel from 'react-bootstrap/Carousel';
// import ExampleCarouselImage from './ExampleCarouselImage';
// import one from '../src/one.jpeg';
// import two from '../src/two.jpeg';
import Slider from 'react-slick';
import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
// import sam1 from '../src/sam1.jpg';
// import sam2 from '../src/sam2.avif';
import bg from './bg.jpeg';
// import { Carousel } from 'flowbite-react';


class GrievanceAssistant extends Component {

  

  
  constructor(props) {
    super(props);
    
    this.state = {
      grievance: '',
      department: 'null',
      sub: 'null',
      lang: props.lang
    };
    
    this.openai = new OpenAI({
      apiKey: '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', dangerouslyAllowBrowser: true// Your OpenAI API key
    });
  }
  
  componentWillMount(){
    const {steps} = this.props;
    const {grievance,department,othDepts} = steps;
    this.setState({grievance,department,othDepts});
  }
  
  async componentDidMount() {
    // if(type === 1){
      await this.main();
      // }
    }
    
    async main() {
      // const fs = require('fs');
      const {grievance} = this.state;
    const indian_ministries = [
      
"Agriculture and Farmers Welfare",
"Agriculture Research and Education",
"Atomic Energy",
"Ayush",
"Bio Technology",
"Central Board of Direct Taxes(Income Tax)",
"Central Board of Excise and Customs",
"Chemicals and Petrochemicals",
"Civil Aviation",
"Coal",
"Commerce",
"Consumer Affairs",
"Cooperation",
"Corporate Affairs",
"Culture",
"Defence",
"Defence Finance",
"Defence Production",
"Defence Research and Development",
"Development of North Eastern Region",
"Drinking Water and Sanitation",
"Earth Sciences",
"Economic Affairs",
"Electronics & Information Technology",
"Empowerment of Persons with Disabilities",
"Environment, Forest and Climate Change",
"Ex Servicemen Welfare",
"Expenditure",
"External Affairs",
"Fertilizers",
"Financial Services",
"Financial Services(Banking Division)",
"Financial Services(Insurance Division)",
"Fisheries",
"Food and Public Distribution",
"Food Processing Industries",
"Health & Family Welfare",
"Health Research",
"Heavy Industry",
"Higher Education",
"Home Affairs",
"Housing and Urban Affairs",
"Information and Broadcasting",
"Investment & Public Asset Management",
"Justice",
"Labour and Employment",
"Land Resources",
"Legal Affairs",
"Legislative Department",
"Micro Small and Medium Enterprises",
"Military Affairs",
"Mines",
"Minority Affairs",
"New and Renewable Energy",
"NITI Aayog",
"O/o the Comptroller & Auditor General of India",
"Official Language",
"Panchayati Raj",
"Parliamentary Affairs",
"Personnel and Training",
"Petroleum and Natural Gas",
"Pharmaceutical",
"Posts",
"Power",
"Promotion of Industry and Internal Trade",
"Public Enterprises",
"Railways, Railway Board",
"Revenue",
"Road Transport and Highways",
"Rural Development",
"School Education and Literacy",
"Science and Technology",
"Scientific & Industrial Research",
"Shipping",
"Skill Development and Entrepreneurship",
"Social Justice and Empowerment",
"Space",
"Sports",
"Staff Selection Commission",
"Statistics and Programme Implementation",
"Steel",
"Telecommunication",
"Textiles",
"Tourism",
"Tribal Affairs",
"Unique Identification Authority of India",
"Water Resources, River Development & Ganga Rejuvenation",
"Women and Child Development",
"Youth Affairs",
"Administrative Reforms and Public Grievances",
"State Governments/Others",
"Animal Husbandry, Dairying",
"National Cybercrime Threat Analytics Unit (TAU)",
"National Cybercrime Reporting Portal (www.cybercrime.gov.in)",
"Platform for Joint Cybercrime Investigation Team",
"National Cybercrime Forensic Laboratory National Cybercrime Forensic Laboratory Ecosystem",
"National Cybercrime Training Centre (NCTC) (www.cytrain.ncrb.gov.in )",
"Cybercrime Ecosystem Management Unit",
"National Cyber Crime Research and Innovation Centre",
"Enhancing National Security: TAU Unveils Advanced Threat Analytics for Cyber Defense",
"Empowering Citizens: National Cybercrime Reporting Portal Goes Live for Online Safety",
"Collaborative Cyber Defense: New Platform Unites Forces for Joint Investigations",
"Cutting-Edge Forensics: National Cybercrime Lab Ecosystem Boosts Digital Investigations",
"Building Cyber Resilience: NCTC Launches Online Training for Law Enforcement",
"Strategic Oversight: Cybercrime Ecosystem Management Unit Orchestrates Security Measures",
"Pioneering Solutions: National Cyber Crime Research Centre Drives Innovation in Cybersecurity",
  ];

  const chatCompletion = await this.openai.chat.completions.create({
    model: 'gpt-3.5-turbo',
    messages: [
      { role: 'system', content:   "You are an assistant used for classification. Output a json file that Classify the given grievances into the mentioned categories which comes under the of Ministry Of Urban And Housing Affairs (MOUAHA).The categories are 'Delay & inefficiency in construction of public places such as roads and parks','Delay in construction of Government housing projects',Public places lacking proper maintenance and timely repair also give the priority of the grievance based on its importance on the scale of 1 to 5.Example Output : {'department' : 'Ministry Of Urban And Housing Affairs', 'sub' : 'respective category related to the grievance', 'priority' : 5}"},
      { role: 'user', content: "The government had planned to finish the construction of our community park in Sivaganga by 3 weeks back on Tuesday. Yet, the construction is still on going. I request to file a grievance regarding the same and i am hoping to see a quick solution to it." },
      { role: 'assistant', content: '{"department" : "Ministry Of Urban And Housing Affairs", "sub" : "Delay & inefficiency in construction of public places such as roads and parks", "priority" : 4}'},
      { role: 'user', content: grievance.value },
    ],
  });
    const jsonans = JSON.parse(chatCompletion.choices[0].message.content);
    console.log(jsonans);
    this.setState({department: jsonans.department});
    this.setState({sub: jsonans.sub});
    // this.setState({othDepts: jsonans.relateddepartments});
    try {
      await axios.put('http://localhost:3001/gptData', jsonans);
    } catch (error) {
      console.error('Error overwriting data in JSON Server:', error);
    }
  }

  render() {
    const {lang} = this.state;
    return (
      <Translator text='Your Grievance is being Submitted...' targetLang={lang} />
    );
  }
  
  
}

GrievanceAssistant.propTypes = {
  steps: PropTypes.object,
};

GrievanceAssistant.defaultProps = {
  steps: undefined,
};

class Chatbot extends Component {

  
  componentDidMount() {
    // Load Google Translate API
    const script = document.createElement('script');
    script.src = '/script.js';
    script.async = true;
    document.head.appendChild(script);

    // Initialize Google Translate Element
    window.googleTranslateElementInit = () => {
      // Display the Google Translate dropdown
      new window.google.translate.TranslateElement({ pageLanguage: 'en' }, 'google_translate_element');

      // Set a timeout to ensure the translation dropdown is rendered
      setTimeout(() => {
        // Get the translation dropdown
        const translateDropdown = document.querySelector('.goog-te-combo');

        if (translateDropdown) {
          // Listen for changes in the translation dropdown
          translateDropdown.addEventListener('change', () => {
            this.setState({ selectedLanguage: translateDropdown.value });
          });
        }
      }, 1000); // Adjust the timeout duration if needed
    };
  }
  changeLanguage = (languageCode) => {
    const translateDropdown = document.querySelector('.goog-te-combo');
    if (translateDropdown) {
      translateDropdown.value = languageCode;
      translateDropdown.dispatchEvent(new Event('change'));
    }
  };


  
  constructor(props){
    super(props);
    this.state = {
      lang: props.language
    }
  }
  render() {
    const {lang} = this.state;
    const theme = {
      background: '#f5f8fb',
      fontFamily: 'Arial, sans-serif',
      headerBgColor: '#197B22',
      headerFontColor: '#fff',
      headerFontSize: '18px',
      botBubbleColor: '#0F3789',
      botFontColor: '#fff',
      userBubbleColor: '#fff',
      userFontColor: '#4a4a4a',
    };

    const config = {
      floating: true,
      width: '500px',
    };
    const settings = {
      dots: true,
      infinite: true,
      speed: 500,
      slidesToShow: 1,
      slidesToScroll: 1,
    };




    
    return (
      <>

    <div id="google_translate_element" style={{ marginRight: '15%', height: '1%' }}></div>

      <div className='bg-green-900'>
      <div class="navbar">
      <a href="#home">Home</a>
      <a href="#about">Dashboard</a>
      <a href="#services">Newsletters</a>
      <a href="#contact">Services</a>
      </div>
    </div>
    


{/* <div class="mx-auto max-w-7xl py-12 sm:px-6 sm:py-32 lg:px-3"> */}
    <div class="relative isolate overflow-hidden bg-green-900 px-6 pt-12 shadow-2xl  sm:px-16 md:pt-24 lg:flex lg:gap-x-20 lg:px-24 lg:pt-0">
      <svg viewBox="0 0 1024 1024" class="absolute left-1/2 top-1/2 -z-10 h-[64rem] w-[64rem] -translate-y-1/2 [mask-image:radial-gradient(closest-side,white,transparent)] sm:left-full sm:-ml-80 lg:left-1/2 lg:ml-0 lg:-translate-x-1/2 lg:translate-y-0" aria-hidden="true">
        <circle cx="512" cy="512" r="512" fill="url(#759c1415-0410-454c-8f7c-9a820de03641)" fill-opacity="0.7" />
        <defs>
          <radialGradient id="759c1415-0410-454c-8f7c-9a820de03641">
            <stop stop-color="#7775D6" />
            <stop offset="1" stop-color="#E935C1" />
          </radialGradient>
        </defs>
      </svg>
      <div class="mx-auto max-w-md text-center lg:mx-0 lg:flex-auto lg:py-32 lg:text-left">
        <h2 class="text-3xl font-bold tracking-tight text-white sm:text-4xl">Welcome to<br/>Rajasthan Police Official Website.</h2>
        <p class="mt-6 text-lg leading-8 text-gray-300">Safely lodge and track your grievances with our newly created Vishu bot.</p>
        <div class="mt-10 flex items-center justify-center gap-x-6 lg:justify-start">
          <a href="#" class="rounded-md bg-white px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm hover:bg-gray-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white">Get started</a>
          <a href="#" class="text-sm font-semibold leading-6 text-white">Stay Tuned for more <span aria-hidden="true">→</span></a>
      <br/><br/><br/><br/><br/><br/>
        </div>
      </div>
      <div class="relative mt-16 h-80 lg:mt-8">
        <img class="absolute left-0 top-0 w-[57rem] max-w-none rounded-md bg-white/5 ring-1 ring-white/10" src={bg} alt="App screenshot" width="1824" height="1080"/>
      </div>
    </div>
  {/* </div> */}

  <div class="bg-white py-24 sm:py-32">
  <div class="mx-auto max-w-7xl px-6 lg:px-8">
    <div class="mx-auto max-w-2xl lg:text-center">
      <h2 class="text-base font-semibold leading-7 text-indigo-600">RACCAM</h2>
      <h2 class="text-base font-semibold leading-7 text-indigo-600">Rajasthan Police Cyber Crime Awareness mission</h2>
      <p class="mt-2 text-3xl font-bold tracking-tight text-gray-900 sm:text-4xl">Everything under a centralized system</p>
      <p class="mt-6 text-lg leading-8 text-gray-600">Quis tellus eget adipiscing convallis sit sit eget aliquet quis. Suspendisse eget egestas a elementum pulvinar et feugiat blandit at. In mi viverra elit nunc.</p>
    </div>
    <div class="mx-auto mt-16 max-w-2xl sm:mt-20 lg:mt-24 lg:max-w-4xl">
      <dl class="grid max-w-xl grid-cols-1 gap-x-8 gap-y-10 lg:max-w-none lg:grid-cols-2 lg:gap-y-16">
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
              </svg>
            </div>
            Recursive DNS Server
                      </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">Morbi viverra dui mi arcu sed. Tellus semper adipiscing suspendisse semper morbi. Odio urna massa nunc massa.</dd>
        </div>
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
            </div>
            SSL certificates
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">Sit quis amet rutrum tellus ullamcorper ultricies libero dolor eget. Sem sodales gravida quam turpis enim lacus amet.</dd>
        </div>
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182m0-4.991v4.99" />
              </svg>
            </div>
            Schema Specific Resolvers
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">Quisque est vel vulputate cursus. Risus proin diam nunc commodo. Lobortis auctor congue commodo diam neque.</dd>
        </div>
        <div class="relative pl-16">
          <dt class="text-base font-semibold leading-7 text-gray-900">
            <div class="absolute left-0 top-0 flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-600">
              <svg class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M7.864 4.243A7.5 7.5 0 0119.5 10.5c0 2.92-.556 5.709-1.568 8.268M5.742 6.364A7.465 7.465 0 004.5 10.5a7.464 7.464 0 01-1.15 3.993m1.989 3.559A11.209 11.209 0 008.25 10.5a3.75 3.75 0 117.5 0c0 .527-.021 1.049-.064 1.565M12 10.5a14.94 14.94 0 01-3.6 9.75m6.633-4.596a18.666 18.666 0 01-2.485 5.33" />
              </svg>
            </div>
            Advanced security
          </dt>
          <dd class="mt-2 text-base leading-7 text-gray-600">Arcu egestas dolor vel iaculis in ipsum mauris. Tincidunt mattis aliquet hac quis. Id hac maecenas ac donec pharetra eget.</dd>
        </div>
      </dl>
    </div>
  </div>
</div>


  <ThemeProvider theme={theme}>
          <ChatBot
            recognitionEnable={true}
            recognitionLang={lang}
            speechSynthesis={{ enable: true, lang: { lang } }}
            headerTitle="GrievanceAlly - VISHU"
            steps={[
              {
                id: 'start',
                component: <CustomOptions lang={lang} options={[
                  { value: 1, label: 'Start Conversation', trigger: '0' }
                ]} />,
                asMessage: true,
              },
              {
                id: '0',
                component: <Translator text='Hi!! I am VISHU.. - Grievance Chatbot. I am here to help you.' targetLang={lang} />,
                asMessage: true,
                trigger: '1'
              },
              {
                id: '1',
                component: <Translator text='Select any one of The below Services' targetLang={lang} />,
                asMessage: true,
                trigger: '2',
              },
              {
                id: '2',
                component: <CustomOptions lang={lang} options={[
                  { value: 1, label: 'Lodge Grievance', trigger: '4' },
                  { value: 2, label: 'Check Grievance Status', trigger: 'status' },
                  { value: 3, label: 'Grievance Reappeal', trigger: 'reapp' },
                  { value: 5, label: 'Rerouted Grievance Enquiry', trigger: 'rert' },
                ]} />,
                asMessage: true
              },
              {
                id: '4',
                component: <Translator text='Tell me your Grievance ' targetLang={lang} />,
                asMessage: true,
                trigger: 'grievance'
              }, {
                id: 'grievance',
                user: true,
                trigger: 'callapi'
              },
              {
                id: 'callapi',
                component: <GrievanceAssistant lang={lang} />,
                asMessage: true,
                trigger: 'getdept'
              }, {
                delay: 4000,
                id: 'getdept',
                component: <GetDept lang={lang} />,
                asMessage: true,
                trigger: '6'
              },
              {
                id: '6',
                component: <Translator text='Thank you for giving your grievance' targetLang={lang} />,
                asMessage: true,
                trigger: '13'
              }, {
                id: '13',
                component: <Translator text='Confirm submitting the grievance ?' targetLang={lang} />,
                asMessage: true,
                trigger: '17'
              }, {
                id: '17',
                component: <CustomOptions lang={lang} options={[
                  { value: 1, label: 'Confirm', trigger: 'loc' },
                  { value: 2, label: 'Cancel', trigger: '1' },
                ]} />,
                asMessage: true,
              },
              {
                id: 'loc',
                component: <LocationComponent />,
                asMessage: true,
                trigger: '18'
              },
              {
                id: '18',
                component: <PushMong lang={lang} />,
                asMessage: true,
                trigger: '26'
              },
              {
                id: '26',
                component: <Translator text='You can use this reference number to track the progress of your grievance' targetLang={lang} />,
                asMessage: true,
                trigger: '1'
              },
               {
                id: 'status',
                component: <Translator text='Choose the complaint number' targetLang={lang} />,
                asMessage: true,
                trigger: 'statoptions'
              },
              {
                id: 'statoptions',
                component: <GetCmptNo lang={lang} />,
                asMessage: true,
              },
              {
                id: 'statdet',
                component: <GetStats lang={lang} />,
                asMessage: true,
                trigger: 'stat'
              },
              {
                id: 'stat',
                component: <Translator text='Do you want to check the status of another grievance:' targetLang={lang} />,
                asMessage: true,
                trigger: 'statop'
              },
              {
                id: 'statop',
                component: <CustomOptions lang={lang} options={[
                  { value: 1, label: 'Yes', trigger: 'status' },
                  { value: 2, label: 'No', trigger: '1' },
                ]} />,
                asMessage: true,
              },
              {
                id: 'reapp',
                component: <Translator text='Enter the rejected complaint number that you want to reappeal' targetLang={lang} />,
                asMessage: true,
                trigger: 'reapp1'
              },
              {
                id: 'reapp1',
                user: true,
                trigger: 'reapp2'
              },
              {
                id: 'reapp2',
                component: <Translator text='Summary' targetLang={lang} />,
                asMessage: true,
                trigger: 'reapp3'
              },
              {
                id: 'reapp3',
                component: <Translator text='Do you want to reappeal the above grievance:' targetLang={lang} />,
                asMessage: true,
                trigger: 'reapp4'
              },
              {
                id: 'reapp4',
                component: <CustomOptions lang={lang} options={[
                  { value: 1, label: 'Yes', trigger: 'reappyes' },
                  { value: 2, label: 'No', trigger: 'reappno' },
                ]} />,
                asMessage: true,
              },
              {
                id: 'reappyes',
                message: "Logic for reappealing",
                // component: <Translator text = 'Enter the Aadhar Number' targetLang = {lang}/>,
                // asMessage: true,
                trigger: 'reappy1'
              },
              {
                id: 'reappy1',
                component: <Translator text='The grievance has been successfully reappealed' targetLang={lang} />,
                asMessage: true,
                trigger: '1'
              },
              {
                id: 'reappno',
                component: <Translator text='The grievance is not reappealed' targetLang={lang} />,
                asMessage: true,
                trigger: '1'
              },
              {
                id: 'rert',
                component: <Translator text='Enter the reroute Id' targetLang={lang} />,
                asMessage: true,
                trigger: 'rert1'
              },
              {
                id: 'rert1',
                user: true,
                trigger: 'rert2'
              },
              {
                id: 'rert2',
                message: "Display the rerouting summary",
                // component: <Translator text = 'Enter the Aadhar Number' targetLang = {lang}/>,
                // asMessage: true,
                trigger: '1'
              }
            ]}
            {...config} />
        </ThemeProvider></>
    );
  }
}

export default Chatbot;