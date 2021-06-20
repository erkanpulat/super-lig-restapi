const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const MatchSchema = new Schema(
  {
    matchInfo: {
      type: String,
      trim: true,
      unique: true,
      required: true,
    },
    homeTeam: {
      type: Schema.Types.ObjectId,
      ref: "teams",
      required: true,
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      ref: "teams",
      required: true,
    },
    homeTeamScore: {
      type: Number,
      required: true,
    },
    awayTeamScore: {
      type: Number,
      required: true,
    },
    matchDate: {
      type: Date,
      required: true,
    },
  },

  { collection: "matches", timestamps: false }
);

const Match = mongoose.model("Match", MatchSchema);

module.exports = Match;
