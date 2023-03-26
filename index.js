function generateSegments(splitNames) {
    const gameName = "Game Name";
    const categoryName = "Category Name";
    const usesEmulatorTrueFalse = "False";
    const attemptCount = 0;
    const splitName = "Split Name";
  
    const segmentTemplate = 
    `\n            <Segment>
                <Name>${splitName}</Name>
                <Icon />
                <SplitTimes>
                    <SplitTime name="Personal Best" />
                </SplitTimes>
                <BestSegmentTime />
                <SegmentHistory />
            </Segment>`
  
    let segments = "";

    // Check if splitNames is already an array
    if (Array.isArray(splitNames)) {
    // If it is, join the array elements with newline
    splitNames = splitNames.join("\n");
    }

    // Split the input by either newline or comma
    splitNames.split(/[\n,]/).forEach((name) => {
    if (name.trim() !== "") {
        segments += segmentTemplate.replace(
        /<Name>.*<\/Name>/,
        `<Name>${name.trim()}</Name>`
        );
    }
    });
  
    const splitFileTemplate = 
    `<?xml version="1.0" encoding="UTF-8"?>
    <Run version="1.7.0">
        <GameIcon />
        <GameName>${gameName}</GameName>
        <CategoryName>${categoryName}</CategoryName>
        <LayoutPath>
        </LayoutPath>
        <Metadata>
            <Run id="" />
            <Platform usesEmulator="${usesEmulatorTrueFalse}">
            </Platform>
            <Region>
            </Region>
            <Variables />
        </Metadata>
        <Offset>00:00:00</Offset>
        <AttemptCount>${attemptCount}</AttemptCount>
        <AttemptHistory />
        <Segments>${segments}
        </Segments>
        <AutoSplitterSettings />
    </Run>`;
  
    return splitFileTemplate;
  }
  
  function generateSplitFile() {
    const splitNamesInput = document.getElementById("splitNames");
    const splitNames = splitNamesInput.value.split(/[,|\n]/).map(name => name.trim());
    const splitFile = generateSegments(splitNames);
  
    const formattedSplitFile = formatXml(splitFile);
  
    const splitFileOutput = document.getElementById("splitFile");
    splitFileOutput.value = formattedSplitFile;
  }
  
function formatXml(xml) {
    const PADDING = ' '.repeat(2); // set desired indent size here
    const reg = /(>)(<)(\/*)/g;
    let pad = 0;

    xml = xml.replace(reg, '$1\r\n$2$3');

    return xml.split('\r\n').map((node, index) => {
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
    }).join('\r\n');
}
