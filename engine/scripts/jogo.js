create_object(function(me){

},function(me){

},function(me){
    draw_set_color(1,0,0)
    draw_rect(me.x,me.y,me.x+me.col_x,me.y+me.col_y)
},"colisao")

rooms[0]={
    instances:[
        {obj_id:0,x:32,y:32,col_x:32,col_y:32}
    ],clear_color:[0,0,0]
}

room_restart()