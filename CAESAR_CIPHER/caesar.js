/**
 * Caesar Cipher Interactive Lab Logic
 */

function caesarShiftChar(char, shift) {
  const code = char.charCodeAt(0);
  
  // Uppercase letters A-Z (65-90)
  if (code >= 65 && code <= 90) {
    const shiftedCode = ((code - 65 + shift) % 26 + 26) % 26 + 65;
    return String.fromCharCode(shiftedCode);
  }
  
  // Lowercase letters a-z (97-122)
  if (code >= 97 && code <= 122) {
    const shiftedCode = ((code - 97 + shift) % 26 + 26) % 26 + 97;
    return String.fromCharCode(shiftedCode);
  }
  
  // Preserve spaces, numbers, and special characters
  return char;
}

function processCaesar(text, shift) {
  let result = '';
  for (let i = 0; i < text.length; i++) {
    result += caesarShiftChar(text[i], shift);
  }
  return result;
}

document.addEventListener('DOMContentLoaded', () => {
  const textInput = document.getElementById('plainText');
  const shiftInput = document.getElementById('shiftValue');
  const encryptBtn = document.getElementById('encryptBtn');
  const decryptBtn = document.getElementById('decryptBtn');
  const clearBtn = document.getElementById('clearBtn');
  
  const outputSection = document.getElementById('outputSection');
  const outputLabel = document.getElementById('outputLabel');
  const outputValue = document.getElementById('outputValue');
  
  const resultSection = document.getElementById('resultSection');
  const resInputText = document.getElementById('resInputText');
  const resShiftText = document.getElementById('resShiftText');
  const resOutputText = document.getElementById('resOutputText');
  const resOperationLabel = document.getElementById('resOperationLabel');

  function handleExecution(isEncrypt) {
    const text = textInput.value;
    const shiftParsed = parseInt(shiftInput.value, 10);
    const shift = isNaN(shiftParsed) ? 0 : shiftParsed;

    const actualShift = isEncrypt ? shift : -shift;
    const resultText = processCaesar(text, actualShift);

    // Display Cipher Text / Decrypted Text output
    outputLabel.textContent = isEncrypt ? 'Cipher Text' : 'Decrypted Text';
    outputValue.textContent = resultText || '(Empty Input)';
    outputSection.style.display = 'block';

    // Update Result Summary Section
    resInputText.textContent = text || '(None)';
    resShiftText.textContent = shift;
    resOutputText.textContent = resultText || '(None)';
    resOperationLabel.textContent = isEncrypt ? 'encrypted' : 'decrypted';
    resultSection.style.display = 'block';
  }

  if (encryptBtn) {
    encryptBtn.addEventListener('click', () => handleExecution(true));
  }

  if (decryptBtn) {
    decryptBtn.addEventListener('click', () => handleExecution(false));
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      textInput.value = '';
      shiftInput.value = '3';
      outputValue.textContent = '';
      outputSection.style.display = 'none';
      resultSection.style.display = 'none';
    });
  }

  const languageSelect = document.getElementById('languageSelect');
  if (languageSelect) {
    languageSelect.addEventListener('change', (e) => {
      const selected = e.target.value;
      
      const codePython = document.getElementById('code-python');
      const codeJava = document.getElementById('code-java');
      const codeCpp = document.getElementById('code-cpp');
      
      if (codePython) codePython.style.display = 'none';
      if (codeJava) codeJava.style.display = 'none';
      if (codeCpp) codeCpp.style.display = 'none';
      
      if (selected === 'python' && codePython) {
        codePython.style.display = 'block';
      } else if (selected === 'java' && codeJava) {
        codeJava.style.display = 'block';
      } else if (selected === 'cpp' && codeCpp) {
        codeCpp.style.display = 'block';
      }
    });
  }
});
