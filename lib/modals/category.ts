import { model, models, Schema } from "mongoose";
const CategorySchema = new Schema({
    title: {
        type: String,
        required: true,
        unique: true
    },
    user: {
        type: Schema.Types.ObjectId,
        ref: "User",
    }
}, {
    timestamps: true,
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;