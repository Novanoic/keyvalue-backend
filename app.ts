const express = require("express");
import { Request, Response } from "express";
const server = new express();

server.get("/", (req: Request, res: Response) => {
  console.log(req.url);
  res.status(200).send("Hello World");
});

server.get("/employee", (req: Request, res: Response) => {
  console.log(req.url);
  res.status(200).send("Hello my name is Nalin Govind V");
});

interface Profile {
  age: number;
  name: string;
}

interface Data {
  profile: Profile;
}

server.get("/getData", (req: Request, res: Response) => {
  let data: Data = {
    profile: {
      name: "Nalin Govind V",
      age: 22,
    },
  };
  console.log(data.profile.name);
  res.status(200).send(data);
});

server.listen(3000, () => {
  console.log("The server is running on port 3000");
});
