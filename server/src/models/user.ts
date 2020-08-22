import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
mongoose.set('useFindAndModify', false);

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        minlength: 6,
        unique: true,
        required: true,
    },
    password: {
        type: String,
        minlength: 8,
        required: true,
    },
    name: {
        type: String,
        required: false,
    },
    books: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Book',
        }
    ],
    deactivated: {
        type: Boolean,
        required: true,
        default: false,
    },
}, {
    timestamps: true,
});

userSchema.set('toJSON', {
    transform: (_doc, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
        delete obj.password;
    }
});

userSchema.plugin(uniqueValidator);

export default mongoose.model('User', userSchema);