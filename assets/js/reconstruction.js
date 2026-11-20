const scenePicker = document.getElementById('result-scene');
const resultTable = document.getElementById('result-table');
const methods = Array.from(resultTable.tHead.rows[0].cells).slice(1);
const previous = document.getElementById('methods-prev');
const next = document.getElementById('methods-next');
const range = document.getElementById('method-range');
const methodsPerPage = 2;
let firstMethod = 0;

function resultImage(method, modality) {
    const scene = scenePicker.selectedOptions[0];
    const filename = method.dataset.file || method.textContent;
    const image = new Image();
    image.alt = `${scene.textContent}, ${modality} reconstruction by ${method.textContent}`;
    image.loading = 'lazy';
    image.decoding = 'async';
    image.src = `assets/gif/${modality.toLowerCase()}/${scene.value}/${filename}.gif`;
    return image;
}

function renderComparison() {
    const end = Math.min(firstMethod + methodsPerPage, methods.length);
    const visible = methods.slice(firstMethod, end);
    methods.forEach((method, index) => {
        method.hidden = index < firstMethod || index >= end;
    });
    resultTable.setAttribute('aria-label', scenePicker.selectedOptions[0].textContent + ' reconstructions');
    for (const row of resultTable.tBodies[0].rows) {
        const label = row.cells[0];
        row.replaceChildren(label);
        for (const method of visible) {
            row.insertCell().append(resultImage(method, label.textContent));
        }
    }
    range.textContent = `Methods ${firstMethod + 1}–${end} of ${methods.length}`;
    previous.disabled = firstMethod === 0;
    next.disabled = end === methods.length;
}

previous.addEventListener('click', () => {
    firstMethod -= methodsPerPage;
    renderComparison();
});
next.addEventListener('click', () => {
    firstMethod += methodsPerPage;
    renderComparison();
});
scenePicker.addEventListener('change', renderComparison);
renderComparison();
