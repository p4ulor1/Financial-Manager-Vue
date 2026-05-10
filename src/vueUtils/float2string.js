/**
 * 
 * @param {Number} float 
 * @returns {String} 
 */
export function float2string(float) {
  return float.toFixed(2).toString().replace(/\./, ',');
}