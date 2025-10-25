const testAPI = new Api();

async function executarTeste() {
  console.log("Buscando filmes para teste...");

  const resultados = await testAPI.searchMovies("louca");
  const detatlhes = await testAPI.getMovieDetails("tt0192968");

  console.log("EBAAAA! Resultados recebidos:");
  // console.log(resultados);
  console.log(detatlhes);
}

executarTeste();
