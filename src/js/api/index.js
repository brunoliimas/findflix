let API_KEY = localStorage.getItem("findflix-api-key") || "";
const API_BASE_URL = "https://www.omdbapi.com/";

class Api {
  constructor() {
    this.searchCache = new Map();
    this.detailsCache = new Map();
    this.apiKey = API_KEY;
  }

  setApiKey(key) {
    this.apiKey = key;
    API_KEY = key;
  }

  getApiKey() {
    return this.apiKey || API_KEY;
  }

  async searchMovies(searchTerm) {
    const term = searchTerm.trim();

    if (!term) {
      return {
        Response: "False",
        Error: "O termo de pesquisa não pode estar vazio",
      };
    }

    const currentApiKey = this.getApiKey();
    if (!currentApiKey) {
      return {
        Response: "False",
        Error: "API Key não configurada. Por favor, configure sua API key.",
      };
    }

    if (this.searchCache.has(term)) {
      // console.log(`Retornando pesquisa por "${term}" do cache.`);
      return this.searchCache.get(term);
    }

    try {
      const URL = `${API_BASE_URL}?apikey=${currentApiKey}&s=${encodeURIComponent(
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
      // console.error("Erro ao procurar filmes e séries:", error);

      return {
        Response: "False",
        Error: "Erro de rede. Tente novamente mais tarde.",
      };
    }
  }

  async getMovieDetails(imdbID) {
    if (!imdbID) {
      return null;
    }

    const currentApiKey = this.getApiKey();
    if (!currentApiKey) {
      // console.error("API Key não configurada");
      return null;
    }

    if (this.detailsCache.has(imdbID)) {
      // console.log(`Retornando detalhes para "${imdbID}" do cache.`);
      return this.detailsCache.get(imdbID);
    }

    try {
      const URL = `${API_BASE_URL}?apikey=${currentApiKey}&i=${imdbID}`;
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
      // console.error("Erro ao obter detalhes do filme:", error);
      return null;
    }
  }

  clearCaches() {
    this.searchCache.clear();
    this.detailsCache.clear();
    // console.log("Caches foram limpos!!!");
  }
}

const omdbApi = new Api();

window.omdbApi = omdbApi;
window.API_KEY = API_KEY;