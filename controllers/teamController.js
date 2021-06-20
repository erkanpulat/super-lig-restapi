const Team = require("../models/Team");

const saveTeam = async (req, res, next) => {
  try {
    const teamToAdd = new Team(req.body);
    const result = await teamToAdd.save();
    res.json(result);
  } catch (err) {
    next(err);
  }
};

const getTeams = async (req, res, next) => {
  try {
    // pipeline
    const pipeline = [
      {
        $project: {
          _id: 0,
          __v: 0,
        },
      },
    ];

    // cond objects
    const $sort = {};

    if (req.query.sort == "increase") {
      $sort["teamName"] = 1;
    }

    if (req.query.sort == "decrease") {
      $sort["teamName"] = -1;
    }

    // pipeline push 
    if (Object.keys($sort).length !== 0) {
      pipeline.push({ $sort });
    }

    const teams = await Team.aggregate(pipeline).collation({
      locale: "tr",
    });

    res.json(teams);
  } catch (err) {
    next(err);
  }
};

const getTeam = async (req, res, next) => {
  try {
    const team = await Team.findOne({
      teamLink: req.params.teamLink,
    }).lean();

    if (team == null) {
      next({ statusCode: 404, message: "Team not found!" });
    } else {
      delete team._id;
      delete team.__v;
      res.json(team);
    }
  } catch (err) {
    next(err);
  }
};

const getTeamByName = async (teamName) => {
  try {
    const team = await Team.findOne({ teamName }).lean();
    return team;
  } catch (err) {
    next(err);
  }
};

module.exports = {
  saveTeam,
  getTeamByName,
  getTeams,
  getTeam,
};
