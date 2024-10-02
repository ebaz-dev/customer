import { Document, Schema, model } from "mongoose";
import { updateIfCurrentPlugin } from "mongoose-update-if-current";

interface LocationDoc extends Document {
    _id: number;
    parentId: number;
    name: string;
    lat: number;
    long: number;

}

const locationSchema = new Schema<LocationDoc>(
    {
        _id: {
            type: Number,
            required: true,
        },
        parentId: {
            type: Number,
            required: false,
        },
        name: {
            type: String,
            required: true,
        },
        lat: {
            type: Number,
            required: false,
        },
        long: {
            type: Number,
            required: false,
        },
    },
    {
        toJSON: {
            transform(doc, ret) {
                ret.id = ret._id;
                delete ret._id;
                delete ret.createdAt;
                delete ret.updatedAt;
                delete ret.version;
            },
        },
    }
);

locationSchema.set("versionKey", "version");
locationSchema.plugin(updateIfCurrentPlugin);

const Location = model<LocationDoc>("Location", locationSchema);

export { LocationDoc, Location, };


