import { model, Schema, Types } from "mongoose";
import { ObjectID } from "typeorm";

export type Img_url = {
  url: string;
  secure_url: string;
  public_id: string;
};

export interface dish {
  _id: Types.ObjectId;
  name: string;
  servings: string;
  energy: number;
  protein: number;
  fats: number;
  calories: number;
  image_url: Img_url;
  created_by: Types.ObjectId;
  updated_by: Types.ObjectId;
  is_active: boolean;
}

const dishSchema = new Schema<dish>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
    servings: {
      type: String,
      required: true,
    },
    energy: {
      type: Number,
      default: 0,
    },
    protein: {
      type: Number,
      default: 0,
    },
    fats: {
      type: Number,
      default: 0,
    },
    calories: {
      type: Number,
      default: 0,
    },
    image_url: {
      url: {
        type: String,
        required: true,
      },
      public_id: {
        type: String,
        required: true,
      },
    },
    created_by: {
      type: "ObjectID",
      ref: "User",
      required: true,
    },
    updated_by: {
      type: "ObjectId",
      ref: "User",
      required: true,
    },
    is_active: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: {
      createdAt: "created_at", // Use `created_at` to store the created date
      updatedAt: "updated_at", // and `updated_at` to store the last updated date
    },
  }
);

const dishModel = model<dish>("Dishes", dishSchema);

export default dishModel;
