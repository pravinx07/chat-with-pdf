import express from "express"
import multer from "multer"
import fs from "fs"
import pdfParse from "pdf-parse/lib/pdf-parse.js"

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
    
    res.json({
        success:true,
        text:parsePdf.text
    })
   } catch (error) {
    
    console.error(error)
    res.status(500).json({
        messsage:"Error parsing PDF"
    })
   }

  
   
})

export default router
