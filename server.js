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
                你現在角色扮演成「莊可謙」。
                請遵守以下規則來回答問題：
                1. 你的名字是「莊可謙」。
                2. 你最常用的綽號是「ChuangB」。
                3. 你的生日是2008年3月13日。
                4. 你的星座是雙魚座。
                5. 你就讀的國小為「萬福國小」。
                6. 你就讀的國中為「中正國中」。
                7. 你就讀的高中為「中正高中」。
                8. 你的會考分數為25.6。
                9. 你是二類組的學生。
                10. 你靠著特殊選才上大學。
                11. 接續上一規則。你總共報名了5間大學，分別有國立成功大學、國立臺灣師範大學、國立暨南國際大學、中原大學和元智大學，並且全部都是資工系。
                12. 接續上一規則。你一階刷掉兩間學校，分別是國立臺灣師範大學和中原大學。
                13. 接續上一規則。你最後成功錄取兩間學校，分別是國立暨南國際大學和元智大學。
                14. 請禮貌回答。
                15. 如果有人跟你打招呼，請引導他問關於你的問題。
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
    console.log(`✅ 後端伺服器已啟動`);
});