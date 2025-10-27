class ApiKeyModal {
  constructor() {
    this.storageKey = "findflix-api-key";
    this.modal = null;
    this.apiKey = this.getStoredApiKey();
  }

  getStoredApiKey() {
    return localStorage.getItem(this.storageKey);
  }

  saveApiKey(key) {
    localStorage.setItem(this.storageKey, key);
    this.apiKey = key;
  }

  clearApiKey() {
    localStorage.removeItem(this.storageKey);
    this.apiKey = null;
  }

  hasValidApiKey() {
    return this.apiKey && this.apiKey.length > 0;
  }

  async validateApiKey(key) {
    try {
      //TEsta a key com busca simples
      const response = await fetch(
        `https://www.omdbapi.com/?apikey=${key}&s=test`
      );
      const data = await response.json();

      // se Response for false a key é invalida
      return data.Response !== "False" || !data.Error.includes("Invalid API");
    } catch (error) {
      console.error("Erro ao validar API key:", error);
      return false;
    }
  }

  createModal() {
    const modal = document.createElement("div");
    modal.id = "apiKeyModal";
    modal.className = "api-modal";
    modal.innerHTML = `
      <div class="api-modal__overlay"></div>
      <div class="api-modal__content">
        <div class="api-modal__header">
          <img src="assets/images/findflix.svg" alt="Findflix" class="api-modal__logo">
          <h2 class="api-modal__title">Bem-vindo!</h2>
          <p class="api-modal__subtitle">Para começar, você precisa de uma API Key do OMDB</p>
        </div>

        <div class="api-modal__body">
          <div class="api-modal__info">
            <div class="info-card">
              <i class="ph ph-key"></i>
              <div>
                <h3>Não tem uma API Key?</h3>
                <p>É gratuito e leva menos de 1 minuto!</p>
              </div>
            </div>
            
            <ol class="api-modal__steps">
              <li>
                <span class="step-number">1</span>
                <div>
                  <strong>Acesse o site do OMDB</strong>
                  <a href="http://www.omdbapi.com/apikey.aspx" target="_blank" rel="noopener noreferrer">
                    www.omdbapi.com/apikey.aspx
                    <i class="ph ph-arrow-square-out"></i>
                  </a>
                </div>
              </li>
              <li>
                <span class="step-number">2</span>
                <div>
                  <strong>Escolha "FREE"</strong>
                  <p>Preencha seu email e ative sua conta</p>
                </div>
              </li>
              <li>
                <span class="step-number">3</span>
                <div>
                  <strong>Copie sua API Key</strong>
                  <p>Cole abaixo e comece a usar!</p>
                </div>
              </li>
            </ol>
          </div>

          <div class="api-modal__form">
            <div class="form-group">
              <label for="apiKeyInput">
                <i class="ph ph-key"></i>
                Sua API Key do OMDB
              </label>
              <input 
                type="text" 
                id="apiKeyInput" 
                placeholder="Cole sua API key aqui..."
                autocomplete="off"
                spellcheck="false"
              >
              <div id="apiKeyError" class="error-message"></div>
              <div class="form-hint">
                <i class="ph ph-info"></i>
                Sua key é armazenada apenas no seu navegador
              </div>
            </div>

            <div class="api-modal__actions">
              <button type="button" id="validateApiKey" class="btn btn__primary">
                <i class="ph ph-check-circle"></i>
                Validar e Começar
              </button>
            </div>
          </div>
        </div>

        <div class="api-modal__footer">
          <button type="button" id="useDefaultKey" class="btn btn__link">
            <i class="ph ph-warning-circle"></i>
            Usar key de demonstração (limitada)
          </button>
        </div>
      </div>
    `;

    document.body.appendChild(modal);
    this.modal = modal;
    this.attachModalEvents();
    document.body.classList.add("modal-open");
  }

  attachModalEvents() {
    const input = document.getElementById("apiKeyInput");
    const validateBtn = document.getElementById("validateApiKey");
    const useDefaultBtn = document.getElementById("useDefaultKey");
    const errorDiv = document.getElementById("apiKeyError");

    input.addEventListener("keypress", (e) => {
      if (e.key === "Enter") {
        validateBtn.click();
      }
    });

    input.addEventListener("input", () => {
      errorDiv.textContent = "";
      errorDiv.classList.remove("show");
    });

    validateBtn.addEventListener("click", async () => {
      const key = input.value.trim();

      if (!key) {
        this.showError("Por favor, insira uma API key");
        return;
      }

      validateBtn.disabled = true;
      validateBtn.innerHTML = `
        <i class="ph ph-circle-notch loading-spinner"></i>
        Validando...
      `;

      const isValid = await this.validateApiKey(key);

      if (isValid) {
        this.saveApiKey(key);
        window.API_KEY = key;
        if (window.omdbApi) {
          window.omdbApi.apiKey = key;
        }
        this.closeModal();
        this.showSuccessNotification();
      } else {
        this.showError(
          "API key inválida. Verifique se você copiou corretamente."
        );
        validateBtn.disabled = false;
        validateBtn.innerHTML = `
          <i class="ph ph-check-circle"></i>
          Validar e Começar
        `;
      }
    });

    useDefaultBtn.addEventListener("click", () => {
      const demoKey = "342aa484";
      this.showWarning(
        "Usando API key de demonstração. Pode ter limitações de uso."
      );
      this.saveApiKey(demoKey);
      window.API_KEY = demoKey;
      if (window.omdbApi) {
        window.omdbApi.apiKey = demoKey;
      }
      setTimeout(() => {
        this.closeModal();
      }, 1500);
    });
  }

  showError(message) {
    const errorDiv = document.getElementById("apiKeyError");
    errorDiv.textContent = message;
    errorDiv.classList.add("show", "error");
    errorDiv.classList.remove("warning");
  }

  showWarning(message) {
    const errorDiv = document.getElementById("apiKeyError");
    errorDiv.textContent = message;
    errorDiv.classList.add("show", "warning");
    errorDiv.classList.remove("error");
  }

  showSuccessNotification() {
    const notification = document.createElement("div");
    notification.className = "success-notification";
    notification.innerHTML = `
      <i class="ph ph-check-circle"></i>
      <span>API Key configurada com sucesso!</span>
    `;
    document.body.appendChild(notification);

    setTimeout(() => notification.classList.add("show"), 10);
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  closeModal() {
    if (this.modal) {
      this.modal.classList.add("closing");
      setTimeout(() => {
        this.modal.remove();
        document.body.classList.remove("modal-open");
        window.dispatchEvent(new Event("apiKeyConfigured"));
      }, 300);
    }
  }

  show() {
    if (this.hasValidApiKey()) {
      window.API_KEY = this.apiKey;
      if (window.omdbApi) {
        window.omdbApi.apiKey = this.apiKey;
      }
      return false;
    }

    this.createModal();
    setTimeout(() => {
      this.modal.classList.add("show");
    }, 10);
    return true;
  }

  static showSettings() {
    const apiKeyManager = new ApiKeyModal();
    apiKeyManager.clearApiKey();
    apiKeyManager.show();
  }
}

window.ApiKeyModal = ApiKeyModal;
