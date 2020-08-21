function nextGeneration() {
  console.log("next generation");
  normalized_fitness();
  for (let i = 0; i < 100; i++) {
    spacecrafts[i] = select();
  }
  for (let i = 0; i < spacecraftPool.length; i++) {
    spacecraftPool[i].dispose();
  }
  spacecraftPool = [];
}

function select() {
  let i = 0;
  let r = Math.random();
  while (r > 0) {
    r = r - spacecraftPool[i].fitness_normalized;
    i++;
  }
  i--;
  let craft = spacecraftPool[i];
  let newCraft = new Spacecraft(craft.brain);
  newCraft.mutate();
  return newCraft;
}

function normalized_fitness() {
  let total = 0;
  for (let craft of spacecraftPool) {
    total += craft.score;
  }
  for (let craft of spacecraftPool) {
    craft.fitness_normalized = craft.score / total;
  }
}
