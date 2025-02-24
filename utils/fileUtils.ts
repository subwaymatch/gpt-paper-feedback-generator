import mammoth from "mammoth";
import { pdfjs } from "react-pdf";

export const readWordDocument = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
};

export const readPDFDocument = async (file: File): Promise<string> => {
  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
  let text = "";
  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const content = await page.getTextContent();
    text += content.items.map((item: any) => item.str).join(" ") + "\n";
  }
  return text.trim();
};

export const readPlainText = async (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (event) => resolve(event.target?.result as string);
    reader.onerror = (error) => reject(error);
    reader.readAsText(file);
  });
};

export const readFileContent = async (file: File): Promise<string> => {
  if (file.name.endsWith(".doc") || file.name.endsWith(".docx")) {
    return await readWordDocument(file);
  } else if (file.name.endsWith(".pdf")) {
    return await readPDFDocument(file);
  } else {
    return "Unsupported file type";
  }
};
