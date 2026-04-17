import  { WebSocketServer } from "ws";
import { prismaClient } from "@repo/prisma";

const wss = new WebSocketServer({
  port: 8080,
});

interface IparsedData {
  event: string,
  userData: {
    username: string,
    password: string,
    id?:number,
  }
}

wss.on("connection", function connection(ws) {
  ws.on("error", console.error);

  ws.on("message", async function message(data) {
    const parsedData = JSON.parse(data as unknown as string) as IparsedData;
    if (parsedData.event === "create-user") {
      const createdUser = await prismaClient.user.create({
        data: {
          username: parsedData.userData.username,
          password: parsedData.userData.password.toString()
        }
      });
      console.log(createdUser);
    }
  });
  ws.send("Ki haal Chal Guru");
});
