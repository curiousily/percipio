var _ = require("underscore")
var rbeta = require("./stats").rbeta
var pdfbeta = require("./stats").pdfbeta
var beta = require("./stats").beta

var Predictor = function(choices) {

    var self = {}
    var bayesianBanditStrategy = BayesianBanditStrategy(choices)

    self.predict = function() {
        var arm = bayesianBanditStrategy.selectArm()
        var choice = arm.choice
        return {
            id: arm.id,
            choice: choice
        }
    }

    self.learn = function(prediction, result) {
        bayesianBanditStrategy.update(prediction, result)
    }

    self.probabilities = function() {
        return bayesianBanditStrategy.armProbabilities()
    }

    return self
}

var Arm = function(id, choice) {

    var self = {}

    self.wins = 0
    self.trials = 0
    self.choice = choice
    self.id = id

    self.losses = function() {
        return self.trials - self.wins
    }

    self.probability = function() {
        return rbeta(1 + self.wins, 1 + self.losses())
    }

    return self
}

var BayesianBanditStrategy = function(choices) {

    var self = {}
    var armId = 0
    self.arms = choices.map(function(x) { 
        return Arm(armId++, x) 
    })

    self.selectArm = function() {
        return _.max(self.arms, function(arm) {
            return arm.probability()
        })
    }

    self.update = function(choice, result) {
        var indexedArms = _.indexBy(self.arms, 'id')
        var arm = indexedArms[choice.id]
        arm.wins += result
        arm.trials += 1
    }

    self.armProbabilities = function() {
        x = _.range(0, 1, 0.01)
        return self.arms.map(function(arm) {
            return pdfbeta(x, 1 + arm.wins, 1 + arm.losses())
        })
    }

    return self
}

module.exports.Predictor = Predictor
