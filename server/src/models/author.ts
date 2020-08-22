import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
mongoose.set('useFindAndModify', false);

const authorSchema: mongoose.Schema<unknown> = new mongoose.Schema({
    ssn: {
        type: String,
        minlength: 4,
        unique: true,
    },
    name: {
        type: String,
        minlengh: 4,
        required: true,
    },
    birth: {
        type: String,
        required: false,
    },
    address: {
        type: String,
        required: false,
    },
    gender: {
        type: String,
        required: true,
    },
    uploader: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    }
}, {
    timestamps: true,
})

authorSchema.set('toJSON', {
    transform: (_doc, obj) => {
        obj.id = obj._id.toString();
        delete obj._id;
        delete obj.__v;
    }
});

authorSchema.plugin(uniqueValidator);

export default mongoose.model('Author', authorSchema);