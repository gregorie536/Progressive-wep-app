const quill = new Quill('#editor', {
    theme: 'snow'
});

const chooseFileButton = document.querySelector('#choosefile');
const saveFileButton = document.querySelector('#savefile');

async function getFile() {
    const [fileHandle] = await window.showOpenFilePicker({
        multiple: false,
        types: [{
            description: 'Text files',
            accept: {
                'text/*': ['.txt', '.html'],
            },
        }, ],
    });

    const file = await fileHandle.getFile();

    const writeFile = await fileHandle.createWritable();
    return file;
}

let handle = {};

chooseFileButton.addEventListener('click', async () => {
    handle = await getFile();
    quill.setText(await handle.text());
    console.log(handle);
});

saveFileButton.addEventListener('click', async () => {
    await handle.writableStream.write(content);
    await handle.writableStream.close();
    quill.setText();
})