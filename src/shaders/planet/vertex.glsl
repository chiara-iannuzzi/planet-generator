uniform float uTime;
uniform float uStrength;
uniform float uPositionFrequency;
uniform float uTimeFrequency;

uniform float uWaterQuantity;

uniform float uWarpedStrength;
uniform float uWarpedPositionFrequency;
uniform float uWarpedTimeFrequency;

attribute vec4 tangent;

varying float vWobble;
varying float vUpDot;

#include ../includes/simplexNoise4d.glsl

float getWobble(vec3 position){
    vec3 warpedPosition = position;
    // warpedPosition += simplexNoise4d(vec4(
    //     position * uWarpedPositionFrequency,
    //     uTime * 0.01
    // )) * uWarpedStrength;

    float wobble = 0.0;
    wobble += simplexNoise4d(vec4(warpedPosition * uPositionFrequency, uTime * 0.01));
    wobble += simplexNoise4d(vec4(warpedPosition * uPositionFrequency * 2.0, uTime * 0.01)) / 4.0;
    wobble += simplexNoise4d(vec4(warpedPosition * uPositionFrequency * 4.0, uTime * 0.01)) / 8.0;

    float wobbleSign = sign(wobble);

    wobble = pow(abs(wobble), 2.0) * wobbleSign;
    wobble *= uStrength;

    return wobble;
}

void main(){
    vec3 biTangent = cross(normal, tangent.xyz);

    // Neighbours
    float shift = 0.01;
    
    vec3 positionA = csm_Position + tangent.xyz * shift;
    vec3 positionB = csm_Position + biTangent * shift;
    
    float wobble = getWobble(csm_Position);
    wobble -= uWaterQuantity;
    csm_Position += wobble * normal;
    positionA += getWobble(positionA) * normal;
    positionB += getWobble(positionB) * normal;

    vec3 toA = normalize(positionA - csm_Position);
    vec3 toB = normalize(positionB - csm_Position);
    csm_Normal = cross(toA, toB);

    vWobble = wobble / uStrength * 2.0;
    vUpDot = dot(csm_Normal, vec3(wobble));
}