uniform float uModValue;
uniform vec3 uRingColor;

varying vec3 vPosition;
varying vec2 vUv;

void main(){
    float distanceToCenter = length(vUv - vec2(0.5));

    if(distanceToCenter > 0.5 || distanceToCenter < 0.35 )
        discard;

    distanceToCenter = smoothstep(0.0, 0.8, mod(length(vUv - vec2(0.5)), uModValue));

    csm_FragColor = vec4(uRingColor, distanceToCenter * ( 10.0 / uModValue));
}