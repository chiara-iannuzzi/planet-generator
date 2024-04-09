uniform float uModValue;
uniform vec3 uRingColor;
uniform float uExternalRadius;
uniform float uInternalRadius;

varying vec3 vPosition;
varying vec2 vUv;

void main(){
    float distanceToCenter = length(vUv - vec2(0.5));

    if(distanceToCenter > uExternalRadius || distanceToCenter < uInternalRadius )
        discard;

    distanceToCenter = smoothstep(0.0, 0.8, mod(length(vUv - vec2(0.5)), uModValue));

    csm_DiffuseColor = vec4(uRingColor, distanceToCenter * ( 10.0 / uModValue));
}