const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const TeamSchema = new Schema(
  {
    teamName: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    teamLogo: {
      type: String,
      trim: true,
      required: true,
    },
    teamLink: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    teamColors: {
      type: Array,
      required: true,
    },
    officialSite: {
      type: String,
      trim: true,
      required: true,
    },
  },
  { collection: "teams", timestamps: false }
);

const Team = mongoose.model("Team", TeamSchema);

module.exports = Team;
