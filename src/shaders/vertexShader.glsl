varying vec2 vUv;
uniform vec2 uDelta;
float PI = 3.141592653589793238;

void main() {
  vUv = uv;
  vec3 newPosition = position;
  newPosition.x += sin(uv.y * PI) * uDelta.x * 0.1;
  newPosition.y += sin(uv.x * PI) * uDelta.y * 0.1;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
}
