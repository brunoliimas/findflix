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
}

const api = new Api();
