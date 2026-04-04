async function sendMessage(){
    const message=document.getElementById("input").value.trim();
    if (message==""){
        return;
    }
    document.getElementById("board").innerHTML+="<div class='msg_board'><div class='user_msg'><span>"+message+"</span></div></div>";
    document.getElementById("input").value="";
    document.getElementById("board").innerHTML+="<div class='msg_board'><div id='loading'><span id='loading_span'>AI思考中...</span></div></div></div>";
    document.getElementById("board").scrollTo(0,document.getElementById("board").scrollHeight);
    try{
        const response=await fetch('https://personal-webside.onrender.com/api/chat',{
            method:"POST",
            headers:{"Content-Type":"application/json"},
            body:JSON.stringify({message:message})
        });
        if (!response.ok) {
            if (response.status===429) {
                throw new Error("429");
            }
            else {
                throw new Error("500");
            }
        }
        const data=await response.json();
        document.getElementById("loading").remove();
        if(data.reply){
            document.getElementById("board").innerHTML+="<div class='msg_board'><div class='ai_msg'><span>"+data.reply+"</span></div></div>";
        }
        else{
            document.getElementById("board").innerHTML+="<div class='msg_board'><div class='error'><span>發生錯誤，無法取的回覆</span></div></div>";
        }
    }
    catch(error){
        document.getElementById("loading").remove();
        if(error.message==="429"){
            document.getElementById("board").innerHTML+="<div class='msg_board'><div class='error'><span>目前對話額度已滿，請明天再試或是稍等一分鐘。</span></div></div>";
        }
        else if(error.message==="500"){
            document.getElementById("board").innerHTML+="<div class='msg_board'><div class='error'><span>後端程式出錯，請聯絡開發者。</span></div></div>";
        }
        else{
            document.getElementById("board").innerHTML+="<div class='msg_board'><div class='error'><span>伺服器尚未開啟，請稍等一分鐘。</span></div></div>";
        }
    }
    document.getElementById("board").scrollTo(0,document.getElementById("board").scrollHeight);
}
window.addEventListener("keypress",press=>{
    if(press.key=="Enter"){
        sendMessage();
    }
},false);