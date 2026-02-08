import mongoose from "mongoose";

const vaultItemSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    siteName: { type: String, required: true, trim: true },
    siteUrl: { type: String, trim: true },
    loginUsername: { type: String, trim: true },
    loginEmail: { type: String, trim: true },

    passwordCiphertext: { type: String, required: true }, // base64
    passwordIv: { type: String, required: true },         // base64
    passwordAuthTag: { type: String, required: true }     // base64
  },
  { timestamps: true }
);

export default mongoose.model("VaultItem", vaultItemSchema);
