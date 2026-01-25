import app from './app.js';

const PORT = process.env.PORT || 3000;
const HOST = process.env.HOST || '172.25.111.33'; // bind to all interfaces so browsers outside WSL can reach it

app.listen(PORT, HOST, () => {
    console.log(`Server is running on http://${HOST}:${PORT}`);
});
