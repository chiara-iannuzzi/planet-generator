uniform vec3 uAtmosphereColor;

varying vec3 vViewDirection;
varying vec3 vAtmosphereNormal;

void main()
{
    vec3 color = uAtmosphereColor;

    //Alpha
    float edgeAlpha = dot(vViewDirection, vAtmosphereNormal);
    edgeAlpha = smoothstep(0.0, 0.8, edgeAlpha);

    // Final color
    csm_FragColor = vec4(color, edgeAlpha);
    #include <tonemapping_fragment>
    #include <colorspace_fragment>
}