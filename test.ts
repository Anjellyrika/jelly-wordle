// TESTING GROUNDS
// console.log("Test file");

const testfile_inputdiv = document.getElementById('URL Input');

if (testfile_inputdiv !== null) {

    let elements : HTMLElement[] = [];

    const sortedBox = document.createElement('input');
    sortedBox.setAttribute('type', 'checkbox');
    elements.push(sortedBox);

    const sortedBoxLabel = document.createElement('label');
    sortedBoxLabel.textContent = "Checkbox";
    elements.push(sortedBoxLabel);

    testfile_inputdiv.replaceChildren(...elements);
}

