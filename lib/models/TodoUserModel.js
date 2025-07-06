const { default: mongoose } = require("mongoose");

const TodoUserSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
    min: 3,
  },
  email: {
    type: String,
    required: [true, "Email is Required"],
    unique: true // Optional: good for authentication
  },
  password: {
    type: String, // ✅ Use string for hashed password
    required: true,
  },
  TodoLists: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Todo'
  }
}, {
  timestamps: true  
});

// ✅ Safe Model Export
const TodoUserModel = mongoose.models.TodoUser || mongoose.model('TodoUser', TodoUserSchema);

export default TodoUserModel;
