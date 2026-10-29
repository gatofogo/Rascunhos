const background_color=[0,0,0]
let draw_color=[1,1,1]
//iniciando gpu
const canva=document.getElementById("canva")
const ctx=canva.getContext("webgl")

const vsSource = `
            attribute vec2 aPosition;
            attribute vec3 aColor;
            varying vec3 vColor;
            void main() {
                vec2 temp=aPosition*2.0-1.0;
                temp.y=temp.y*-1.0;
                gl_Position = vec4(temp, 0.0, 1.0);
                vColor = aColor;
            }
        `;

// O Fragment Shader define a cor de cada pixel (fragmento)
const fsSource = `
            precision mediump float;
            varying vec3 vColor;
            void main() {
                gl_FragColor = vec4(vColor, 1.0);
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

const sprites={}

function load_image(path,sprite_name){
    const img=document.createElement("img")
    img.src=path
    img.style="display:none;"
    img_container.appendChild(img)
    sprites[sprite_name]=img
}
function draw_gpu_triangle(x1,y1,x2,y2,x3,y3,r,g,b){
    const triangleVertices = new Float32Array([
    x1, y1,   r, g, b, // Topo (Vermelho)
    x2, y2,   r, g, b, // Baixo Esquerda (Verde)
    x3, y3,   r, g, b  // Baixo Direita (Azul)
    ])
    const vertexBuffer=ctx.createBuffer()
    ctx.bindBuffer(ctx.ARRAY_BUFFER, vertexBuffer)
    ctx.bufferData(ctx.ARRAY_BUFFER, triangleVertices, ctx.STATIC_DRAW)
    
    // 4. Configuração dos Atributos (Conectando os dados ao Shader)
    const bytesPerFloat = Float32Array.BYTES_PER_ELEMENT;
    const stride = 5 * bytesPerFloat; // 2 floats para posição + 3 para cor

    // Atributo de Posição
    const aPositionLocation = ctx.getAttribLocation(shaderProgram, "aPosition");
    ctx.enableVertexAttribArray(aPositionLocation);
    ctx.vertexAttribPointer(aPositionLocation, 2, ctx.FLOAT, false, stride, 0);

    // Atributo de Cor
    const aColorLocation = ctx.getAttribLocation(shaderProgram, "aColor");
    ctx.enableVertexAttribArray(aColorLocation);
    ctx.vertexAttribPointer(aColorLocation, 3, ctx.FLOAT, false, stride, 2 * bytesPerFloat);

    // 5. Renderização (Desenho na Tela)
    ctx.clearColor(0.1, 0.1, 0.1, 1.0); // Cor de fundo do canvas (cinza escuro)
    ctx.clear(ctx.COLOR_BUFFER_BIT);
    ctx.drawArrays(ctx.TRIANGLE,0,3)
}
function draw_sprite(x,y,sprite){
    //ctx.fillRect(x,y,1,1)
    //ctx.drawImage(sprites[sprite],x,y)
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