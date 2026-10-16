const installed=new WeakSet();
// Zero-colour direct lights add exactly zero. Preserve the complete scene and
// lighting equations, but avoid their BRDF and out-of-range attenuation work.
export function installZeroLightWork(chunks,enabled=false){
 if(!enabled||installed.has(chunks))return false;
 const attenuation='float getDistanceAttenuation( const in float lightDistance, const in float cutoffDistance, const in float decayExponent ) {';
 const direct='RE_Direct( directLight, geometryPosition, geometryNormal, geometryViewDir, geometryClearcoatNormal, material, reflectedLight );';
 if(!chunks.lights_pars_begin?.includes(attenuation)||!chunks.lights_fragment_begin?.includes(direct))return false;
 chunks.lights_pars_begin=chunks.lights_pars_begin.replace(attenuation,attenuation+'\n if ( cutoffDistance > 0.0 && lightDistance >= cutoffDistance ) return 0.0;');
 chunks.lights_fragment_begin=chunks.lights_fragment_begin.replaceAll(direct,'if ( directLight.color != vec3( 0.0 ) ) '+direct);
 installed.add(chunks);return true;
}
