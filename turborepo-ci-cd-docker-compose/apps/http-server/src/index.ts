import express from "express";
import { prismaClient } from "@repo/prisma";
const app = express();
const PORT = 3001;

app.use(express.json())

app.get("/", (req, res) => {
  console.log("App is working fine.. hello bro!!");
  res.send("App is working fine.. Hello bro!!")
})

interface IpassedData{
  username: string,
  password: string,
  id?:number
}

app.post("/create-user", async (req, res) => {
  const { username, password, id } = req.body as IpassedData;
  const createdUser = await prismaClient.user.create({
    
    data: {
      userId: id,
      username,
      password: password.toString()
    }
  })
  if (createdUser) {
    return res.send({ data: createdUser })
  }
  return res.send({ error: "something went wrong!!" })
});

app.get("/users", async (req, res) => {
  const data = await prismaClient.user.findMany();
  return res.send({ data })
});

app.listen(PORT, () => {
  console.log("Started listning on port ", PORT);
});