import React from 'react';
import translate from 'translate';

class Translator extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      translatedText: '',
    };
    this.text = props.text;
    this.targetLang = props.targetLang;
  }

  async translateText() {
    const translatedText = await translate(this.text, { to: this.targetLang });
    this.setState({ translatedText });

    const msg = new window.SpeechSynthesisUtterance();
    msg.text = translatedText;
    msg.lang = this.targetLang;
    window.speechSynthesis.speak(msg);
  }

  componentDidMount() {
    this.translateText();
  }

  render() {
    return (
      <div>
        {this.state.translatedText}
      </div>
    );
  }
}

export default Translator;