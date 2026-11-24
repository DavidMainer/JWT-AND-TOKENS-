import express from "express";
import cors from "cors";
import "dotenv/config";
import jwt from "jsonwebtoken";
import crypto from "crypto";


const app = express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())
const posts = [
  {
    username: "david",
    role: "admin",
    student: true,
  },
  {
    username: "kevin",
    role: "employee",
    student: false,
  },
];
app.get("/posts",authenticateToken, (req, res) => {
  res.json(posts.filter(post=>post.username===req.user.name));
});
//login route to authenticate the user    this is going to create the token

app.post("/login", (req, res) => {
  const username = req.body.username;
  const user = { name: username };
  const accessToken = jwt.sign(user, process.env.ACCESS_KEY);
  res.json({ accessToken: accessToken });
});

function authenticateToken(req,res,nex){
const authHeader= req.headers['authorization']
const token =authHeader &&  authHeader.split(' ')[1];

if(token == null )return res.sendStatus(401);
jwt.verify(token,process.env.ACCESS_KEY,(err,user)=>{

  if(err)return res.sendStatus(403);
  req.user = user;
  nex();
})

}





const port =  process.env.PORT || 3000;
app.listen(3000, () => {
  console.log(`server running on port ${port}`);
});
