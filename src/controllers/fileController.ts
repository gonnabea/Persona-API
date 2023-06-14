
import { Request, Response } from "express";



export const downloadCharacterFromURL = async (req: Request, res: Response) => {
    try {
        // const url = req.originalUrl;

        console.log(req.query)
        const fileName = req.query.fileName;
    
        const file = `files/models/characters/${fileName}`;
        res.download(file);
        
    } catch (err) {
        console.log("downloadCharacterFromURL:: ", err);
    }
};
