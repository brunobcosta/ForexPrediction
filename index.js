
const csv = require('csvtojson');
const filePath = './data/DAT_ASCII_EURUSD_M1_201701.csv';

let csvData = [];
let model;

csv({noheader:true,delimiter:';'})
.fromFile(filePath)
.on('json',(jsonObj)=>{
    csvData.push(jsonObj);
})
.on('done',(error)=>{
    console.log(error,csvData.length);
    seperationSize = 0.7 * csvData.length;
    performeRegression(csvData.slice(seperationSize));
    predict(csvData.slice(csvData.length-150));
});

function performeRegression(data){
    console.info('Training');
    let X =[[0,0,0,0,0,0]];
    let y=[[0]];

    data.forEach((item)=>{
        var aux = X[X.length-1]
        aux = aux.slice(1);
        aux.push(y[y.length-1][0]);

        X.push(aux);
        y.push([parseFloat(item.field5)]);
    });
    const MLR= require('ml-regression-multivariate-linear');
    model = new MLR(X,y);

    console.log(model.toString());

}

function predict(data){
    console.info('Predict');
    let X =[[0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]];
    let y=[[0]];

    data.forEach((item)=>{
        var aux = X[X.length-1]
        aux = aux.slice(1);
        aux.push(y[y.length-1][0]);

        X.push(aux);
        y.push([parseFloat(item.field5)]);
    });
X.slice(X[0].length+1).forEach((item,i)=>{
    var py = model.predict(item);
    console.log(Math.abs(y[X[0].length+1+i]-py));
})
}

