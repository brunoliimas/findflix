const API_KEY = "342aa484";
const API_BASE_URL = "https://www.omdbapi.com/";

class Api {
  constructor() {
    this.moviesCache = new Map();
  }
  async searchMovies(searchTerm) {
    if (!searchTerm.trim()) {
      return {
        Response: "False",
        Error: "O termo de pesquisa não pode estar vazio",
      };
    }

    try {
      const URL = `${API_BASE_URL}?apikey=${API_KEY}&s=${encodeURIComponent(
        searchTerm
      )}`;
      const response = await fetch(URL);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
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
    if(this.detailsCache.has(imdbID)){
      return this.detailsCache.get(imdbID)
    }


    try {
      const url = `${API_BASE_URL}?apikey=${API_KEY}&i=${imdbID}`;
      const response = await fetch(url);

      if (!response.ok) {
        throw new error(`HTTP error: status: ${response.status}`);
      }

      const data = await response.json();
      console.log(data);

      if(data.Response === 'True'){
        this.detailsCache.set(imdbID, data);
        return data;
      }

      return null;
    } catch (error) {
      console.error("Erro ao obter detalhes do filme:", error);
      return null;
    }
  }
}

const api = new Api();
