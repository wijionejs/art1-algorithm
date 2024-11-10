import config from "./config.js";

class Cluster {
  #featureVectors = [];
  vectorPrototype;
  sumVector;

  constructor(featureVector) {
    this.vectorPrototype = featureVector.slice();
    this.sumVector = featureVector.slice();
    this.#featureVectors.push(featureVector);
  }

  addFeatureVector(featureVector) {
    this.#featureVectors.push(featureVector);
    this.#recalculateVectorPrototype();
    this.#recalculateSumVector();
  }
  
  #recalculateSumVector() {
    let newSumVector = new Array(config.items.length).fill(0);

    for (let i = 0; i < this.#featureVectors.length; i++) {
      const vector = this.#featureVectors[i];
      newSumVector = newSumVector.map((value, idx) => value + vector[idx]);
    }

    this.sumVector = newSumVector;
  }

  #recalculateVectorPrototype() {
    this.vectorPrototype = this.#featureVectors[0];
    
    for (let i = 1; i < this.#featureVectors.length; i++) {
      const vector = this.#featureVectors[i];
      this.vectorPrototype = this.vectorPrototype.map((bit, idx) => bit & vector[idx]);
    }
  }
}

export default Cluster;