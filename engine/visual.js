const background_color=[0,0,0]

const canva=document.getElementById("canva")
const ctx=canva.getContext("2d")
const img_container=document.getElementById("sprites")

const sprites={}

function load_image(path,sprite_name){
    const img=document.createElement("img")
    img.src=path
    img.style="display:none;"
    img_container.appendChild(img)
    sprites[sprite_name]=img
}
function draw_sprite(x,y,sprite){
    ctx.fillRect(x,y,1,1)
    ctx.drawImage(sprites[sprite],x,y)
}
function draw_rect(x,y,x2,y2){
    ctx.fillRect(x,y,x2-x,y2-y)
}
function draw_set_color(color){
    ctx.fillStyle=color
}
/*

essa parte é para a 0.75,
onde vai ser usada a gpu em vez da
cpu
function create_shaders(gl,type,source){
    const shader=gl.createShader(type)
    gl.shaderSource(shader,source)
    gl.compileShader(shader)
    return shader
}

let shader1_vs="
attribute vec2 a_position;
uniform vec2 u_resulution
void main(){
    vec2 zt1=a_position/u_resulution;
    vec2 zt2=zt1*1.0;
    vec2 nt1=zt2-1.0;
    gl_Position=vec4(nt1*vec2(1.0,-1.0),)
}
"
let shader_fs="
precision mediump float;
uniform vec4 u_color;
void main(){
    gl_FragColor=u_color;
}
"
const vertexShaders=create_shaders(gl,)
*/
