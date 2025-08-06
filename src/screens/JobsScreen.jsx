import React, { useEffect, useRef, useState } from 'react';
import Modal from '@/components/Modal';

const JobScreen = () => {
  const [inputValue, setInputValue] = useState('');
  const [output, setOutput] = useState('');
  const [files, setFiles] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentFile, setCurrentFile] = useState('');
  const textareaRef = useRef(null);

  useEffect(() => {
    textareaRef.current.focus();
  }, []);

  const handleInput = (e) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleCommand(inputValue);
      setInputValue('');
    }
  };

  const handleCommand = (command) => {
    setOutput((prevOutput) => prevOutput + `> ${command}\n`);
    const [cmd, ...args] = command.split(' ');

    switch (cmd) {
      case 'touch':
        createFile(args.join(' '));
        break;
      case 'ls':
        listFiles();
        break;
      case 'cat':
        readFile(args.join(' '));
        break;
      case 'vi':
        openVi(args.join(' '));
        break;
      default:
        setOutput((prevOutput) => prevOutput + `Unknown command: ${command}\n`);
    }
  };

  const createFile = (filename) => {
    if (filename) {
      const prefixedFilename = `src/files/${filename}`;
      setFiles((prevFiles) => ({ ...prevFiles, [prefixedFilename]: '' }));
      setOutput((prevOutput) => prevOutput + `File created: ${prefixedFilename}\n`);
    } else {
      setOutput((prevOutput) => prevOutput + `Usage: touch <filename>\n`);
    }
  };

  const listFiles = () => {
    const fileList = Object.keys(files).length ? Object.keys(files).join('\n') : 'No files found.';
    setOutput((prevOutput) => prevOutput + `Files:\n${fileList}\n`);
  };

  const readFile = (filename) => {
    const prefixedFilename = `src/files/${filename}`;
    if (files[prefixedFilename] !== undefined) {
      setOutput((prevOutput) => prevOutput + `Contents of ${prefixedFilename}:\n${files[prefixedFilename]}\n`);
    } else {
      setOutput((prevOutput) => prevOutput + `File not found: ${prefixedFilename}\n`);
    }
  };

  const openVi = (filename) => {
    const prefixedFilename = `src/files/${filename}`;
    if (files[prefixedFilename] !== undefined) {
      setCurrentFile(prefixedFilename);
      setIsModalOpen(true);
    } else {
      setOutput((prevOutput) => prevOutput + `File not found: ${prefixedFilename}\n`);
    }
  };

  const handleSave = (newContent) => {
    setFiles((prevFiles) => ({ ...prevFiles, [currentFile]: newContent }));
    setOutput((prevOutput) => prevOutput + `Saved changes to ${currentFile}.\n`);
  };

  const terminalStyle = {
    width: '100%',
    height: '80vh',
    border: '1px solid black',
    backgroundColor: '#000',
    color: '#fff',
    fontFamily: 'monospace',
    padding: '10px',
    overflowY: 'scroll',
    whiteSpace: 'pre',
  };

  return (
    <div className='my-5'>
      <div style={terminalStyle}>
        <div style={{ whiteSpace: 'pre-wrap', color: '#fff' }}>{output}</div>
        <textarea
          ref={textareaRef}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          onKeyDown={handleInput}
          style={{
            width: '100%',
            height: '30px',
            backgroundColor: '#000',
            color: '#fff',
            border: 'none',
            outline: 'none',
            fontFamily: 'monospace',
          }}
        />
      </div>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={handleSave}
        content={files[currentFile] || ''}
      />
    </div>
  );
};

export default JobScreen;
