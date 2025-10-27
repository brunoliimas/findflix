class HandleSearch {
  constructor() {
    this.loadingSpinner = document.getElementById("loadingSpinner");
    this.searchIcon = document.getElementById("searchIcon");
    this.messageContainer = document.getElementById("messageContainer");
    this.resultsGrid = document.getElementById("resultsGrid");
    this.searchInput = document.getElementById("searchInput");
    this.currentSearchTerm = "";
    this.DEBOUNCE_DELAY = 500;

    this.init();
  }

  init() {
    const debounceSearch = debounce((searchTerm) => {
      this.currentSearchTerm = searchTerm;
      this.performSearch(searchTerm);
    }, this.DEBOUNCE_DELAY);

    this.searchInput.addEventListener("input", (e) => {
      // console.log("Digitando:", e.target.value);
      debounceSearch(e.target.value);
    });

    document.addEventListener("click", (e) => {
      if (window.innerWidth <= 768 && !e.target.closest(".movie-card")) {
        document
          .querySelectorAll(".movie-card.show-details")
          .forEach((card) => {
            card.classList.remove("show-details");
          });
      }
    });

    this.showMessage("Digite o nome de um filme ou série para começar a busca");
  }

  async performSearch(searchTerm) {
    const term = searchTerm.trim();
    // console.log("Buscando por:", term);

    if (!term) {
      // console.log("Campo de busca vazio");
      this.clearResults();
      this.showLoading(false);
      this.showMessage(
        "Digite o nome de um filme ou serie para começar a busca"
      );
      return;
    }
    try {
      this.showLoading(true);
      // console.log("Chamando API...");
      const data = await omdbApi.searchMovies(term);

      // console.log("Retorno da API:", data);

      if (data.Response === "True") {
        this.displayResults(data.Search);
        this.showMessage("");
      } else {
        // console.warn("Nenhum resultado:", data.Error);
        this.clearResults();
        this.showMessage(data.Error || "Nenhum resultado encontrado 😭");
      }
    } catch (error) {
      // console.error("Erro na busca:", error);
      // console.error("Search error", error);
      this.showMessage(
        "Erro ao buscar filmes e series. Tente novamente",
        "error"
      );
    } finally {
      this.showLoading(false);
    }
  }

  showMessage(message, type = "") {
    if (!message) {
      this.messageContainer.innerHTML = "";
      return;
    }

    this.messageContainer.innerHTML = `
    <div class="message${type === "error" ? "error-message" : ""}">
        ${message}
    </div>
    `;
  }

  showLoading(isLoading) {
    if (isLoading) {
      this.loadingSpinner.classList.add("active");
      this.searchIcon.style.display = "none";
    } else {
      this.loadingSpinner.classList.remove("active");
      this.searchIcon.style.display = "flex"
    }
  }

  clearResults() {
    this.resultsGrid.innerHTML = "";
  }

  displayResults(movies) {
    this.resultsGrid.innerHTML = "";
    // console.log("Renderizando cards:", movies.length);

    movies.forEach((movie) => {
      const card = MovieCard.create(movie);
      this.resultsGrid.appendChild(card);
    });
  }
}
