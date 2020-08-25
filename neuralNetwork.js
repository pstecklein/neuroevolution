class NeuralNetwork {
  constructor(mod, iL, hL, oL) {
    if (mod instanceof tf.Sequential) {
      this.model = mod;
      this.inputs = iL;
      this.hidden_nodes = hL;
      this.outputs = oL;
    } else {
      this.inputs = mod;
      this.hidden_nodes = iL;
      this.outputs = hL;
      this.model = this.createModel();
    }
  }

  copy() {
    // tf tidy for storage cleanup
    return tf.tidy(() => {
      const copiedModel = this.createModel();
      const weights = this.model.getWeights();
      const copied_weights = [];
      for (let i = 0; i < weights.length; i++) {
        copied_weights[i] = weights[i].clone();
      }
      copiedModel.setWeights(copied_weights);
      return new NeuralNetwork(
        copiedModel,
        this.inputs,
        this.hidden_nodes,
        this.outputs
      );
    });
  }

  // mutation rate set in spacecraft.js
  mutate(rate) {
    tf.tidy(() => {
      const weights = this.model.getWeights();
      const mutation = [];
      for (let i = 0; i < weights.length; i++) {
        let tensor = weights[i];
        let shape = weights[i].shape;
        let data = tensor.dataSync().slice();
        for (let j = 0; j < data.length; j++) {
          if (Math.random() < rate) {
            let w = data[j];

            // mean of 0, SD of 1
            data[j] =
              w +
              Math.floor(
                Math.cos(2 * Math.PI * Math.random()) *
                  Math.sqrt(-2 * Math.log(Math.random()))
              );
          }
        }
        let newTensor = tf.tensor(data, shape);
        mutation[i] = newTensor;
      }
      this.model.setWeights(mutation);
    });
  }

  dispose() {
    this.model.dispose();
  }

  // predict for both neural networks
  predict(inputs) {
    return tf.tidy(() => {
      const xs = tf.tensor2d([inputs]);
      const ys = this.model.predict(xs);
      const outputs = ys.dataSync();
      // console.log(outputs);
      return outputs;
    });
  }

  createModel() {
    const model = tf.sequential();
    const hidden = tf.layers.dense({
      units: this.hidden_nodes,
      inputShape: [this.inputs],
      activation: "sigmoid"
    });
    model.add(hidden);
    // softmax for classification for outputs
    const out = tf.layers.dense({
      units: this.outputs,
      activation: "softmax"
    });
    model.add(out);
    return model;
  }
}
