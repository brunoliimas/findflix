const testAPI = new Api();

async function executarTeste() {
  console.log("Buscando filmes para teste...");

  const resultados = await testAPI.searchMovies("louca");

  console.log("EBAAAA! Resultados recebidos:");
  console.log(resultados);
}

executarTeste();
