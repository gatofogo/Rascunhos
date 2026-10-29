  //============//
 //  creatong  //
//============//
canva.focus();


//- consts
const objects=[]
const room={id:0}
const rooms=[{instances:[],clear_color:[0,0,0]}]
const max_fps=17

//- lets
let tick_update=0
let instances=[]
let chunks=[]
let tipo_chunks={}
let touch_start=[]
let touch_move=[]

let mouse_middle=false
let mouse_down=false
let mouse_down_right=false

let keyboard_pressed={}
let keyboard_down={}
let keyboard_released={}

let touch_started=false
let touch_moved=false

if(true){//todas as variaveis criadas aqui seram apagadas, criadas!=modificadas
    const teclas="1234567890qwertyuiopasdfghjklzxcvbnmç,\\.;/~][´=-' "
    const teclas_plus=["ctrl","shift","alt","altgr","tab","capslock","esc","enter","backspace"]
    for(let i=0; i<teclas.length; i++){
        keyboard_pressed[teclas[i]]=false
        keyboard_down[teclas[i]]=false
        keyboard_released[teclas[i]]=false
    }
    for(let i=0; i<teclas_plus.length; i++){
        keyboard_pressed[teclas[i]]=false
        keyboard_down[teclas[i]]=false
        keyboard_released[teclas[i]]=false
    }
}


  //=============//
 //  functions  //
//=============//
function get_instances_in_chunk(chunk_x,chunk_y){
    let chunks_row=chunks[chunk_y]
    if (chunks_row){
        let chunk=chunks_row[chunk_x]
        if (chunk){
            return chunk
        }
    }
    return []
}
function create_object(create,step,draw){
    objects.push({create:create,step:step,draw:draw})
}
function get_chunks_in_rect(x1,y1,x2,y2){
    let bgl={dirx:Math.sign(x2-x1),diry:Math.sign(y2-y1)}
    if (bgl.dirx==0)bgl.dirx=1
    if (bgl.diry==0)bgl.diry=1
    return {
        xi:Math.floor(x1/432),yi:Math.floor(y1/432),
        xf:Math.ceil(x2/432),yf:Math.ceil(y2/432),
        dirx:bgl.dirx,diry:bgl.diry
    }
}
function get_instances_in_rect(x1,y1,x2,y2){
    const chunkss=get_chunks_in_rect(x1,y1,x2,y2)
    let insts=[]
    for(let i=0; i<Math.abs(chunkss.xf-chunkss.xi); i+=chunkss.dirx){
        for(let l=0; l<Math.abs(chunkss.yf-chunkss.yi); l+=chunkss.diry){
            let insts_in_chunk=get_instances_in_chunk(i+chunkss.xi,l+chunkss.yi)
            for(let inst=0; inst<insts_in_chunk.length; inst++){
                insts.push(insts_in_chunk[inst])
            }
        }
    }
    return insts
}
function collision_rect(x1,y1,x2,y2,target_obj_ids,ignore_ids){
    let insts=get_instances_in_rect(x1,y1,x2,y2)
    let colided=[]
     for(let i=0;i<insts.length;i++){
         let pula=false
         for(let l=0; l<ignore_ids.length; l++){
             if (insts[i]==ignore_ids[l]){
                 pula=true
                 break
             }
         }
         if (pula) continue
         for(let l=0; l<target_obj_ids.length; l++){
             if (instances[insts[i]].obj_id==target_obj_ids[l]){
                 pula=true
                 break
             }
         }
         if (!pula) continue
         let bgl=instances[insts[i]]
         if (bgl.x<x2 && bgl.y<y2 && bgl.x+bgl.col_x>x1 && bgl.y+bgl.col_y>y1){
             colided.push(insts[i])
         }
     }
    return colided
}
function room_goto(room_id){
    instances=rooms[room_id].instances
    room.id=room_id
    for(let i=0; i<instances.length; i++){
        objects[instances[i].obj_id].create(instances[i])
        let chunkss2=get_chunks_in_rect(instances[i].x,instances[i].y,instances[i].x+instances[i].col_x,instances[i].y+instances[i].col_y)
        for(let cx=0; Math.abs(cx)<Math.abs(chunkss2.xf-chunkss2.xi); cx+=chunkss2.dirx){
            for(let cy=0; Math.abs(cy)<Math.abs(chunkss2.yf-chunkss2.yi); cy+=chunkss2.diry){
                if(!chunks[cy])chunks[cy]=[]
                if(!chunks[cy][cx])chunks[cy][cx]=[]
                chunks[cy][cx].push(i)
            }
        }
    }
}
function room_restart(){
    room_goto(room.id)
}
function room_goto_next(){
    room_goto(room.id+1)
}
function room_goto_previus(){
    room_goto(room.id-1)
}
function getKeyName(event) {
    let key = event.key.toLowerCase();
    return key;
}
function clearInputStates() {
    for (let key in keyboard_pressed) {
        keyboard_pressed[key] = false;
        keyboard_released[key] = false;
    }
    for (let key in keyboard_down) {
        keyboard_pressed[key] = false;
        keyboard_released[key] = false;
    }
}
  //============//
 //  starting  //
