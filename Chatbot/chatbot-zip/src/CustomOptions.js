import React, { useEffect, useState } from 'react';
import translate from 'translate';
import "./btn.css";

const CustomOptions = ({ lang, options, triggerNextStep }) => {
  const [translatedOptions, setTranslatedOptions] = useState([]);

  useEffect(() => {
    // Function to translate the options
    const translateOptions = async () => {

      const translatedOptions = await Promise.all(
        options.map(async (option) => {
          const translatedText = await translate(option.label, { to: lang }); // Use the 'lang' parameter directly
          return { ...option, translatedLabel: translatedText };
        })
      );

      setTranslatedOptions(translatedOptions);
    };

    translateOptions();
  }, [lang,options]);
  return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center',gap:'0.4em' }}>
      {translatedOptions.map((option, index) => (
        <button key={index} onClick={() => {
          triggerNextStep({ value: option.value, trigger: option.trigger });
        }}>
          {option.translatedLabel}
        </button>
      ))}
    </div>
  );
};

export default CustomOptions;
