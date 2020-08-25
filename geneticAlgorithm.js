function nextGeneration() {
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
  let place = Math.random();
  while (place > 0) {
    place = place - spacecraftPool[i].fitness_normalized;
    i++;
  }
  i--;
  let newCraft = new Spacecraft(spacecraftPool[i].brain);
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
