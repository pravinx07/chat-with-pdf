import express from "express"
import multer from "multer"
import fs from "fs"
import pdfParse from "pdf-parse/lib/pdf-parse.js"
import { GoogleGenAI } from "@google/genai";


const router = express.Router();

const upload = multer({
    dest:"upload/"
})

router.post("/upload",upload.single("pdf"),async (req,res) => {
   console.log(req.file);

   if(!req.file){
    return res.status(400).json({
        message:"Please upload a pdf"
    })
   }

   try {
    const pdfBuffer = fs.readFileSync(
        req.file.path
    )
    const parsePdf = await pdfParse(pdfBuffer)
    const chunks = chunkText(parsePdf.text)
    res.json({
        success:true,
        totalChunka:chunks.length,
        firstChunk: chunks[0]
    })
   } catch (error) {
    
    console.error(error)
    res.status(500).json({
        messsage:"Error parsing PDF"
    })
   }

  
   
})
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY
});

export async function generateEmbedding(text) {
  const response = await ai.models.embedContent({
    model: "gemini-embedding-2",
    contents: text
  });

  return response.embeddings[0].values;
}
const vector = await generateEmbedding(
  "React hooks are used for state management."
);

console.log(vector.length);
console.log(vector.slice(0, 10));

function chunkText(text, chunkSize = 1000) {
    const chunks = [];

    for (let i = 0; i < text.length; i += chunkSize) {
        chunks.push(
            text.slice(i, i + chunkSize)
        );
    }

    return chunks;
}

export default router
