import { Router, Request, Response } from "express";
import { add_user_form } from "@/user/models/user_form.model";

const app = Router();

/**
 * POST /register/form
 * Receives additional user info after email verification
 */
app.post("/register/form", async (req: Request, res: Response) => {
    try {
        const result = await add_user_form(req.body);
        res.status(200).json(result);
    } catch (error: any) {
        console.error(error);
        res.status(400).json({ error: error.message, name: error.name });
    }
});


export default app;