const background_color=[0,0,0,1]
let draw_color=[1,1,1]
//iniciando gpu
const canva=document.getElementById("canva")
const ctx=canva.getContext("webgl")

const vsSource = `
            attribute vec2 aPosition;
            attribute vec3 aColor;
            varying vec3 vColor;   
            attribute vec2 aTexCoord;
            varying vec2 vTexCoord;
            void main() {
                vec2 temp=aPosition*2.0-1.0;
                temp.y=temp.y*-1.0;
                gl_Position = vec4(temp, 0.0, 1.0);
                vColor = aColor;
                vTexCoord = aTexCoord;
            }
        `;

// O Fragment Shader define a cor de cada pixel (fragmento)
const fsSource = `
            precision mediump float;
            varying vec3 vColor;
            varying vec2 vTexCoord;

            uniform sampler2D uSampler;
            uniform bool uUseTexture;

            void main() {
                if(uUseTexture){
                    gl_FragColor = texture2D(uSampler, vTexCoord);
                }else{
                    gl_FragColor = vec4(vColor, 1.0);
                }
            }
        `;

function createShader(ctx,type,source){
    const shader = ctx.createShader(type);
    ctx.shaderSource(shader, source);
    ctx.compileShader(shader);
    if (!ctx.getShaderParameter(shader, ctx.COMPILE_STATUS)) {
        console.error("Erro oq sera q é?:", ctx.getShaderInfoLog(shader))
        ctx.deleteShader(shader)
        return null
    }
    return shader
}

const vertexShader=createShader(ctx, ctx.VERTEX_SHADER, vsSource)
const fragmentShader=createShader(ctx, ctx.FRAGMENT_SHADER, fsSource)
const shaderProgram=ctx.createProgram()
ctx.attachShader(shaderProgram, vertexShader)
ctx.attachShader(shaderProgram, fragmentShader)
ctx.linkProgram(shaderProgram)
ctx.useProgram(shaderProgram)
const img_container=document.getElementById("sprites")

const vertexBuffer=ctx.createBuffer()
ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer)

// 4. Configuração dos Atributos (Conectando os dados ao Shader)
const bytesPerFloat = Float32Array.BYTES_PER_ELEMENT;
const stride = 5 * bytesPerFloat; // 2 floats para posição + 3 para cor

const aPositionLocation = ctx.getAttribLocation(shaderProgram, "aPosition")
ctx.enableVertexAttribArray(aPositionLocation)
ctx.vertexAttribPointer(aPositionLocation, 2, ctx.FLOAT, false, stride, 0)

const aColorLocation = ctx.getAttribLocation(shaderProgram, "aColor")
ctx.enableVertexAttribArray(aColorLocation)
ctx.vertexAttribPointer(aColorLocation, 3, ctx.FLOAT, false, stride, 2 * bytesPerFloat)

const aTexCoordLocation = ctx.getAttribLocation(shaderProgram, "aTexCoord")
ctx.enableVertexAttribArray(aTexCoordLocation)
ctx.vertexAttribPointer(aTexCoordLocation, 2, ctx.FLOAT, false, stride, 5 * bytesPerFloat)

const sprites={}