//============//

//- room
room_goto(0)

//- listerings
canva.addEventListener("touchstart", function(e){
    touch_started=true
    touch_start=e.targetTouches
})
canva.addEventListener("touchmove", function(e){
    touch_moved=true
    touch_move=e.targetTouches
})
canva.addEventListener("mousedown", function(e){
    touch_start[0]=e
    touch_started=true
    if(e.button==0){
        mouse_down=true
    }else if(e.button==1){
        mouse_middle=true
    }else{
        mouse_down_right=true
    }
})
canva.addEventListener("keydown", (e) => {
    const key = getKeyName(e);
    
    // Se a tecla existe no seu controle de teclado
    if (key in keyboard_down) {
        // Se ela já estava down, significa que está sendo mantida (não é um "pressed" novo)
        if (!keyboard_down[key]) {
            keyboard_pressed[key] = true; // Acabou de ser pressionada neste frame
        }
        keyboard_down[key] = true;      // Continua abaixada
    }
});

// 2. Evento quando a tecla é solta
canva.addEventListener("keyup", (e) => {
    const key = getKeyName(e);
    
    if (key in keyboard_down) {
        keyboard_down[key] = false;
        keyboard_released[key] = true; // Marcar que foi solta neste frame
    }
});
canva.addEventListener("mouseup", function(e){
    if(e.button==0){
        mouse_down=false
    }else if(e.button==1){
        mouse_middle=false
    }else{
        mouse_down_right=false
    }
})
canva.addEventListener("mousemove", function(e){
    touch_move[0]=e
    if(mouse_down_right){
        touch_moved=true
    }else if(mouse_down){
        touch_moved=true
    }
})

  //========//
 //  loop  //
//========//

//- creating loops
let timestamp_antes=0
function draw_update(timestamp){
    const deltatime=timestamp-timestamp_antes
    const delta=deltatime/1000
    timestamp_antes=timestamp
    tick_update+=deltatime
    for(let t=0; t<Math.floor(tick_update/max_fps); t++){
        for(let i=0; i<instances.length; i++){
            //posicao tamanho antigo
            const pta={x:instances[i].x,y:instances[i].y,
                col_x:instances[i].col_x,col_y:instances[i].col_y}
            
            objects[instances[i].obj_id].step(instances[i])
            
            if (pta.x!=instances[i].x || pta.y!=instances[i].y || pta.col_x!=instances[i].col_x || pta.col_y!=instances[i].col_y){
                let chunkss=get_chunks_in_rect(pta.x,pta.y,pta.x+pta.col_x,pta.y+pta.col_y)
                for(let cx=0; Math.abs(cx)<Math.abs(chunkss.xf-chunkss.xi); cx+=chunkss.dirx){
                    for(let cy=0; Math.abs(cy)<Math.abs(chunkss.yf-chunkss.yi); cy+=chunkss.diry){
                        chunks[cy][cx]=chunks[cy][cx].filter(num => num !== i)
                    }
                }
                let chunkss2=get_chunks_in_rect(instances[i].x,instances[i].y,instances[i].x+instances[i].col_x,instances[i].y+instances[i].col_y)
                for(let cx=0; Math.abs(cx)<Math.abs(chunkss2.xf-chunkss2.xi); cx+=chunkss2.dirx){
                    for(let cy=0; Math.abs(cy)<Math.abs(chunkss2.yf-chunkss2.yi); cy+=chunkss2.diry){
                        chunks[cy][cx].push(i)
                    }
                }
            }
    }
    touch_moved=false
    touch_started=false
    clearInputStates()
    tick_update-=Math.floor(tick_update/max_fps)*max_fps
    draw_color=rooms[room.id].clear_color
        clear_all()
    for(let i=0; i<instances.length; i++){
        objects[instances[i].obj_id].draw(instances[i])
    }
    }
    requestAnimationFrame(draw_update)
}
//- starting loops
requestAnimationFrame(draw_update)