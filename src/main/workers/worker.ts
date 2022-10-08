import { parentPort, threadId } from 'worker_threads';

//simulating big task
setTimeout(() => {
  parentPort?.postMessage(`From worker thread: I am worker thread and my thread ID is "${threadId}"`);
}, 10000);
