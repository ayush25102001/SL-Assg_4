const express=require('express')
const request=require('request')
const path=require('path')
const bodyParser=require('body-parser')
const app=express()
app.set("view engine", "ejs"); 
app.use(bodyParser.urlencoded({extended:true}))
app.get("/",(req,res)=>{
    res.render("home",{active:"",cases:"",recovered:"",comment:""})
})
app.get('/find',(req,res)=>{
     const url="https://data.covid19india.org/state_district_wise.json"
    request({url:url,json:true},(error,response)=>{
       const data=response.body
       res.send(data)
    
    })
})
app.post("/",function(req,res){
    const url="https://data.covid19india.org/state_district_wise.json"
    request({url:url,json:true},(error,response)=>{
    const data=response.body
    var userState=req.body.stateName;
    var userCity=req.body.cityName;
    var stateind=Object.keys(data)  
    var statedata=Object.values(data)
    var ind1
    for(var i=0;i<stateind.length;i++)
    {
        var check=stateind[i]
        if(check===userState)
        {
            ind1=i;
            break;
        }
    }
    const AllCityData=Object.values(statedata[ind1])
    const AllCityInd=Object.keys(AllCityData[0])
    var ind2=-1
    for(i=0;i<AllCityInd.length;i++)
    {
        var checkk=AllCityInd[i]
        if(checkk===userCity)
        {
            ind2=i;
            break;
        }
    }
    const ReqCityData=Object.values(AllCityData[0]) 
    const details=Object.values(ReqCityData[ind2])  
    var active=details[1]
    var cases=details[2]
    var recovered=details[5] 
    var cnt=cases-recovered
    var rate=100-(((cases-recovered)/cases)*100)
    var comment="";
     if(active<=1000)
     {
         comment="Low risk,Visit after taking proper precautions."
     }
     else if(active>1000&&(active<=5000))
     {
         comment="Patient count is signicant,Vist if necessary taking proper precautions."
     }
     else
     {
         comment="Patients are quite high do not visit now"
     }
    res.render("home",{active:"Active cases in "+userCity+" are "+active,cases:"Covid deaths till date in "+userCity+" are "+cnt,
    recovered:"Recovery rate in "+userCity+" is "+rate,comment:comment})
  })
})
app.listen(3000,()=>{
  console.log("server is up")
})