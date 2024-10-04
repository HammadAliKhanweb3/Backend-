import express from "express";

const app = express();

app.get("/api/jokes", (req, res) => {
  const Jokes = [
    {
      id: 1,
      title: "first",
      content: "This is first Joke",
    },
    {
      id: 2,
      title: "second",
      content: "This is second Joke",
    },
    {
      id: 3,
      title: "third",
      content: "This is third Joke",
    },
    {
      id: 4,
      title: "fourth",
      content: "This is fourth Joke",
    },
    {
      id: 5,
      title: "5",
      content: "This is fifth Joke",
    },
    {
      id: 6,
      title: "sixth",
      content: "This is sixth Joke",
    },
  ];
  res.send(Jokes);
});

const Port = 3000;
app.listen(Port, () => {
  console.log("server is running at port 3000");
});
