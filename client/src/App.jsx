import React, { useState, useEffect } from 'react';
import './App.css';
import 'regenerator-runtime/runtime';
import useClipboard from 'react-use-clipboard';
import axios from "axios";
import {useSpeechSynthesis} from 'react-speech-kit'
import SpeechRecognition, { useSpeechRecognition } from 'react-speech-recognition';

const App = () => {
  const [coping, setCoping] = useState('');
  const [isCopied, setCopied] = useClipboard(coping);
  const [text, setText] = useState("");
  const [summary, setSummary] = useState("");
  const { transcript, browserSupportsSpeechRecognition } = useSpeechRecognition();

  const {speak} = useSpeechSynthesis()

  useEffect(() => {
    setCoping(transcript);
  }, [transcript]);

  const startnow = () =>
    SpeechRecognition.startListening({ continuous: true, language: 'en-US' });

  if (!browserSupportsSpeechRecognition) {
    return null;
  }


  const sendTextToBackend = async () => {
    // Replace the spoken word "dot" with a period (.) in the transcript
    const processedTranscript = transcript.replace(/dot/gi, '.');
  
    // Replace the spoken word "comma" with a comma (,) in the processed transcript
    const finalTranscript = processedTranscript.replace(/comma/gi, ',');
  
    try {
      // send a POST request to the backend with the final transcript
      const response = await axios.post("http://localhost:3002/summarize", {
        text: finalTranscript,
      });
  
      // extract the summary from the response object
      const extractedSummary = response.data.summary.extractive.join("\n");
  
      // set the summary based on the extracted summary
      setSummary(extractedSummary);
      setText(extractedSummary);
    } catch (error) {
      // handle errors
      console.error(error);
      setSummary("Failed to summarize text");
    }
  };
  

  const handleclick = () => {
    speak({text:text})
      }
    
  return (
    <>
      <div className="container">
        <h2>Speech to Text Converter</h2>
        <br />
        <p>
          A React hook that converts speech from the microphone to text and makes it available to your React components.
        </p>

        <div className="main-content" onClick={setCopied}>
          {transcript}
        </div>

        <div className="btn-style">
          <button onClick={startnow}>Start Listening</button>
          <button onClick={SpeechRecognition.stopListening}>Stop Listening</button>
          <button onClick={setCopied}>
            Was it copied? {isCopied ? 'Yes! 👍' : 'Nope! 👎'}
          </button>
          <button onClick={sendTextToBackend}>Summarize</button>
        </div>

        {summary && (
          <div className="summary">
            <h3>Summary:</h3>
            <p>{summary}</p>
          </div>
        )}
      </div>
      <button className='clickme' onClick={()=>handleclick()}>click</button>
    </>
  );
};

export default App;