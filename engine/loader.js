function loadAll(){
    document.getElementById("canva").style.display="flex"
    const bgl=["jogo","engine","visual"] // a ordem é ao contraria
    document.getElementById("loaderbutton").remove()
    load_next(bgl)
}

function load_next(scripts){
    const strscript=scripts.pop()
    var script = document.createElement('script')
    script.src = "scripts/"+strscript+".js"
    script.onload=function(){
        console.log(strscript+" carregado")
        if(scripts.length>0)load_next(scripts)
    }
    document.body.appendChild(script)
}