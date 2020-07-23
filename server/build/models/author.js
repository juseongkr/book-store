"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const mongoose_unique_validator_1 = __importDefault(require("mongoose-unique-validator"));
mongoose_1.default.set('useFindAndModify', false);
const authorSchema = new mongoose_1.default.Schema({
    ssn: {
        type: String,
        unique: true,
    },
    name: {
        type: String,
        required: true,
    },
    birth: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});
authorSchema.set('toJSON', {
    transform: (_doc, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
    }
});
authorSchema.plugin(mongoose_unique_validator_1.default);
exports.default = mongoose_1.default.model('Author', authorSchema);
