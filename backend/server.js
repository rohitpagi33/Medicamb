    const express = require('express');
    const app = express();
    const port = process.env.PORT || 5000;

    app.get('/api/message', (req, res) => {
        res.json({ message: "Hello from Express!" });
    });

    app.listen(port, () => {
        console.log(`Express server listening on port ${port}`);
    });