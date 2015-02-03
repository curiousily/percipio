var _ = require('underscore')

var training = [1, 1, 1, 0, 1, 1]
var response = [0, 1, 0, 0, 1, 0]


var responseCounts = _.countBy(response, function(num) {
    return num == 0 ? 'early' : 'late'
})

var trainingCounts = _.countBy(response, function(num) {
    return num == 0 ? 'no' : 'yes'
})

var timeCount = 0
var hungryCount = 0

for(var i = 0; i < response.length; i++) {

    var time = response[i]

    if(time == 0) {
        timeCount++
        var hungry = training[i]
        if(hungry == 1) {
            hungryCount++
        }
    }
}

//console.dir(hungryCount / timeCount)

var Fs = require("fs")
var Csv = require("fast-csv")

var Stream = Fs.createReadStream("./data/college.csv")

var records = []

var csvStream = Csv({headers: true})
    .on("data", function(data){
        records.push(data)
    })
    .on("end", function(){
        console.dir(records)
    });

Stream.pipe(csvStream)

