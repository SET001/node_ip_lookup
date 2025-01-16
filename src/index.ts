import express, { Request, Response } from "express";
import { lookupRouter } from './lookup';

express()
	.use(lookupRouter)
	.use((_, res) => { res.status(404).send("Page not found") })
	.use((err: Error, _req: Request, res: Response) => {
		console.log("something wrong");
		console.log(err);
		res
			.status(500)
			.send("Server error")
	})
	.listen(3000, () => { console.log("App Listenning") });
