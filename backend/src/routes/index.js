//routes declaration
const prefix = '/api/v1'

module.exports = (app) => {
app.use(`${prefix}/medicine`, require("./medicine.routes"))
app.use(`${prefix}/diagnostic`, require("./diagnostic.routes"))

}