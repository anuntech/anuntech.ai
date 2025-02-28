// src/utils/similarity.js
export function dot(a, b) {
    return a.reduce((sum, val, i) => sum + val * b[i], 0);
  }
  
  export function norm(a) {
    return Math.sqrt(a.reduce((sum, val) => sum + val * val, 0));
  }
  
  export function cosineSimilarity(a, b) {
    return dot(a, b) / (norm(a) * norm(b));
  }
  