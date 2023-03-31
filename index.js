const usesEmulatorTrueFalse = 'False';
const attemptCount = 0;

const generateSegments = (splitNames, gameName, categoryName) => {
  const splitTemplate = (splitName) => `
        <Segment>
            <Name>${splitName}</Name>
            <Icon />
            <SplitTimes>
                <SplitTime name="Personal Best" />
            </SplitTimes>
            <BestSegmentTime />
            <SegmentHistory />
        </Segment>`;

  const splitNamesArray = Array.isArray(splitNames) ?
    splitNames :
    splitNames.split(/[\n,]/);

  if (splitNames == '' || gameName == '' || categoryName == '') {
    return 'Game, category and split names are required!';
  }

  const segments = splitNamesArray
      .filter((name) => name.trim() !== '')
      .map((name) => splitTemplate(name.trim()))
      .join('');

  const splitFileTemplate = `<?xml version="1.0" encoding="UTF-8"?>
        <Run version="1.7.0">
            <GameIcon />
            <GameName>${gameName}</GameName>
            <CategoryName>${categoryName}</CategoryName>
            <LayoutPath></LayoutPath>
            <Metadata>
                <Run id="" />
                <Platform usesEmulator="${usesEmulatorTrueFalse}"></Platform>
                <Region></Region>
                <Variables />
            </Metadata>
            <Offset>00:00:00</Offset>
            <AttemptCount>${attemptCount}</AttemptCount>
            <AttemptHistory />
            <Segments>${segments}</Segments>
            <AutoSplitterSettings />
        </Run>`;

  return splitFileTemplate;
};

/**
 * Generates a split file based on a list of names entered into an
 * HTML input element and displays the formatted split file on the HTML page.
 *
 * @returns {void}
 */
// eslint-disable-next-line no-unused-vars
const generateSplitFile = () => {
  const splitNamesInput = document.getElementById('splitNames');
  const splitNames = splitNamesInput.value
      .split(/[,|\n]/)
      .map((name) => name.trim());

  const gameNameInput = document.getElementById('gameName');
  const gameName = gameNameInput.value;

  const categoryNameInput = document.getElementById('categoryName');
  const categoryName = categoryNameInput.value;

  const splitFile = generateSegments(splitNames, gameName, categoryName);
  const formattedSplitFile = formatXml(splitFile);
  const splitFileOutput = document.getElementById('splitFile');
  splitFileOutput.value = formattedSplitFile;
};

/**
 * Formats an XML string by removing newlines and spaces between tags,
 * and applying indentation.
 * @param {string} xml - The XML string to format.
 * @return {string} The formatted XML string.
 */
function formatXml(xml) {
  // Remove all the newlines and then remove all the spaces between tags
  xml = xml.replace(/(\r\n|\n|\r)/gm, ' ').replace(/>\s+</g, '><');
  const PADDING = ' '.repeat(4); // set desired indent size here
  const reg = /(>)(<)(\/*)/g;
  let pad = 0;

  xml = xml.replace(reg, '$1\r\n$2$3');

  return xml
      .split('\r\n')
      .map((node, index) => {
        let indent = 0;
        if (node.match(/.+<\/\w[^>]*>$/)) {
          indent = 0;
        } else if (node.match(/^<\/\w/) && pad > 0) {
          pad -= 1;
        } else if (node.match(/^<\w[^>]*[^\/]>.*$/)) {
          indent = 1;
        } else {
          indent = 0;
        }

        pad += indent;

        return PADDING.repeat(pad - indent) + node;
      })
      .join('\r\n');
}

const downloadBtn = document.getElementById('downloadBtn');
const splitFile = document.getElementById('splitFile');

downloadBtn.addEventListener('click', () => {
  const fileContents = splitFile.value;
  const fileName = 'splitify.lss';

  const blob = new Blob([fileContents], {type: 'text/plain'});

  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = fileName;
  link.click();
});
