let express = require('express');
let router = express.Router();
const createError = require('http-errors');
const sqlite3 = require('sqlite3');//.verbose();
const DbPath = __dirname.replace("/routes", "/db/vchess.sqlite");
const db = new sqlite3.Database(DbPath);
const sanitizeHtml = require('sanitize-html');
const MaxNbProblems = 20;

const supportedLang = ["en","es","fr"];
function selectLanguage(req, res)
{
	// If preferred language already set:
	if (!!req.cookies["lang"])
		return req.cookies["lang"];

	// Else: search and set it
	const langString = req.headers["accept-language"];
	let langArray = langString
		.replace(/;q=[0-9.]+/g, "") //priority
		.replace(/-[A-Z]+/g, "") //region (skipped for now...)
		.split(",") //may have some duplicates, but removal is too costly
	let bestLang = "en"; //default: English
	for (let lang of langArray)
	{
		if (supportedLang.includes(lang))
		{
			bestLang = lang;
			break;
		}
	}
	// Cookie expires in 183 days (expressed in milliseconds)
	res.cookie('lang', bestLang, { maxAge: 183*24*3600*1000 });
	return bestLang;
}

// Home
router.get('/', function(req, res, next) {
	db.serialize(function() {
		db.all("SELECT * FROM Variants", (err,variants) => {
			if (!!err)
				return next(err);
			res.render('index', {
				title: 'club',
				variantArray: variants,
				lang: selectLanguage(req, res),
				languages: supportedLang,
			});
		});
	});
});

// Variant
router.get("/:variant([a-zA-Z0-9]+)", (req,res,next) => {
	const vname = req.params["variant"];
	db.serialize(function() {
		db.all("SELECT * FROM Variants WHERE name='" + vname + "'", (err,variant) => {
			if (!!err)
				return next(err);
			if (!variant || variant.length==0)
				return next(createError(404));
			// Get only N most recent problems
			const query2 = "SELECT * FROM Problems " +
				"WHERE variant='" + vname + "' " +
				"ORDER BY added DESC " +
				"LIMIT " + MaxNbProblems;
			db.all(query2, (err2,problems) => {
				if (!!err2)
					return next(err2);
				res.render('variant', {
					title: vname + ' Variant',
					variant: vname,
					problemArray: problems,
					lang: selectLanguage(req, res),
					languages: supportedLang,
				});
			});
		});
	});
});

// Load a rules page (AJAX)
router.get("/rules/:variant([a-zA-Z0-9]+)", (req,res) => {
	if (!req.xhr)
		return res.json({errmsg: "Unauthorized access"});
	const lang = selectLanguage(req, res);
	res.render("rules/" + req.params["variant"] + "/" + lang);
});

// Fetch N previous or next problems (AJAX)
router.get("/problems/:variant([a-zA-Z0-9]+)", (req,res) => {
	if (!req.xhr)
		return res.json({errmsg: "Unauthorized access"});
	const vname = req.params["variant"];
	const directionStr = (req.query.direction == "forward" ? ">" : "<");
	const lastDt = req.query.last_dt;
	if (!lastDt.match(/[0-9]+/))
		return res.json({errmsg: "Bad timestamp"});
	db.serialize(function() {
		const query = "SELECT * FROM Problems " +
			"WHERE variant='" + vname + "' " +
			"  AND added " + directionStr + " " + lastDt + " " +
			"ORDER BY added " + (directionStr=="<" ? "DESC " : "") +
			"LIMIT " + MaxNbProblems;
		db.all(query, (err,problems) => {
			if (!!err)
				return res.json(err);
			return res.json({problems: problems});
		});
	});
});

// Upload a problem (AJAX)
router.post("/problems/:variant([a-zA-Z0-9]+)", (req,res) => {
	if (!req.xhr)
		return res.json({errmsg: "Unauthorized access"});
	const vname = req.params["variant"];
	const timestamp = Date.now();
	// Sanitize them
	const fen = req.body["fen"];
	if (!fen.match(/^[a-zA-Z0-9, /-]*$/))
		return res.json({errmsg: "Bad characters in FEN string"});
	const instructions = sanitizeHtml(req.body["instructions"]).trim();
	const solution = sanitizeHtml(req.body["solution"]).trim();
	if (instructions.length == 0)
		return res.json({errmsg: "Empty instructions"});
	if (solution.length == 0)
		return res.json({errmsg: "Empty solution"});
	db.serialize(function() {
		let stmt = db.prepare("INSERT INTO Problems " +
			"(added,variant,fen,instructions,solution) VALUES (?,?,?,?,?)");
		stmt.run(timestamp, vname, fen, instructions, solution);
		stmt.finalize();
	});
  res.json({});
});

module.exports = router;
