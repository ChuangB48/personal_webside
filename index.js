async function sendMessage(){
    let message=document.getElementById("input").value.trim();
    if (message==""){
        return;
    }
    document.getElementById("board").innerHTML+="<div class='msg_board'><div class='user_msg'><span>"+message+"</span></div></div>";
    document.getElementById("input").value="";
    document.getElementById("board").innerHTML+="<div class='msg_board'><div id='loading'><span id='loading_span'>AI思考中...</span></div></div></div>";
    try{
        const response=await fetch('http://localhost:3000/api/chat',{
            method:'POST',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({message:message})
        });
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
        document.getElementById("board").innerHTML+="<div class='msg_board'><div class='error'><span>連線失敗，請確認後端伺服器 (node server.js) 是否已啟動！</span></div></div>";
    }
}
window.addEventListener("keypress",press=>{
    if(press.key=="Enter"){
        sendMessage();
    }
},false);