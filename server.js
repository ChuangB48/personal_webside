require('dotenv').config();
const express=require('express');
const cors=require('cors');
const {GoogleGenerativeAI}=require('@google/generative-ai');
const app=express();
app.use(cors());
app.use(express.json());
const genAI=new GoogleGenerativeAI(process.env.API_KEY);
app.post('/api/chat',async(req,res)=>{
    try{
        const userMessage=req.body.message;
        const model = genAI.getGenerativeModel({ 
            model:"gemini-2.5-flash",
            systemInstruction:`
                你現在是「莊可謙」的專屬客服。
                請遵守以下規則來回答問題：
                1. 我的名字是莊可謙。
                2. 我靠著特殊選才上了元智大學。
                3. 我的生日是2008年3月13日。
            `
        });
        const result=await model.generateContent(userMessage);
        const aiReply=result.response.text();
        res.json({reply:aiReply});
    }
    catch(error){
        console.error("API 錯誤:",error);
        res.status(500).json({error:"伺服器發生錯誤，請稍後再試。"});
    }
});
const PORT=3000;
app.listen(PORT,()=>{
    console.log(`✅ 後端伺服器已啟動：http://localhost:${PORT}`);
});