const Match = require("../models/Match");
const teamController = require("./teamController");

const saveMatch = async (req, res, next) => {
  try {
    await teamController
      .getTeamByName(req.body.match.homeTeam)
      .then((team) => {
        req.body.match.homeTeam = team._id;
      });

    await teamController
      .getTeamByName(req.body.match.awayTeam)
      .then((team) => {
        req.body.match.awayTeam = team._id;
      });

    const matchToAdd = new Match(req.body.match);
    const result = await matchToAdd.save();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getMatches = async (req, res, next) => {
  try {
    // pipeline
    const pipeline = [
      {
        $lookup: {
          from: "teams",
          localField: "homeTeam",
          foreignField: "_id",
          as: "homeTeam",
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "awayTeam",
          foreignField: "_id",
          as: "awayTeam",
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "awayTeam._id": 0,
          "awayTeam.__v": 0,
          "homeTeam._id": 0,
          "homeTeam.__v": 0,
        },
      },
    ];

    // cond objects
    const limit = {}; // limit nested object
    const $sort = {};
    const $sample = {};

    if (req.query.date == "decrease") {
      $sort["matchDate"] = -1;
    }

    if (req.query.date == "increase") {
      $sort["matchDate"] = 1;
    }

    if (parseInt(req.query.limit)) {
      limit["$limit"] = parseInt(req.query.limit);
    }

    if (parseInt(req.query.random)) {
      $sample["size"] = parseInt(req.query.random);
    }

    // pipeline push 
    if (Object.keys($sample).length !== 0) {
      pipeline.push({ $sample });
    }
    if (Object.keys($sort).length !== 0) {
      pipeline.push({ $sort });
    }
    if (Object.keys(limit).length !== 0) {
      pipeline.push(limit);
    }

    const matches = await Match.aggregate(pipeline);
    res.json(matches);
  } catch (err) {
    next(err);
  }
};

const getTeamMatches = async (req, res, next) => {
  try {
    // pipeline
    const pipeline = [
      {
        $lookup: {
          from: "teams",
          localField: "homeTeam",
          foreignField: "_id",
          as: "homeTeam",
        },
      },
      {
        $lookup: {
          from: "teams",
          localField: "awayTeam",
          foreignField: "_id",
          as: "awayTeam",
        },
      },
      {
        $project: {
          _id: 0,
          __v: 0,
          "awayTeam._id": 0,
          "awayTeam.__v": 0,
          "homeTeam._id": 0,
          "homeTeam.__v": 0,
        },
      },
    ];

    // cond objects
    const $match = {};
    const $sort = {};
    const $sample = {};

    //-- queries
    // cond
    if (req.query.cond == "awayTeam") {
      $match["awayTeam.teamLink"] = req.params.teamLink;
    }

    if (req.query.cond == "homeTeam") {
      $match["homeTeam.teamLink"] = req.params.teamLink;
    }

    if (!(req.query.cond == "homeTeam" || req.query.cond == "awayTeam")) {
      $match["$or"] = [
        { "homeTeam.teamLink": req.params.teamLink },
        { "awayTeam.teamLink": req.params.teamLink },
      ];
    }
    // date
    if (req.query.date == "decrease") {
      $sort["matchDate"] = -1;
    }

    if (req.query.date == "increase") {
      $sort["matchDate"] = 1;
    }
    // goals
    if (parseInt(req.query.homeTeamGoal)) {
      $match["homeTeamScore"] = { $gte: parseInt(req.query.homeTeamGoal) };
    }

    if (parseInt(req.query.awayTeamGoal)) {
      $match["awayTeamScore"] = { $gte: parseInt(req.query.awayTeamGoal) };
    }

    // random
    if (parseInt(req.query.random)) {
      $sample["size"] = parseInt(req.query.random);
    }

    // pipeline push 
    if (Object.keys($match).length !== 0) {
      pipeline.push({ $match });
    }
    if (Object.keys($sample).length !== 0) {
      pipeline.push({ $sample });
    }
    if (Object.keys($sort).length !== 0) {
      pipeline.push({ $sort });
    }

    const matches = await Match.aggregate(pipeline);

    if (matches.length === 0) {
      next({
        statusCode: 404,
        message: "Team match not found! Please check your query.",
      });
    } else {
      res.json(matches);
    }
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveMatch,
  getMatches,
  getTeamMatches,
};
