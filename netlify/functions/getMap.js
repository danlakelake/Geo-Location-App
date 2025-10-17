// Función que Netlify ejecuta cuando se hace un request a /functions/getPublicKey.js
exports.handler = async function () {
  try {
    // Toma la PUB_KEY que se guardó como variable de entorno en Netlify
    const PUB_KEY = process.env.GOOGLE_MAPS_PUB_KEY;

    // Si no se encuentra
    if (!PUB_KEY) {
      return {
        statusCode: 500, // Error del Servidor
        body: JSON.stringify({ error: 'No se encontró GOOGLE_MAPS_PUB_KEY' }),
      };
    }

    // Devolvemos la clave pública
    return {
      statusCode: 200, // Respuesta Exitosa
      body: JSON.stringify({ key: PUB_KEY }),
    };
  } catch (err) {
    // En caso de error, se registra en consola y devuelve un 500
    return {
      statusCode: 500, // Error del Servidor
      body: JSON.stringify({ error: err.message }),
    };
  }
};
