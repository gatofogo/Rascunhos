create_object(function(me){
    me.last_pos={x:me.x,y:me.y}
    me.positional=0
},function(me){
    me.last_pos={x:me.x,y:me.y}
    me.positional=0
    if(touch.length>0){
        me.x=touch[0].clientX
        me.y=touch[0].clientY
    }
},function(me){
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
},"colisao")

rooms[0]={
    instances:[
        {obj_id:0,x:32,y:32,col_x:32,col_y:32}
    ],clear_color:[0,0,0]
}

room_restart()