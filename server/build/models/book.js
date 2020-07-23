"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
mongoose_1.default.set('useFindAndModify', false);
const bookSchema = new mongoose_1.default.Schema({
    isbn: {
        type: String,
        unique: true,
    },
    title: {
        type: String,
        minlength: 1,
        required: true,
    },
    published: {
        type: String,
        minlength: 4,
        required: true,
    },
    author: {
        type: String,
        required: true,
    },
    genres: {
        type: [String],
        required: true,
    },
    rating: {
        type: Number,
        required: false,
        min: 0,
        max: 5,
    },
    description: {
        type: String,
        required: false,
    }
}, {
    timestamps: true,
});
bookSchema.set('toJSON', {
    transform: (_doc, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
    }
});
exports.default = mongoose_1.default.model('Book', bookSchema);
