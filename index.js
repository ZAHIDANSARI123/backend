const PORT = process.env.PORT || 3900;

const app = require('./app');

app.listen(PORT, ()=>{
              console.log(`Server is listening at http://lacalhost:${PORT}`);
});