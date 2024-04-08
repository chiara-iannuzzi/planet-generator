varying vec3 vViewDirection;
varying vec3 vAtmosphereNormal;

void main()
{
    // Position
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * viewMatrix * modelPosition;

    // Model normal
    vec3 modelNormal = (modelMatrix * vec4(csm_Normal, 0.0)).xyz;

    // Varyings
    vec3 vNormal = modelNormal;
    vec3 vPosition = modelPosition.xyz;

    vViewDirection = normalize(vPosition - cameraPosition);
    vAtmosphereNormal = normalize(vNormal);
}