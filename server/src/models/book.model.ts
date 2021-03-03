import mongoose from "mongoose";
import uniqueValidator from "mongoose-unique-validator";
mongoose.set("useFindAndModify", false);

const bookSchema: mongoose.Schema<unknown> = new mongoose.Schema(
  {
    isbn: {
      type: String,
      minlength: 4,
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
    },
    uploader: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

bookSchema.set("toJSON", {
  transform: (_doc, obj): void => {
    obj.id = obj._id.toString();
    delete obj._id;
    delete obj.__v;
  },
});

bookSchema.plugin(uniqueValidator);

export default mongoose.model("Book", bookSchema);
