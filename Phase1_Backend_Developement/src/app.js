const express=require('express');
const app=express();
const employeeRoutes=require('./routes/employeeRoutes');
const port=3000;

app.use(express.json());

app.use('/',employeeRoutes);

app.get('/',(req,res)=>{
    res.send('Employee Directory API is Running XD!');
});
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });