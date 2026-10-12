const player=document.getElementById("adio")
const tumb=document.getElementById('tumb')
const top_text=document.getElementById("top_text")

const musics=[{
    name:"gatofogo - template",
    audio:"template.mp3",
    tumb:"template.jpg"
},{
    name:"Mario - Ground Theme",
    audio:"GroundTheme.mp3",
    tumb:"mario.jpeg"
}]
let musicaAtual=0
let aleatoriza=false
let loop_type=0
//⛌🔀🔁🔂

function load_music(name,audioFile,tumbFile){
    top_text.innerHTML=name
    player.src="audios/"+audioFile
    player.load()
    tumb.src="tumbs/"+tumbFile
}

function music_goto(index){
    load_music(musics[index].name,musics[index].audio,musics[index].tumb)
}

function music_next(){
    musicaAtual+=1
    if(musicaAtual>musics.length-1){
        musicaAtual=0
    }
    music_goto(musicaAtual)
}

function music_previus(){
    musicaAtual-=1
    if(musicaAtual<0){
        musicaAtual=musics.length-1
    }
    music_goto(musicaAtual)
}

player.onended= (event) => {
    music_next()
}

music_goto(0)