document.addEventListener("DOMContentLoaded", () => {
  // console.log("Findflix - Inicializando aplicação...");

  const apiKeyManager = new ApiKeyModal();
  const needsSetup = apiKeyManager.show();

  if (!needsSetup) {
    initializeApp();
  } else {
    window.addEventListener("apiKeyConfigured", () => {
      // console.log("API Key configurada, iniciando aplicação...");
      initializeApp();
    });
  }

  addSettingsButton();
});

function initializeApp() {
  const searchManager = new HandleSearch();
  // console.log("Aplicação inicializada com sucesso!");
}


// Botão para reconfigurar a key da api
function addSettingsButton() {
  const searchContent = document.querySelector(".search-content");

  if (searchContent) {
    const settingsBtn = document.createElement("button");
    settingsBtn.className = "settings-btn";
    settingsBtn.innerHTML = '<i class="ph ph-gear"></i>';
    settingsBtn.title = "Configurações da API Key";
    settingsBtn.onclick = () => {
      ApiKeyModal.showSettings();
    };

    searchContent.appendChild(settingsBtn);
  }
}
