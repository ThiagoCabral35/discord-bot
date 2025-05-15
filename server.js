const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

// Middleware para interpretar JSON
app.use(bodyParser.json());

// Rota principal para interações
app.post('/interactions', (req, res) => {
    const interaction = req.body;

    console.log("Interação recebida:", interaction);

    // Resposta padrão ao Discord
    res.send({
        type: 4, // Responde diretamente no canal
        data: {
            content: "Comando recebido! Obrigado pelo uso do bot."
        }
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
});
