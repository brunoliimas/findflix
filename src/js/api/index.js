const API_KEY = "342aa484";
const API_BASE_URL = "https://www.omdbapi.com/";

class Api {
  constructor() {
    this.searchCache = new Map();
    this.detailsCache = new Map();
  }

  async searchMovies(searchTerm) {
    const term = searchTerm.trim();

    if (!term) {
      return {
        Response: "False",
        Error: "O termo de pesquisa não pode estar vazio",
      };
    }

    if (this.searchCache.has(term)) {
      console.log(`Retornando pesquisa por "${term}" do cache.`);
      return this.searchCache.get(term);
    }

    try {
      const URL = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
        term
      )}`;
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();

      if (data.Response === "True") {
        this.searchCache.set(term, data);
      }

      return data;
    } catch (error) {
      console.error("Erro ao procurar filmes e séries:", error);

      return {
        Response: "False",
        Error: "Erro de rede. Tente novamente mais tarde.",
      };
    }
  }

  async getMovieDetails(imdbID) {
    if (!imdbID) {
      console.log(`Retornando detalhes para "${imdbID}" do cache.`);
      return this.detailsCache.get(imdbID);
    }

    try {
      const URL = `${API_BASE_URL}?apikey=${API_KEY}&i=${imdbID}`;
      const response = await fetch(URL);

      if (!response.ok) {
        throw new error(`HTTP error: status: ${response.status}`);
      }

      const data = await response.json();
      // console.log(data);

      if (data.Response === "True") {
        this.detailsCache.set(imdbID, data);
        return data;
      }
      return data;
    } catch (error) {
      console.error("Erro ao obter detalhes do filme:", error);
      return null;
    }
  }


  clearCaches(){
    this.searchCache.clear();
    this.detailsCache.clear();
    console.log("Caches foram limpos!!!");
    
  }
}

const omdbApi = new Api();
