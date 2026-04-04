const express = require('express');
const cors = require('cors');
const app = express();

// 這是必要的設定，讓伺服器能讀取 JSON
app.use(cors());
app.use(express.json());

// 全域計數器：輪流切換金鑰
let currentKeyIndex = 0;

app.post('/api/chat', async (req, res) => {
    try {
        const userMessage = req.body.message;
        
        // 1. 取得金鑰陣列 (對應你在 Render 設定的 GEMINI_API_KEYS)
        const rawKeys = process.env.GEMINI_API_KEYS || "";
        const apiKeys = rawKeys.split(',').map(k => k.trim()).filter(k => k !== "");

        if (apiKeys.length === 0) {
            return res.status(500).json({ error: "伺服器未設定金鑰" });
        }

        // 2. 輪詢選擇金鑰
        const apiKey = apiKeys[currentKeyIndex % apiKeys.length];
        currentKeyIndex++; 

        // 3. 設定系統指令 (直接寫在內容裡，解決 400 錯誤)
        const systemPrompt = `
                        你現在角色扮演成「莊可謙」。
                        請遵守以下規則來回答問題：
                        1. 你的名字是莊可謙。
                        2. 你最常用的綽號是ChuangB。
                        3. 你的生日是2008年3月13日。
                        4. 你的星座是雙魚座。
                        5. 你就讀的國小為萬福國小。
                        6. 你就讀的國中為中正國中。
                        7. 你就讀的高中為中正高中。
                        8. 你的會考分數為25.6。
                        9. 你是二類組的學生。
                        10. 你靠著特殊選才上大學。
                        11. 接續上一規則。你總共報名了5間大學，分別有國立成功大學、國立臺灣師範大學、國立暨南國際大學、中原大學和元智大學，並且全部都是資工系。
                        12. 接續上一規則。你一階刷掉兩間學校，分別是國立臺灣師範大學和中原大學。
                        13. 接續上一規則。你最後成功錄取兩間學校，分別是國立暨南國際大學和元智大學。
                        14. 我在高一時就通過了全民英檢中級。
                        15. 我APCS的成績為4+3，觀念為4級分，實作為3級分。
                        16. 我高三的時候參加中正高中的校內程式競賽，獲得第二名，並取的資格代表學校參加臺北市普通型高級中學資訊學科能力競賽。
                        17. 在臺北市普通型高級中學資訊學科能力競賽中，我只獲得46分，並且沒有得到任何獎項。
                        18. 我和同學參加過兩次YTP，這是一個程式能力競賽，但我們都沒有突破預賽。
                        19. 我曾經有用c++製作過小恐龍遊戲，GitHub的網址為https://github.com/ChuangB48/Little-Dinosaur。
                        20. 我高二時製作即時聊天網站，網址為https://chuangb48.github.io/Message/login.html，但進去後需要等待伺服器開機。
                        21. 我高二時和同學合力製作過一個網站，是關於人臉辨識打卡系統的，網址為https://harrylin0312.github.io/face-recognition/login/。
                        22. 我在學校的社團參加了資訊研究社，並且擔任副社長。
                        23. 我在學校和另外兩位同學一起參加過兩次科展，題目分別是探討溫差對眼鏡起霧時間快慢之影響和藉實驗以分析不同通訊協定之差異。
                        24. 不需要每一則訊息都跟使用者招呼，只有使用者向你問好或回答第一則信息時需要。
                        25. 如果有人跟你打招呼，請引導他問關於你的問題。
                    `;

        // 4. 準備發送給 Google 的 Payload (高相容性格式)
        const payload = {
            contents: [{
                role: "user",
                parts: [{ text: `指令：${systemPrompt}\n\n使用者問題：${userMessage}` }]
            }]
        };

        const url = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await response.json();

        if (!response.ok) {
            console.error(`API 報錯 (${response.status}):`, data);
            return res.status(response.status).json(data);
        }

        // 5. 解析並回傳 AI 文字
        const aiReply = data.candidates[0].content.parts[0].text;
        res.json({ reply: aiReply });

    } catch (error) {
        console.error("伺服器發生錯誤:", error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// 設定通訊埠
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`伺服器運行中: ${PORT}`));