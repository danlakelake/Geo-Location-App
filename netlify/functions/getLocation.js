// Función que Netlify ejecuta cuando se hace un request a /functions/getLocation.js
exports.handler = async function (event) {
  try {
    // Extrae latitud y longitud de los parámetros de la URL
    const { lat, lng } = event.queryStringParameters;

    // Validamos que se hayan enviado lat y lng
    if (!lat || !lng) {
      return {
        statusCode: 400, // Bad Request
        body: JSON.stringify({ error: 'Faltan los parámetros lat o lng' }),
      };
    }

    // Toma la API KEY que se guardó como variable de entorno en Netlify
    const API_KEY = process.env.GOOGLE_MAPS_PRIVATE_KEY;

    // Validamos que exista la API KEY
    if (!API_KEY) {
      return {
        statusCode: 500, // Server Error
        body: JSON.stringify({ error: 'Falta la clave de la API' }),
      };
    }

    // llama a la API de Google Maps Geocoding
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}&language=es`;

    // Hacemos la solicitud HTTP a Google Maps
    const response = await fetch(url);
    const data = await response.json();

    // Retorna los datos obtenidos de Google Maps al Front
    return {
      statusCode: 200, //
      body: JSON.stringify(data),
    };
  } catch (err) {
    // En caso de error, se registra en consola y devuelve un 500
    console.error('Error en la función Netlify:', err);
    return {
      statusCode: 500,
      body: JSON.stringify({ error: err.message }),
    };
  }
};
