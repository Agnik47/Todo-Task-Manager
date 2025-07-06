const { default: mongoose } = require("mongoose");

const TodoSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "TodoUser",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    isCompleted: {
      type: Boolean,
      required: true,
      default: false,
    },
  },
  {
    timestamps: true, // ✅ Correct: Automatically adds createdAt and updatedAt fields
  }
);

// ✅ Safe Model Export: Prevents model overwrite issues during hot reloads in Next.js
const TodoModel = mongoose.models.Todo || mongoose.model("Todo", TodoSchema);

export default TodoModel;
