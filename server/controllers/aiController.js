import OpenAI from "openai";
import sql from "../configs/db.js";
import { clerkClient } from "@clerk/express";
import axios from "axios";
import {v2 as cloudinary} from 'cloudinary';
import fs from 'fs';
import pdf from 'pdf-parse/lib/pdf-parse.js'

const AI = new OpenAI({
    apiKey: process.env.GEMINI_API_KEY,
    baseURL: "https://generativelanguage.googleapis.com/v1beta/openai/"
});

export const generateArticle = async (req, res) => {
    try{
        console.log('gen article recieved');
        const userId = req.userId || (await req.auth())?.userId;
        if (!userId) {
          throw new Error('User ID not found in request');
        }
        console.log('User authenticated:', userId);
        const {prompt, length} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;
        console.log('Plan:', plan, 'Free usage:', free_usage);

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success: false, message: 'Free usage limit reached. Upgrade to premium.'});
        }

        console.log('Calling Gemini API...');
        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            maxTokens: length,
        });

        console.log('Gemini API response received');
        const content = response.choices[0].message.content;
        
        console.log('Inserting into database...');
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'article')`;
        console.log('Database insert successful');

        if(plan !== 'premium'){
            console.log('Updating user metadata...');
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
            console.log('User metadata updated');
        } 
        res.json({success: true, content});
        console.log('response sent');
    }catch (error) {
        console.error("Error generating article:", error);
        console.error("Error stack:", error.stack);
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        res.status(500).json({success: false, message: error.message, error: error.name});
    }
}

export const generateBlogTitle = async (req, res) => {
    try{
        const {userId} = await req.auth();
        const {prompt} = req.body;
        const plan = req.plan;
        const free_usage = req.free_usage;

        if(plan !== 'premium' && free_usage >= 10){
            return res.json({success: false, message: 'Free usage limit reached. Upgrade to premium.'});
        }

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [{role: "user", content: prompt,}],
            temperature: 0.7,
            maxTokens: 100,
        });

        const content = response.choices[0].message.content;
        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${prompt}, ${content}, 'blog-title')`;

        if(plan !== 'premium'){
            await clerkClient.users.updateUserMetadata(userId, {
                privateMetadata: {
                    free_usage: free_usage + 1
                }
            });
        } 
        res.json({success: true, content});
    }catch (error) {
        console.error("Error generating Title:", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const generateImage = async (req, res) => {
    try{
        const {userId} = await req.auth();
        const {prompt, publish} = req.body;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({success: false, message: 'This feature is only available for premium users.'});
        }

        const form = new FormData()
        form.append('prompt', prompt);

        const {data} = await axios.post('https://clipdrop-api.co/text-to-image/v1', form, {
            headers: {'x-api-key': process.env.CLIPDROP_API_KEY,},
            responseType: 'arraybuffer',
        })

        const base64Image = `data:image/png;base64,${Buffer.from(data, 'binary').toString('base64')}`;

        const {secure_url} = await cloudinary.uploader.upload(base64Image)

        await sql`INSERT INTO creations (user_id, prompt, content, type, published) VALUES (${userId}, ${prompt}, ${secure_url}, 'image', ${publish ?? false})`;
 
        res.json({success: true, content: secure_url});
    }catch (error) {
        console.error("Error generating Image:", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const removeImageBackground = async (req, res) => {
    try{
        //console.log('req recvd');
        const {userId} = await req.auth();
        const image = req.file;
        const plan = req.plan;
        //console.log('req 2')

        if(plan !== 'premium'){
            return res.json({success: false, message: 'This feature is only available for premium users.'});
        }   

        const {secure_url} = await cloudinary.uploader.upload(image.path, {
            transformation: [
                {
                    effect: 'background_removal',
                    background_removal: 'remove_the_background'
                }
            ]
        })

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Remove background form image', ${secure_url}, 'image')`;
 
        res.json({success: true, content: secure_url});

    }catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const removeImageObject = async (req, res) => {
    try{
        const {userId} = await req.auth();
        const {object} = req.body;
        const image = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({success: false, message: 'This feature is only available for premium users.'});
        }   

        const {public_id} = await cloudinary.uploader.upload(image.path);

        const imageUrl = await cloudinary.url(public_id, {
            transformation: [{effect: `gen_remove:${object}`},],
            resource_type: 'image'
        });

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, ${`Remove ${object}  form image`}, ${imageUrl}, 'image')`;
 
        res.json({success: true, content: imageUrl});

    }catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({success: false, message: error.message});
    }
}

export const resumeReview = async (req, res) => {
    try{
        const {userId} = await req.auth();
        const resume = req.file;
        const plan = req.plan;

        if(plan !== 'premium'){
            return res.json({success: false, message: 'This feature is only available for premium users.'});
        }

        if(resume.size > 5 * 1024 * 1024){
            return res.json({success: false, message: 'Resume file size exceeds allowed file size(5MB)'});
        }

        const dataBuffer = fs.readFileSync(resume.path);
        
        const pdfData = await pdf(dataBuffer);

        const prompt = `Review the following resume and provide constructive feedback 
        on its strengths, weaknesses, and areas for improvement. Resume Content: \n\n ${pdfData.text}`

        const response = await AI.chat.completions.create({
            model: "gemini-2.0-flash",
            messages: [
                {
                    role: "user",
                    content: prompt,
                },
            ],
            temperature: 0.7,
            maxTokens: 1000,
        });

        const content = response.choices[0].message.content;

        await sql`INSERT INTO creations (user_id, prompt, content, type) VALUES (${userId}, 'Review the uploaded resume', ${content}, 'resume-review')`;
 
        res.json({success: true, content});

    }catch (error) {
        console.error("Error processing image:", error);
        res.status(500).json({success: false, message: error.message});
    }
}