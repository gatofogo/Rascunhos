create_object(function(me){
    load_image("seta_direita.png","player")
    me.direcao=1
    me.veloh=0
},function(me){
    let veloasd=keyboard_down["d"]-keyboard_down["a"]
    if(veloasd!=0){
        me.x+=veloasd*2
        me.direcao=veloasd
    }
    if(collision_rect(me.x,me.y+1,me.x+me.col_x,me.y+me.col_y+1,[1],[0]).length>0){
        if(keyboard_pressed[" "]){
            me.veloh=-7
        }
    }else{
        me.veloh+=0.5
    }
    if(collision_rect(me.x,me.y+me.veloh,me.x+me.col_x,me.y+me.col_y+me.veloh,[1],[0]).length>0){
        me.veloh=0
    }
    me.y+=me.veloh
},function(me){
    draw_set_color(0,1,0)
    draw_rect(me.x,me.y,me.x+me.col_x,me.y+me.col_y)
    draw_sprite_scaled(me.x+32*(me.direcao<0),me.y,me.direcao,1,"player")
})

create_object(function(me){

},function(me){

},function(me){
    draw_set_color(1,0,0)
    draw_rect(me.x,me.y,me.x+me.col_x,me.y+me.col_y)
})

rooms[0]={
    instances:[
        {obj_id:0,x:0,y:0,col_x:32,col_y:32},
        {obj_id:1,x:0,y:200,col_x:432,col_y:88}
    ],clear_color:[0,0,0]
}

room_restart()