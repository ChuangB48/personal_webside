require('dotenv').config();
const express=require('express');
const cors=require('cors');
const app=express();
app.use(cors());
app.use(express.json());
let i=0;
const train=`
    你現在角色扮演成「莊可謙」。
    請遵守以下規則來回答問題：
    1. 你的名字是莊可謙。
    2. 你是男生。
    3. 你的綽號是ChuangB。
    4. 你的生日是2008年3月13日。
    5. 你的星座是雙魚座。
    6. 你的身高是178公分。
    7. 你的體重是61公斤。
    8. 你就讀的國小為臺北市萬福國民小學。
    9. 你就讀的國中為臺北市立中正國民中學。
    10. 你就讀的高中為臺北市立中正高級中學。
    11. 你的會考分數為25.6。
    12. 你是二類組的學生。
    13. 你靠著特殊選才上大學。
    14. 接續上一規則。你總共報名了5間大學，分別有國立成功大學、國立臺灣師範大學、國立暨南國際大學、中原大學和元智大學，並且全部都是資工系。
    15. 接續上一規則。你一階刷掉兩間學校，分別是國立臺灣師範大學和中原大學。
    16. 接續上一規則。你最後成功錄取兩間學校，分別是國立暨南國際大學和元智大學。
    17. 我在高一時就通過了全民英檢中級。
    18. 我APCS的成績為4+3，觀念為4級分，實作為3級分。
    19. 我高三的時候參加中正高中的校內程式競賽，獲得第二名，並取的資格代表學校參加臺北市普通型高級中學資訊學科能力競賽。
    20. 在臺北市普通型高級中學資訊學科能力競賽中，我只獲得46分，並且沒有得到任何獎項。
    21. 我和同學參加過兩次YTP，這是一個程式能力競賽，但我們都沒有突破預賽。
    22. 我曾經有用c++製作過小恐龍遊戲，GitHub的網址為https://github.com/ChuangB48/Little-Dinosaur。
    23. 我高二時製作即時聊天網站，網址為https://chuangb48.github.io/Message/login.html，但進去後需要等待伺服器開機。
    24. 我高二時和同學合力製作過一個網站，是關於人臉辨識打卡系統的，網址為https://harrylin0312.github.io/face-recognition/login/。
    25. 我在學校的社團參加了資訊研究社，並且擔任副社長。
    26. 我在學校和另外兩位同學一起參加過兩次科展，題目分別是探討溫差對眼鏡起霧時間快慢之影響和藉實驗以分析不同通訊協定之差異。
    27. 可以參考https://canva.link/9sxvbpbczg3rfx9來回答。
    28. 不需要每一則訊息都跟使用者招呼，只有使用者向你問好或回答第一則信息時需要。
    29. 如果有人跟你打招呼，請簡單自我介紹就好，越簡單越好，並引導他問關於你的問題。
`;
app.post('/api/chat',async (req,res)=>{
    try{
        const userMessage=req.body.message;
        const rawKeys=process.env.GEMINI_API_KEYS||process.env.GEMINI_API_KEY||"";
        const apiKeys=rawKeys.split(',').map(k=>k.trim()).filter(k=>k!=="");
        if(apiKeys.length===0){
            return res.status(500).json({error:"No_API_Keys",message:"請在環境變數設定 GEMINI_API_KEYS"});
        }
        const apiKey=apiKeys[i%apiKeys.length];
        i++;
        const modelName="gemini-3.1-flash-lite-preview";
        const url=`https://generativelanguage.googleapis.com/v1beta/models/${modelName}:generateContent?key=${apiKey}`;
        const response=await fetch(url,{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body: JSON.stringify({
                contents:[{
                    parts:[{text:`系統指令：${train}\n\n使用者訊息：${userMessage}`}]
                }],
                generationConfig:{
                    temperature:0.75,
                    maxOutputTokens:1000
                }
            })
        });
        const data=await response.json();
        if (!response.ok) {
            console.error(`Google API 報錯 (${response.status}):`,data);
            return res.status(response.status).json({
                error:"Google_API_Error",
                status:response.status,
                message:data.error?data.error.message:"未知錯誤"
            });
        }
        const aiReply=data.candidates[0].content.parts[0].text;
        res.json({reply:aiReply});
    }
    catch(error){
        console.error("伺服器崩潰:",error);
        res.status(500).json({ error:"Server_Crash",message:error.message});
    }
});
const PORT=process.env.PORT||3000;
app.listen(PORT,()=>{
    console.log("伺服器已啟動");
});