function load_image(path,sprite_name){
    const img=document.createElement("img")
    img.src="imagems/"+path
    img.style="display:none;"
    img_container.appendChild(img)
    img.onload = function(){
        const texture=ctx.createTexture();
        ctx.bindTexture(ctx.TEXTURE_2D,texture)
        ctx.texImage2D(ctx.TEXTURE_2D,0,ctx.RGBA,ctx.UNSIGNED_BYTE, img)
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_S, ctx.CLAMP_TO_EDGE)
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_WRAP_T, ctx.CLAMP_TO_EDGE)
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MIN_FILTER, ctx.NEAREST)
        ctx.texParameteri(ctx.TEXTURE_2D, ctx.TEXTURE_MAG_FILTER, ctx.NEAREST)

        sprites[sprite_name]={
            texture: texture,
            width: img.width,
            height: img.height
        }

        ctx.bindTexture(ctx.TEXTURE_2D, null);
    }
}
function draw_gpu_triangle(x1,y1,x2,y2,x3,y3,r,g,b){
    const triangleVertices = new Float32Array([
    x1, y1,   r, g, b, 0, 0,
    x2, y2,   r, g, b, 0, 0,
    x3, y3,   r, g, b, 0, 0
    ])

    ctx.bufferData(ctx.ARRAY_BUFFER, triangleVertices, ctx.DYNAMIC_DRAW)
    ctx.drawArrays(ctx.TRIANGLES,0,3)
}
function clear_all(){
    ctx.clearColor(background_color[0],background_color[1],background_color[2],background_color[3]);
    ctx.clear(ctx.COLOR_BUFFER_BIT);
}
function draw_sprite(x,y,sprite_name){
    const sprite=sprites[sprite_name]
    if(!sprite)return
    let x1=x
    let y1=y
    let x2=x+sprite.width
    let y2=y+sprite.height

    let gpux1 = x1 / 432
    let gpuy1 = y1 / 288
    let gpux2 = x2 / 432
    let gpuy2 = y2 / 288

    const vertices = new Float32Array([
        gpux1, gpuy1,      1, 1, 1,      0.0, 0.0,
        gpux1, gpuy2,      1, 1, 1,      0.0, 1.0,
        gpux2, gpuy1,      1, 1, 1,      1.0, 0.0,

        gpux2, gpuy2,      1, 1, 1,      1.0, 1.0,
        gpux1, gpuy2,      1, 1, 1,      0.0, 1.0,
        gpux2, gpuy1,      1, 1, 1,      1.0, 0.0,
    ]);

    const useTexLocation = ctx.getUniformLocation(shaderProgram, "uUseTexture")
    ctx.uniform1i(useTexLocation, 1)

    ctx.activeTexture(ctx.TEXTURE0)
    ctx.bindTexture(ctx.TEXTURE_2D, sprite.texture)
    const samplerLocation = ctx.getUniformLocation(shaderProgram, "uSampler")
    ctx.uniform1i(samplerLocation, 0)

    ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.DYNAMIC_DRAW)
    ctx.drawArrays(ctx.TRIANGLES, 0, 6)
}   

function draw_sprite_scaled(x,y,width,height,sprite_name){
    const sprite=sprites[sprite_name]
    if(!sprite)return
    let x1=x
    let y1=y
    let x2=x+sprite.width*width
    let y2=y+sprite.height*height

    let gpux1 = x1 / 432
    let gpuy1 = y1 / 288
    let gpux2 = x2 / 432
    let gpuy2 = y2 / 288

    const vertices = new Float32Array([
        gpux1, gpuy1,      1, 1, 1,      0.0, 0.0,
        gpux1, gpuy2,      1, 1, 1,      0.0, 1.0,
        gpux2, gpuy1,      1, 1, 1,      1.0, 0.0,

        gpux2, gpuy2,      1, 1, 1,      1.0, 1.0,
        gpux1, gpuy2,      1, 1, 1,      0.0, 1.0,
        gpux2, gpuy1,      1, 1, 1,      1.0, 0.0,
    ]);

    const useTexLocation = ctx.getUniformLocation(shaderProgram, "uUseTexture")
    ctx.uniform1i(useTexLocation, 1)

    ctx.activeTexture(ctx.TEXTURE0)
    ctx.bindTexture(ctx.TEXTURE_2D, sprite.texture)
    const samplerLocation = ctx.getUniformLocation(shaderProgram, "uSampler")
    ctx.uniform1i(samplerLocation, 0)

    ctx.bufferData(ctx.ARRAY_BUFFER, vertices, ctx.DYNAMIC_DRAW)
    ctx.drawArrays(ctx.TRIANGLES, 0, 6)
}   
function draw_rect(x1,y1,x2,y2){
    let gpux1=x1/432
    let gpuy1=y1/288
    let gpux2=x2/432
    let gpuy2=y2/288
    draw_gpu_triangle(gpux1,gpuy1,gpux1,gpuy2,gpux2,gpuy1,draw_color[0],draw_color[1],draw_color[2])
    draw_gpu_triangle(gpux2,gpuy2,gpux1,gpuy2,gpux2,gpuy1,draw_color[0],draw_color[1],draw_color[2])
}
function draw_set_color(r,g,b){
    draw_color=[r,g,b]
}