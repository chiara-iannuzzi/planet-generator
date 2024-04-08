uniform vec3 uColorWaterDeep;
uniform vec3 uColorWaterSurface;
uniform vec3 uColorSand;
uniform vec3 uColorGrass;
uniform vec3 uColorSnow;
uniform vec3 uColorRock;
uniform float uTime;

varying float vUpDot;
varying float vWobble;

#include ../includes/simplexNoise4d.glsl;

void main(){
    //Color
    vec3 color = vec3(1.0);

    //Water
    float surfaceWaterMix = smoothstep(-1.0, -0.1, vWobble);

    color = mix(uColorWaterDeep, uColorWaterSurface, surfaceWaterMix);

    //Sand
    float sandMix = step(-0.1, vWobble);
    color = mix(color, uColorSand, sandMix);

    float grassMix = step(-0.06, vWobble);
    color = mix(color, uColorGrass, grassMix);

    float rockMix = vUpDot * 2.0;
    rockMix = 1.0 - step(0.8, rockMix);
    rockMix *= step(0.2, vWobble);
    color = mix(color, uColorRock, rockMix);

    float snowMix = step(0.8, vWobble);
    color = mix(color, uColorSnow, snowMix);

    //Final Color
    csm_DiffuseColor = vec4(color, 1.0);
}