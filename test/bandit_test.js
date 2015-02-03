var should = require('chai').should()
var _ = require("underscore")
var Predictor = require('../src/bandits').Predictor

describe("Bandit Predictor", function() {

    function predictionResult( p ){
        if (  Math.random() < p){ return 1 } else { return 0 }
    }

    beforeEach(function* () {
        global.data = {}
        global.choices = [1, 2]
        global.predictor = Predictor(choices)
    })

    it("should give choice", function* () {
        var prediction = predictor.predict(data) 
        //prediction.should.be.within(choices[0], choices[1])
    })

    it("should learn hidden probability", function* () {
        var idsToProbability = [0.4, 0.8]
        for (var i = 0; i < 1000; i++) {
            var prediction = predictor.predict() 
            var p = idsToProbability[prediction.id]
            predictor.learn(prediction, predictionResult(p))
        }
        test2Prob = predictor.probabilities()[1]
        mode = test2Prob.indexOf(_.max(test2Prob))
        mode.should.be.within(75, 85)
    })

})
