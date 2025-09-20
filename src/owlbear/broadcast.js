import OBR from "@owlbear-rodeo/sdk";

OBR.broadcast.onMessage('ROOM',(msg)=>{
    console.log(msg)
})