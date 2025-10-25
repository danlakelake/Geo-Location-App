// Importa Translations
import { translations, currentLang, changeLanguage, applyTranslations } from './translations.js';

// Variables globales
const btnGetLocation = document.getElementById('btnGetLocation');
const locationInfo = document.getElementById('locationInfo');
const mapContainer = document.getElementById('map');
const btnToggleLang = document.getElementById('btnToggleLang');

// Inicializar textos del idioma actual en la UI
applyTranslations();

// Inicializa mapa y marcador
let map;
let marker;

// Inicializa Mapa por Defecto
window.initMap = function () {
  const defaultPosition = { lat: 19.4326, lng: -99.1332 }; // CDMX
  map = new google.maps.Map(mapContainer, {
    center: defaultPosition,
    zoom: 12,
    mapId: 'myMap',
  });
};

// Coloca Marcador en la ubicación del usuario
function placeMarker(lat, lng) {
  const position = { lat: Number(lat), lng: Number(lng) };

  // Inicializa Marcador
  marker = new google.maps.marker.AdvancedMarkerElement({
    position: position,
    map: map,
    title: translations[currentLang].markerTitle,
  });

  map.setCenter(position);
  map.setZoom(15);
}

// Consume la Netlify Function para obtener la ubicación
async function getLocation(lat, lng) {
  try {
    const res = await fetch(`/.netlify/functions/getLocation?lat=${lat}&lng=${lng}`);
    const data = await res.json();

    if (data.status === 'OK') {
      const results = data.results[0];
      const fullAddress = results.formatted_address;

      let city = translations[currentLang].city;
      let country = translations[currentLang].country;

      results.address_components.forEach((el) => {
        if (el.types.includes('locality')) city = el.long_name;
        if (el.types.includes('country')) country = el.long_name;
      });

      locationInfo.innerHTML = `
        <div class="bg-white shadow-lg rounded-lg p-4 max-w-md mx-auto border border-gray-200">
          <h2 class="text-lg font-semibold mb-2"> 
            <i class="fa-solid fa-location-dot mr-1 text-red-600"></i>
            ${translations[currentLang].locationTitle}:
          </h2>
          <p class="text-gray-700"><span class="font-medium">${translations[currentLang].address}:</span> ${fullAddress}</p>
          <p class="text-gray-700"><span class="font-medium">${translations[currentLang].city}:</span> ${city}</p>
          <p class="text-gray-700"><span class="font-medium">${translations[currentLang].country}:</span> ${country}</p>
        </div>
      `;
    } else {
      console.error('Error de Google Maps:', data.status, data.error_message);
    }
  } catch (err) {
    console.error('Error en fetch:', err);
  }
}

// Obtiene las Coordenadas del Usuario
function getCoords() {
  if ('geolocation' in navigator) {
    console.log(translations[currentLang].requestingLocation);
    // Obtiene la ubicación
    navigator.geolocation.getCurrentPosition(
      (position) => {
        // Toma latitud y longitud
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        // Llama función para marcador
        placeMarker(lat, lng);
        // Llama función para obtener localización
        getLocation(lat, lng);
      },
      // Manejo de errores en la solicitud
      (error) => {
        console.error(translations[currentLang].locationError, error.message);
      },
      {
        // Máxima precisión disponible
        enableHighAccuracy: true,
        // No usar ubicaciones guardadas en cache
        maximumAge: 0,
      }
    );
  } else {
    // De lo contrario muestra el mensaje de error
    console.log(translations[currentLang].geolocationNotSupported);
  }
}

// Carga el script de Google Maps dinámicamente usando la clave pública desde Netlify
async function loadGoogleMaps() {
  try {
    // Fetch de la clave pública a (Netlify Function)
    const response = await fetch('/.netlify/functions/getMap');
    const data = await response.json();

    if (!data.key) {
      throw new Error('No se recibió la clave pública desde Netlify.');
    }

    // Guarda la clave en variable local PUB_KEY
    const PUB_KEY = data.key;

    // Crea scripts de Google Maps
    const script = document.createElement('script');
    script.src = `https://maps.googleapis.com/maps/api/js?key=${PUB_KEY}&libraries=marker&callback=initMap`;
    script.async = true;
    script.defer = true;

    // Agrega el script al <head> cuando el DOM se inicializa
    document.head.appendChild(script);
  } catch (error) {
    // Manejo de errores
    console.error('Error al cargar Google Maps:', error);
  }
}

// Listener para Consultar Ubicación
btnGetLocation.addEventListener('click', console.log('diste click'), getCoords);
// Listener para Cambio de Idioma
btnToggleLang.addEventListener('click', changeLanguage);

// Cargar el Mapa al Iniciar
loadGoogleMaps();
