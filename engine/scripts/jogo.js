chunk_size=432

function choose(listt){
    return listt[Math.floor(Math.random(0,listt.length))]
}

function div(n1,n2){
    return Math.floor(n1/n2)*n2
}
function mod(n1,n2){
    return n1-div(n1,n2)
}

const altura_chao=100

create_object(function(me){
    me.alive=true
    temp_espalha=0
},function(me){
    if(!me.alive){
        temp_espalha+=1
        if(temp_espalha>=60){
            temp_espalha-=60
            let lugar=Math.random(-5,5)
            let col=collision_rect(me.x+lugar,me.y,me.x+me.col_x+lugar,me.y+me.col_y,[objectsn["grama"]],[me.inst_id])
            if(col.length>0){
                if(instances[col[0]].alive==true){
                    me.alive=true
                }
            }
        }
    }
},function(me){
    if(me.alive){
        let branquecido=mod(me.x,10)
        if(Math.floor(mod(me.x/10,2))==1){
            branquecido=10-branquecido
        }
        branquecido*=0.01
        draw_set_color(0.6+branquecido,0.9+branquecido,0.7+branquecido)
        draw_rect(me.x,me.y,me.x+1,me.y+3)
    }
},"grama")

create_object(function(me){
    for(let i=0; i<wwidth; i++){
        create_instance(objectsn["grama"],i,wheigth-altura_chao-1,2,3,{})
    }
},function(me){
    if(touch_started){
        create_instance(objectsn["cubo"],touch_start[0].clientX,touch_start[0].clientY,32,32,{})
    }
},function(me){
    draw_set_color(1,0.5,0)
    draw_rect(0,wheigth-altura_chao,wwidth,wheigth)
},"geral")

create_object(function(me){
    //fluid draw
    me.last_pos={x:me.x,y:me.y}
    me.positional=0
    
    me.dir={x:choose([-1,1]),y:choose([-1,1])}
},function(me){
    //fluid draw
    me.last_pos={x:me.x,y:me.y}
    me.positional=0
    let mova=[true,true]
    if(collision_rect(me.x+me.dir.x,me.y,me.x+me.col_x+me.dir.x,me.y+me.col_y,[objectsn["cubo"]],[me.inst_id]).length>0){
        me.dir.x=-me.dir.x
        mova[0]=false
    }
    if(collision_rect(me.x,me.y+me.dir.y,me.x+me.col_x,me.y+me.col_y+me.dir.y,[objectsn["cubo"]],[me.inst_id]).length>0){
        me.dir.y=-me.dir.y
        mova[1]=false
    }
    if(me.x+me.dir.x<0 || me.x+me.dir.x+me.col_x>wwidth){
        me.dir.x=-me.dir.x
        mova[0]=false
    }
    if(me.y+me.dir.y<0 || me.y+me.dir.y+me.col_y>wheigth-altura_chao){
        me.dir.y=-me.dir.y
        mova[1]=false
    }
    if(mova[0])me.x+=me.dir.x
    if(mova[1])me.y+=me.dir.y
    
    let col=collision_rect(me.x,me.y,me.x+me.col_x,me.y+me.col_y,[objectsn["grama"]],[me.inst_id])
    for(let i=0; i<col.length; i++){
        instances[i].alive=false
    }
},function(me){
    //fluid draw
    const bagulhau3=me.positional/17
    let pods_ant={
        x:me.last_pos.x*(1-bagulhau3)+me.x*bagulhau3,
        y:me.last_pos.y*(1-bagulhau3)+me.y*bagulhau3
    }
    me.positional+=delta
    const bagulhau=me.positional/17
    const piss={
        x:me.last_pos.x*(1-bagulhau)+me.x*bagulhau,
        y:me.last_pos.y*(1-bagulhau)+me.y*bagulhau
    }
    draw_set_color(1,0,0)
    draw_rect(piss.x,piss.y,piss.x+me.col_x,piss.y+me.col_y)
},"cubo")

rooms[0]={
    instances:[
        {obj_id:objectsn["geral"],x:32,y:32,col_x:32,col_y:32}
    ],clear_color:[0.3,0.7,1]
}

room_restart()