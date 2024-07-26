document.getElementById('file-input').addEventListener('change', () => {
    const output = document.getElementById('output');
    output.innerHTML = '';  // Clear the output when a new file is chosen
});

document.getElementById('convert-button').addEventListener('click', async () => {
    try {
        const fileInput = document.getElementById('file-input');

        if (fileInput.files.length === 0) {
            alert('Please select a PDF file.');
            return;
        }

        const file = fileInput.files[0];
        const arrayBuffer = await file.arrayBuffer();
        const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);

        const doc = new docx.Document();
        const pages = pdfDoc.getPages();

        for (let i = 0; i < pages.length; i++) {
            const page = pages[i];
            const textContent = await page.getTextContent();
            const text = textContent.items.map(item => item.str).join(' ');

            doc.addSection({
                children: [
                    new docx.Paragraph({
                        children: [new docx.TextRun(text)],
                    }),
                ],
            });
        }

        const packer = new docx.Packer();
        const docBuffer = await packer.toBuffer(doc);
        const blob = new Blob([docBuffer], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const url = URL.createObjectURL(blob);

        const output = document.getElementById('output');
        output.innerHTML = `<a href="${url}" download="converted.docx" class="btn btn-success btn-block">Download Converted File</a>`;
    } catch (error) {
        console.error('Error during conversion:', error);
        alert('An error occurred during conversion. Please check the console for details.');
    }
});
