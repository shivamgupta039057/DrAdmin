//routes declaration
const prefix = '/api/v1'

module.exports = (app) => {
app.use(`${prefix}/medicine`, require("./medicine.routes"))
app.use(`${prefix}/diagnostic`, require("./diagnostic.routes"));
app.use(`${prefix}/ticket`, require("./ticket.routes"));
app.use(`${prefix}/patient`, require("./patients.routes"));
app.use(`${prefix}/upload`, require("./uploadRoutes.routes"));
}