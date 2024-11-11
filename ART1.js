import Cluster from "./Cluster.js";
import config from "./config.js";
import initialData from "./data.js";

export default class ART1 {
  #clusters = [];
  #vectorLength = config.items.length; // d parameter

  constructor() {
    for (const vector of initialData) {
      this.clusterizeFeatureVector(vector)
    }
  }

  clusterizeFeatureVector(featureVector) {
    if (featureVector.length !== this.#vectorLength) {
      throw new Error(`Feature vector length doesn't match expected vector length, which is ${this.#vectorLength}`)
    }

    for (const cluster of this.#clusters) {
      if (this.#matchesCluster(featureVector, cluster)) {
        cluster.addFeatureVector(featureVector);
        return;
      }
    }

    this.createNewCluster(featureVector);
  }

  #matchesCluster(featureVector, cluster) {
    return this.#testSimilarity(featureVector, cluster.vectorPrototype) &&
     this.#testVigilance(featureVector, cluster.vectorPrototype);
  }

  giveRecommendation(featureVector) {
    if (featureVector.length !== this.#vectorLength) {
      throw new Error(`Feature vector length doesn't match expected vector length, which is ${this.#vectorLength}`)
    }

    const cluster = this.#clusters.find(cluster => this.#matchesCluster(featureVector, cluster));

    if (!cluster) return null;

    let itemIdx;
    let biggestNumber = 0;

    for (let i = 0; i < featureVector.length; i++) {
      if (featureVector[i] === 0 && cluster.sumVector[i] > biggestNumber) {
        itemIdx = i;
      }
    }

    if (typeof itemIdx !== "number") return  null;
    return config.items[itemIdx];
  }

  createNewCluster(featureVector) {
    this.#clusters.push(new Cluster(featureVector));
  }

  #testSimilarity(featureVector, vectorPrototype) {
    const bitwiseAnd = this.#bitwiseAnd(vectorPrototype, featureVector);
    const weightOfBitwiseAnd = this.#getVectorWeigth(bitwiseAnd);
    const weightOfVectorPrototype = this.#getVectorWeigth(vectorPrototype);
    const weightOfeatureVector = this.#getVectorWeigth(featureVector);

    return (weightOfBitwiseAnd / (config.similarity + weightOfVectorPrototype)) > (weightOfeatureVector / (config.similarity + this.#vectorLength));
  }

  #testVigilance(featureVector, vectorPrototype) {
    const bitwiseAnd = this.#bitwiseAnd(vectorPrototype, featureVector);
    const weightOfBitwiseAnd = this.#getVectorWeigth(bitwiseAnd);
    const weightOfeatureVector = this.#getVectorWeigth(featureVector);

    return (weightOfBitwiseAnd / weightOfeatureVector) >= config.vigilance;
  }

  #bitwiseAnd(vectorA, vectorB) {
    return vectorA.map((bit, idx) => bit & vectorB[idx])
  }

  #getVectorWeigth(vector) {
    return vector.filter(bit => Boolean(bit)).length;
  }
}