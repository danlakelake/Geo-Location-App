// Traducciones
export const translations = {
  es: {
    mainTitle: 'App Geolocalización',
    title: 'Consulta Tu Ubicación Actual',
    btnShowLocation: 'Mostrar mi ubicación',
    requestingLocation: 'Solicitando tu ubicación...',
    locationError: 'No se pudo obtener la ubicación:',
    geolocationNotSupported: 'Tu navegador no soporta la geolocalización.',
    markerTitle: 'Tu ubicación',
    locationTitle: 'Tu Ubicación',
    address: 'Dirección',
    city: 'Ciudad',
    country: 'País',
    toggleBtn: 'ES 🇲🇽',
  },
  en: {
    mainTitle: 'Get Location App',
    title: 'Check Your Current Location',
    btnShowLocation: 'Show my location',
    requestingLocation: 'Requesting your location...',
    locationError: 'Could not get your location:',
    geolocationNotSupported: 'Your browser does not support geolocation.',
    markerTitle: 'Your location',
    locationTitle: 'Your Location',
    address: 'Address',
    city: 'City',
    country: 'Country',
    toggleBtn: 'EN 🇺🇸',
  },
};

// Idioma actual
export let currentLang = 'es';

// Aplica las traducciones según el idioma actual
export function applyTranslations() {
  // Selecciona todos los elementos con el atributo data-i18n
  const elements = document.querySelectorAll('[data-i18n]');

  // Recorre los elementos para posteriormente hacer el cambio de lang
  elements.forEach((element) => {
    const key = element.getAttribute('data-i18n');

    // Si no tiene clave, hace un return
    if (!key) {
      return;
    }
    // Si la key es el elemento de botón de idioma
    if (key === 'toggleBtn') {
      // Muestra el idioma contrario
      const nextLang = currentLang === 'es' ? 'en' : 'es';
      const text = translations[nextLang]?.[key];
      if (text) {
        element.innerHTML = text;
      }
    } else {
      // Muestra los textos traducidos
      const text = translations[currentLang]?.[key];
      if (text) {
        element.innerHTML = text;
      }
    }
  });
}

// Función para Cambio de Idioma
export function changeLanguage() {
  // Alterna idioma
  currentLang = currentLang === 'es' ? 'en' : 'es';
  // Aplica las traducciones
  applyTranslations();
}
