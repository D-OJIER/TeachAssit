import { getDocument, GlobalWorkerOptions } from "pdfjs-dist";

// Manually set the worker source to a public CDN
GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.4.120/pdf.worker.min.js`;

export { getDocument };
