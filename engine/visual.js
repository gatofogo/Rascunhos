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
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Exemplo WebGL - Triângulo</title>
    <style>
        body {
            margin: 0;
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            background-color: #1a1a1a;
        }
        canvas {
            border: 2px solid #444;
            box-shadow: 0 0 20px rgba(0,0,0,0.5);
        }
    </style>
</head>
<body>

    <canvas id="glCanvas" width="500" height="500"></canvas>

    <script>
        // 1. Inicialização do Contexto WebGL
        const canvas = document.querySelector("#glCanvas");
        const gl = canvas.getContext("webgl");

        if (!gl) {
            alert("WebGL não é suportado pelo seu navegador!");
            throw new Error("WebGL não suportado");
        }

        // 2. Definição dos Shaders (Vertex Shader e Fragment Shader)
        // O Vertex Shader define a posição dos vértices
        const vsSource = `
            attribute vec2 aPosition;
            attribute vec3 aColor;
            varying vec3 vColor;
            void main() {
                gl_Position = vec4(aPosition, 0.0, 1.0);
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

        // Função auxiliar para compilar os shaders
        function createShader(gl, type, source) {
            const shader = gl.createShader(type);
            gl.shaderSource(shader, source);
            gl.compileShader(shader);
            if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
                console.error("Erro ao compilar shader:", gl.getShaderInfoLog(shader));
                gl.deleteShader(shader);
                return null;
            }
            return shader;
        }

        const vertexShader = createShader(gl, gl.VERTEX_SHADER, vsSource);
        const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fsSource);

        // Criando e ligando o Programa Shader
        const shaderProgram = gl.createProgram();
        gl.attachShader(shaderProgram, vertexShader);
        gl.attachShader(shaderProgram, fragmentShader);
        gl.linkProgram(shaderProgram);

        if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
            console.error("Erro ao iniciar o programa shader:", gl.getProgramInfoLog(shaderProgram));
        }

        gl.useProgram(shaderProgram);

        // 3. Criação dos Dados da Geometria (Triângulo com posições e cores)
        // Cada vértice possui: X, Y (posição) e R, G, B (cor)
        const triangleVertices = new Float32Array([
             0.0,  0.5,   1.0, 0.0, 0.0, // Topo (Vermelho)
            -0.5, -0.5,   0.0, 1.0, 0.0, // Baixo Esquerda (Verde)
             0.5, -0.5,   0.0, 0.0, 1.0  // Baixo Direita (Azul)
        ]);

        const vertexBuffer = gl.createBuffer();
        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.bufferData(gl.ARRAY_BUFFER, triangleVertices, gl.STATIC_DRAW);

        // 4. Configuração dos Atributos (Conectando os dados ao Shader)
        const bytesPerFloat = Float32Array.BYTES_PER_ELEMENT;
        const stride = 5 * bytesPerFloat; // 2 floats para posição + 3 para cor

        // Atributo de Posição
        const aPositionLocation = gl.getAttribLocation(shaderProgram, "aPosition");
        gl.enableVertexAttribArray(aPositionLocation);
        gl.vertexAttribPointer(aPositionLocation, 2, gl.FLOAT, false, stride, 0);

        // Atributo de Cor
        const aColorLocation = gl.getAttribLocation(shaderProgram, "aColor");
        gl.enableVertexAttribArray(aColorLocation);
        gl.vertexAttribPointer(aColorLocation, 3, gl.FLOAT, false, stride, 2 * bytesPerFloat);

        // 5. Renderização (Desenho na Tela)
        gl.clearColor(0.1, 0.1, 0.1, 1.0); // Cor de fundo do canvas (cinza escuro)
        gl.clear(gl.COLOR_BUFFER_BIT);

        // Desenha o triângulo usando os 3 vértices
        gl.drawArrays(gl.TRIANGLES, 0, 3);
    </script>

</body>
</html>
*/
