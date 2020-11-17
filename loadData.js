// ENTITIES
import { Star, Ship } from "./entities";

import { generateUniverse } from "./helpers";
import { baseAPIurl, generationParameters } from "./config";

// import starData from "./data/stars";

export default () => {
	return new Promise(async (resolve, reject) => {
		// create universe object
		const universe = { stars: {}, ships: [] };

		// get star list from api
		console.log("Checking for stars in memory...");
		// let starList = generateUniverse(generationParameters).stars;
		let starList = localStorage.getItem("starList");
		if (!starList) {
			console.log("No stars found in memory, fetching...");
			starList = await fetch(`${baseAPIurl}/stars`)
				.then((res) => res.json())
				.then((jsonData) => {
					console.log("Stars fetched!");
					const stars = jsonData;
					if (process.env.NODE_ENV === "dev") {
						try {
							localStorage.setItem("starList", JSON.stringify(stars));
						} catch (err) {
							console.log(err);
						}
					}
					return stars;
				})
				.catch((err) => reject(err));
		} else {
			console.log("Loading stars from memory...");
			starList = JSON.parse(starList);
		}
		console.log("Stars loaded!");

		const shipList = await fetch(`${baseAPIurl}/ships`)
			.then((res) => res.json())
			.then((jsonData) => {
				console.log("Ships fetched!");
				const { ships } = jsonData;
				return ships;
			})
			.catch((err) => reject(err));
		console.log("Ships loaded!");

		// create stars
		// universe.stars.forEach((star) => {
		for (const star of starList) {
			// create new star
			const newStar = new Star(
				star.x,
				star.y,
				star.name,
				star._id || star.name
			);
			universe.stars[newStar.id] = newStar;
		}
		for (const ship of shipList) {
			const { name, range, speed, x, y, origin, destination } = ship;
			const newShip = new Ship(
				name,
				ship._id,
				range,
				speed,
				x,
				y,
				{ ...origin, id: origin._id },
				{ ...destination, id: destination._id }
			);
			universe.ships.push(newShip);
		}
		resolve(universe);
	});
};
