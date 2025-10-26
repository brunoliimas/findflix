class MovieCard {
  static create(movie) {
    const card = document.createElement("div");
    card.className = "movie-card";
    card.dataset.imdbid = movie.imdbID;

    const posterUrl = movie.Poster !== "N/A" ? movie.Poster : null;

    card.innerHTML = `
        <div class="movie-card__poster">
            ${
              posterUrl
                ? `<img src="${posterUrl}" alt="${this.scapeHtml(
                    movie.Title
                  )}" loading="lazy" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';">
                  <div class="poster_placeholder" style="display:none;">
                    <i class="ph ph-image-broken"></i>
                  </div>
                `
                : '<div class="poster_placeholder"><i class="ph ph-image-broken"></i></div>'
            }
        </div>
        <div class="movie-card__infos">
            <h3 class="movie-card__title">${this.scapeHtml(movie.Title)}</h3>
            ${
              movie.Year !== "N/A"
                ? `<div class="movie-card__year">${movie.Year}</div>`
                : ""
            }
            <span class="movie-card__type">${movie.Type}</span>
        </div>
        <div class="movie-card__overlay">
            <div class="load-details">Carregando detalhes...</div>
        </div>
    `;

    this.attachEvents(card, movie.imdbID);

    return card;
  }

  static attachEvents(card, imdbID) {
    // Desktop
    card.addEventListener("mouseenter", () => {
      this.loadDetails(card, imdbID);
    });

    // Mobile
    card.addEventListener("click", (e) => {
      if (window.innerWidth <= 768) {
        e.preventDefault();
        const isActive = card.classList.contains("show-details");

        document.querySelectorAll(".movie-card.show-details").forEach((c) => {
          if (c !== card) {
            c.classList.remove("show-details");
          }
        });

        if (!isActive) {
          card.classList.add("show-details");
          this.loadDetails(card, imdbID);
        } else {
          card.classList.remove("show-details");
        }
      }
    });
  }

  static async loadDetails(card, imdbID) {
    const overlay = card.querySelector(".movie-card__overlay");

    if (overlay.dataset.loaded === "true") {
      return;
    }

    const details = await omdbApi.getMovieDetails(imdbID);

    if (details) {
      overlay.innerHTML = this.createDetailsHTML(details);
      overlay.dataset.loaded = "true";
    } else {
      overlay.innerHTML =
        '<div class="load-details">Não foi possivel carregar os detalhes </div>';
    }
  }

  static createDetailsHTML(details) {
    const rating = details.imdbRating !== "N/A" ? details.imdbRating : null;

    return `
        <div class="details-content">
            ${this.createDetailRow("Ano", details.Year)}
            ${this.createDetailRow("Diretor", details.Director)}
            ${this.createDetailRow("Elenco", details.Actors)}
            ${this.createDetailRow("Gênero", details.Genre)}
            ${this.createDetailRow("Duração", details.Runtime)}
            ${
              details.Plot !== "N/A"
                ? this.createDetailRow("Sinopse", details.Plot)
                : ""
            }
            ${
              rating
                ? `
                <div class="rating">
                    <span class="start"><i class="ph-fill ph-star"></i></span>
                    <strong>${rating}/10</strong> IMDB
                </div>
                `
                : ""
            }
        </div>
    `;
  }

  static createDetailRow(label, value) {
    if (!value || value === "N/A") {
      return "";
    }

    return `
        <div class="details-content__row">
            <div class="detail-label">${label}</div>
            <div class="detail-value">${this.scapeHtml(value)}</div>
        </div>
    `;
  }

  static scapeHtml(text) {
    const div = document.createElement("div");
    div.textContent = text;
    return div.innerHTML;
  }
}
