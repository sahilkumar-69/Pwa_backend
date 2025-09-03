import { model, Schema } from "mongoose";

const mail_schema = Schema({
  mail: {
    type: String,
    require: true,
  },
  expiresAt: { type: Date, required: true },
  otp: {
    type: String,
    require: true,
  },
});
const mail_model = model("mail_model", mail_schema);
export { mail_model };
