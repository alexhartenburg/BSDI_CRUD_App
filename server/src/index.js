const { app } = require("./app");
const port = process.env.PORT || 4000
module.exports = app.listen(port, () => console.log(`Example app listening at http://localhost:${port}`))

