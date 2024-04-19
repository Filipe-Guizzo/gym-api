import app from "./src/app";

const PORT = 3333;

app.listen(PORT, ()=>{
    console.log('Server listening on port ' + PORT);
});