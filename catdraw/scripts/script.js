const canva=document.getElementById("canva")
const ctx=canva.getContext("2d")

canva.addEventListener("touchmove", (event) => {
    ctx.fillRect(event.client[0].x,event.clientPos[0].x,2,2)
})