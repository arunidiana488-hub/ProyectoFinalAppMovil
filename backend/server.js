require('dotenv').config({ quiet: true });

const app = require('./src/app');
const { PORT } = require('./src/config/env');

const server = app.listen(PORT, () => {
    console.log('================================');
    console.log(' API REST - TALENTO NOVA');
    console.log('================================');
    console.log(`Servidor: http://localhost:${PORT}`);
    console.log('Estado: Ejecutándose correctamente');
});

server.on('error', (error) => {
    console.error('Error del servidor:', error.message);
});
