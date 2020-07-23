import mongoose from 'mongoose';
import uniqueValidator from 'mongoose-unique-validator';
mongoose.set('useFindAndModify', false);

const authorSchema = new mongoose.Schema({
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