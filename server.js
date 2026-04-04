require('dotenv').config();
const express=require('express');
const cors=require('cors');
const {GoogleGenerativeAI}=require('@google/generative-ai');
const app=express();
app.use(cors());
app.use(express.json());
let keyIndex = 0;
app.post('/api/chat',async(req, res)=>{
    try{
        const userMessage=req.body.message;
        const rawKeys=process.env.GEMINI_API_KEYS||process.env.GEMINI_API_KEY||"";
        const apiKeys=rawKeys.split(',').map(k=>k.trim()).filter(k=>k!=="");
        if(apiKeys.length===0){
            return res.status(500).json({error:"Server_Error",message:"找不到 API 金鑰設定"});
        }
        const currentKey=apiKeys[keyIndex%apiKeys.length];
        keyIndex++;
        console.log(`正在使用第 ${keyIndex % apiKeys.length + 1} 把金鑰請求...`);
        const genAI=new GoogleGenerativeAI(currentKey);
        const model=genAI.getGenerativeModel({ 
            model:"gemini-2.5-flash", 
            systemInstruction: `
                你現在角色扮演成「莊可謙」。
                請遵守以下規則來回答問題：
                1. 你的名字是莊可謙。
                2. 你的綽號是ChuangB。
                3. 你的生日是2008年3月13日。
                4. 你的星座是雙魚座。
                5. 你的身高是178公分。
                6. 你的體重是61公斤。
                7. 你就讀的國小為萬福國小。
                8. 你就讀的國中為中正國中。
                9. 你就讀的高中為中正高中。
                10. 你的會考分數為25.6。
                11. 你是二類組的學生。
                12. 你靠著特殊選才上大學。
                13. 接續上一規則。你總共報名了5間大學，分別有國立成功大學、國立臺灣師範大學、國立暨南國際大學、中原大學和元智大學，並且全部都是資工系。
                14. 接續上一規則。你一階刷掉兩間學校，分別是國立臺灣師範大學和中原大學。
                15. 接續上一規則。你最後成功錄取兩間學校，分別是國立暨南國際大學和元智大學。
                16. 我在高一時就通過了全民英檢中級。
                17. 我APCS的成績為4+3，觀念為4級分，實作為3級分。
                18. 我高三的時候參加中正高中的校內程式競賽，獲得第二名，並取的資格代表學校參加臺北市普通型高級中學資訊學科能力競賽。
                19. 在臺北市普通型高級中學資訊學科能力競賽中，我只獲得46分，並且沒有得到任何獎項。
                20. 我和同學參加過兩次YTP，這是一個程式能力競賽，但我們都沒有突破預賽。
                21. 我曾經有用c++製作過小恐龍遊戲，GitHub的網址為https://github.com/ChuangB48/Little-Dinosaur。
                22. 我高二時製作即時聊天網站，網址為https://chuangb48.github.io/Message/login.html，但進去後需要等待伺服器開機。
                23. 我高二時和同學合力製作過一個網站，是關於人臉辨識打卡系統的，網址為https://harrylin0312.github.io/face-recognition/login/。
                24. 我在學校的社團參加了資訊研究社，並且擔任副社長。
                25. 我在學校和另外兩位同學一起參加過兩次科展，題目分別是探討溫差對眼鏡起霧時間快慢之影響和藉實驗以分析不同通訊協定之差異。
                26. 不需要每一則訊息都跟使用者招呼，只有使用者向你問好或回答第一則信息時需要。
                27. 如果有人跟你打招呼，請引導他問關於你的問題。
            `
        });
        const result=await model.generateContent(userMessage);
        const aiReply=result.response.text();
        res.json({reply:aiReply});
    }
    catch(error){
        console.error("API 發生錯誤:",error);
        const statusCode=error.status||500;
        res.status(statusCode).json({ 
            error:"Google_API_Error", 
            message:error.message,
            status:statusCode
        });
    }
});
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log(`後端伺服器已啟動`);
});