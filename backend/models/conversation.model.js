import mongoose from "mongoose";

const optionSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
    },
    label: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    next: {
      type: String,
      default: null,
    },
  },
  { _id: false }
);

const nodeSchema = new mongoose.Schema(
  {
    key: {
      type: String,
      required: true,
      index: true,
    },
    text: {
      type: String,
      required: true,
    },
    options: {
      type: [optionSchema],
      default: [],
    },
    isTerminal: {
      type: Boolean,
      default: false,
    },
  },
  { _id: false }
);

const templateSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
    },
    nodes: {
      type: [nodeSchema],
      default: [],
    },
    entryNodeKey: {
      type: String,
    }, // key of starting node; if empty uses nodes[0].key
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

const instanceHistorySchema = new mongoose.Schema(
  {
    nodeKey: {
      type: String,
      required: true,
    },
    optionKey: {
      type: String,
      required: true,
    },
    response: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { _id: false }
);

const instanceSchema = new mongoose.Schema(
  {
    template: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "SelectionConversationTemplate",
      required: true,
    },
    participants: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    currentNodeKey: {
      type: String,
      default: null,
    },
    history: {
      type: [instanceHistorySchema],
      default: [],
    },
    status: {
      type: String,
      enum: ["active", "completed", "deleted"],
      default: "active",
    },
    metadata: { type: mongoose.Schema.Types.Mixed, default: {} },
  },
  { timestamps: true }
);

export const SelectionConversationTemplate = mongoose.model(
  "SelectionConversationTemplate",
  templateSchema
);
export const SelectionConversationInstance = mongoose.model(
  "SelectionConversationInstance",
  instanceSchema
);
