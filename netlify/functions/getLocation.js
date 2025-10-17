// Función que Netlify ejecuta cuando se hace un request a /functions/getLocation.js
exports.handler = async function (event) {
  try {
    // Extrae latitud y longitud de los parámetros de la URL
    const { lat, lng } = event.queryStringParameters;

    // Valida que la solicitud contenga lat y lng
    if (!lat || !lng) {
      return {
        statusCode: 400, // Solicitud Incorrecta :parámetros inválidos o incompletos en la petición
        body: JSON.stringify({ error: 'Faltan los parámetros lat o lng' }),
      };
    }

    // Toma la API KEY que se guardó como variable de entorno en Netlify
    const API_KEY = process.env.GOOGLE_MAPS_PRIVATE_KEY;

    // Valida que exista la API_KEY
    if (!API_KEY) {
      return {
        statusCode: 500, // Error de Servidor
        body: JSON.stringify({ error: 'Falta la clave de la API' }),
      };
    }

    // llama a la API de Google Maps Geocoding
    const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${API_KEY}&language=es`;

    // Solicitud Fetch a Google Maps
    const response = await fetch(url);
    const data = await response.json();

    // Retorna los datos obtenidos de Google Maps al Front
    return {
      statusCode: 200, // Respuesta Exitosa
      body: JSON.stringify(data),
    };
  } catch (err) {
    // En caso de error, se registra en consola y devuelve un 500
    console.error('Error en la función Netlify:', err);
    return {
      statusCode: 500, // Error del Servidor
      body: JSON.stringify({ error: err.message }),
    };
  }
};
