/*------------------------------------------------------------------------------------------------
  Imagescene Generator - Copyright (C) 2023, TRMSC - https://trmsc.github.io/imagescene-generator/
  GNU General Public Licence 3.0 - http://www.gnu.de/documents/gpl-3.0.en.html
  CC-BY-SA 4.0 DE https://creativecommons.org/licenses/by-sa/4.0/deed.de
  Discard the copyright note by using the creative commons license (attribution is sufficient)
------------------------------------------------------------------------------------------------*/

/**
 * Call functions
 * 
 * @event
 * @listens onload
 * @class window 
 * @returns {void}
 */
window.onload = function() {

  addYear();
  listenEvents();
  return;
    
};


/**
 * Implement year
 * 
 * @function addYear
 * @returns {void}
 *
 */
addYear = () => {

  let time = new Date();
  let year = time.getFullYear();
  document.getElementById("year").innerHTML = year;

};


/**
 * Collect eventlisteners
 * 
 * @function listenEvents
 * @returns {void}
 *
 */
listenEvents = () => {

  // Check dimensions when textareas content was changed
  let textarea = document.getElementById('imagescene-url');
  textarea.addEventListener('input', getDimensions);

  // Generate scene
  let generateButton = document.getElementById('imagescene-generate');
  generateButton.addEventListener('click', generateScene);

  // Copy to clipboard
  let clipboardButton = document.getElementById('imagescene-copy');
  clipboardButton.addEventListener('click', copyClipboard);

};


/**
 * Get images dimensions
 * 
 * @function getDimensions
 * @returns {void}
 *
 */
getDimensions = () => {

  // Get user input
  let content = document.getElementById('imagescene-url').value;
  let wInput = document.getElementById('imagescene-w');
  let hInput = document.getElementById('imagescene-h');

  // Search for width and height
  if (content.includes('width=') && content.includes('height=')) {
      const widthStart = content.indexOf('width="');
      const heightStart = content.indexOf('height="');
      const widthEnd = content.indexOf('"', widthStart + 7);
      const heightEnd = content.indexOf('"', heightStart + 8);

      if (widthStart !== -1 && heightStart !== -1 && widthEnd !== -1 && heightEnd !== -1) {
          const widthValue = content.substring(widthStart + 7, widthEnd);
          const heightValue = content.substring(heightStart + 8, heightEnd);

          // Check correctness
          if (!/%$/.test(widthValue) && !/%$/.test(heightValue)) {
              wInput.value = widthValue.replace(/[^\d.-]/g, '');
              hInput.value = heightValue.replace(/[^\d.-]/g, '');
          } else {
            wInput.value = "";
            hInput.value = "";
          }
      }
  }

};


/**
 * Start generating the scene
 * 
 * @function generateScene
 * @returns {void}
 *
 */
generateScene = () => {

  // Get user input
  let uInput = document.getElementById('imagescene-url');
  let content = uInput.value;
  let wInput = document.getElementById('imagescene-w');
  let hInput = document.getElementById('imagescene-h');

  // Search for embeded url
  if (content.includes('src="') || content.includes("src='")) {
      const srcStart = content.indexOf('src="');
      if (srcStart === -1) {
          srcStart = content.indexOf("src='");
      }
      const srcEnd = content.indexOf('"', srcStart + 5);
  
      if (srcStart !== -1 && srcEnd !== -1) {
          var url = content.substring(srcStart + 5, srcEnd);
      }
  } else {
      // Use whole content if there is no embeded url
      url = content;
  }

  // Check completeness
  let check = true;

  if (uInput.value === '') {
    uInput.style.backgroundColor = '#eda8252e';
    check = false;
  }
  if (wInput.value === '') {
    wInput.style.backgroundColor = '#eda8252e';
    check = false;
  }
  if (hInput.value === '') {
    hInput.style.backgroundColor = '#eda8252e';
    check = false;
  }

  if (!check) {
    showInfo('Bitte alle Felder ausfüllen');

    setTimeout(() => {
      uInput.style.backgroundColor = ''; 
      wInput.style.backgroundColor = ''; 
      hInput.style.backgroundColor = ''; 
    }, 1900); 

    return;

  }

  // Get template
  let templateName = document.getElementById('imagescene-template').value;
  let templatePath = '../templates/' + templateName + '.svg';
  // TODO: Fetch template content
  // TEMPORARY: Usage of a dummy code
  let templateContent = '<svg id="example"><image width="$WIDTH" height="$HEIGHT" xlink:href="$URL" /></svg>';

  // Replace placeholders
  templateContent = templateContent.replace(/\$URL/g, uInput.value);
  templateContent = templateContent.replace(/\$WIDTH/g, wInput.value);
  templateContent = templateContent.replace(/\$HEIGHT/g, hInput.value);

  // Put the generated code to the textarea
  document.getElementById('imagescene-result').value = templateContent;

  // Copy code to the clipboard
  copyClipboard();

};


/**
 * Copy to clipboard
 * 
 * @function copyClipboard
 * @returns {void}
 *
 */
copyClipboard = () => {

  // Copy content
  document.getElementById('imagescene-result').select();
  document.execCommand('copy');

  // Call infobox
  let content = 'In die Zwischenablage kopiert ✔';
  showInfo(content);

};


/**
 * Show information box
 * 
 * @function showInfo
 * @param content Message for the infobox
 * @returns {void}
 *
 */
showInfo = (content) => {

  let infobox = document.getElementById("imagescene-info");
  infobox.textContent = content;
  setTimeout(function () {
    infobox.classList.add("imagesceneConfirm");
  }, 50)
  setTimeout(function () {
    infobox.classList.remove("imagesceneConfirm");
    document.getSelection().removeAllRanges();
  }, 1400)

};