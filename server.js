const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());

// Endpoint para verificação
app.post('/role-verification', (req, res) => {
    const { userId, guildId } = req.body;

    // Simulação de verificação
    console.log(`Verificando o usuário ${userId} no servidor ${guildId}`);

    const verified = true; // Aqui você implementaria sua lógica de verificação

    if (verified) {
        res.status(200).send({
            message: "Usuário verificado com sucesso!",
            metadata: {
                userId: userId,
                role: "função-verificada"
            }
        });
    } else {
        res.status(403).send({
            message: "Falha na verificação do usuário."
        });
    }
});

app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
