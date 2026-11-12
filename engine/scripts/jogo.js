create_object(function(me){
    if(!sprite_exist("player"))load_image("seta_direita.png","player")
    me.direcao=1
    me.veloh=0
    me.diff=0
    me.velov=0
    me.groundbuffer=0
    me.jumpbuffer=0
    me.velov2=0
},function(me){
    me.velov2-=Math.sign(me.velov2)*0.5
    me.diff=0
    let veloasd=keyboard_down["d"]-keyboard_down["a"]
    if(touched)veloasd=Math.sign(touch[0].clientX-216)
    if(collision_rect(me.x+veloasd,me.y,me.x+me.col_x+veloasd,me.y+me.col_y,[objectsn.colisao,,objectsn.player],[me.inst_id]).length>0){
        veloasd=0
    }
    me.velov=veloasd
    if(veloasd!=0){
        me.direcao=veloasd
    }
    if(me.jumpbuffer>0)me.jumpbuffer-=1
    if(me.groundbuffer>0)me.groundbuffer-=1
    if(keyboard_pressed[" "])me.jumpbuffer=10
    if(touch.length>=2)me.jumpbuffer=10
    if(collision_rect(me.x,me.y+1,me.x+me.col_x,me.y+me.col_y+1,[objectsn.colisao,objectsn.player],[me.inst_id]).length>0){
        me.groundbuffer=10
    }else{
        me.veloh+=0.5
    }
    if(me.jumpbuffer>0 && me.groundbuffer>0){
        me.veloh=-7
        me.jumpbuffer=0
        me.groundbuffer=0
        create_instance(objectsn.player,0,0,32,32,{})
    }
    if(collision_rect(me.x,me.y+me.veloh,me.x+me.col_x,me.y+me.col_y+me.veloh,[objectsn.colisao,objectsn.player],[me.inst_id]).length>0){
        me.veloh=0
    }
    if(collision_rect(me.x+me.velov2,me.y,me.x+me.col_x+me.velov2,me.y+me.col_y,[objectsn.colisao,objectsn.player],[me.inst_id]).length>0){
        me.velov2=0
    }
    me.x+=veloasd*2
    me.x+=me.velov2
    me.y+=me.veloh
},function(me){
    //fiz um sisitema muito desnecesario, mas ta ai
    me.diff+=delta*max_fps//max fps é quantos mili segundos dura 1 frame
    let objetivo={x:me.velov,y:me.veloh}
    //draw_set_color(0,1,0)
    //draw_rect(me.x,me.y,me.x+me.col_x,me.y+me.col_y)
    draw_sprite_scaled(me.x+me.col_x*(me.direcao<0)+objetivo.x*me.diff,me.y+objetivo.y*me.diff,me.direcao,1,"player")
},"player")

create_object(function(me){

},function(me){

},function(me){
    draw_set_color(1,0,0)
    draw_rect(me.x,me.y,me.x+me.col_x,me.y+me.col_y)
},"colisao")

rooms[0]={
    instances:[
        {obj_id:0,x:0,y:0,col_x:32,col_y:32},
        {obj_id:0,x:100,y:0,col_x:32,col_y:32},
        {obj_id:1,x:0,y:200,col_x:432,col_y:88},
        {obj_id:1,x:100,y:175,col_x:64,col_y:25},
        {obj_id:1,x:400,y:0,col_x:32,col_y:288}
    ],clear_color:[0,0,0]
}

room_restart()