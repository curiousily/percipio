var Csv = require("fast-csv")
var Fs = require("fs")

var formatStream = Csv
.createWriteStream({headers: true})
.transform(function(row){
    var hasSurvived = row.Sex == "female" ? 1 : 0
    return {
        PassengerId: row.PassengerId,
        Survived: hasSurvived
    }
})

Csv.fromPath("./data/test.csv", {headers: true})
    .pipe(formatStream)
    .pipe(Fs.createWriteStream("./example/titanic/gender_model.csv"))
