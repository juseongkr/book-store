"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const morgan_1 = __importDefault(require("morgan"));
const config_1 = require("./utils/config");
const mongoose_1 = __importDefault(require("mongoose"));
const ping_1 = __importDefault(require("./routes/ping"));
const books_1 = __importDefault(require("./routes/books"));
const middlewares_1 = __importDefault(require("./utils/middlewares"));
console.log('CONNECTING TO', config_1.MONGODB_URI);
if (config_1.MONGODB_URI === 'undefined') {
    console.log('CONNECTIION FIALED', config_1.MONGODB_URI);
    process.exit(0);
}
mongoose_1.default.connect(config_1.MONGODB_URI, {
    useCreateIndex: true,
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
    .then(() => {
    console.log('CONNECTED TO DB');
})
    .catch(err => {
    console.error('CONNECTION FAILED', err.message);
});
const app = express_1.default();
app.use(morgan_1.default('combined'));
app.use(cors_1.default());
app.use(helmet_1.default());
app.use(express_1.default.static('build'));
app.use(express_1.default.json());
app.use('/api/ping', ping_1.default);
app.use('/api/books', books_1.default);
app.use(middlewares_1.default.unknownEndpoint);
app.use(middlewares_1.default.errorHandler);
exports.default = app;
