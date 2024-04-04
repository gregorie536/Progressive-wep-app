self.onmessage = (ev) => {
    console.log('Worker received message:', ev);
    self.postMessage('Hello from worker!');
    }