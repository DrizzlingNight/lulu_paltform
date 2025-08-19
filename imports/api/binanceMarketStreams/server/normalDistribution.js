(function(exports) {

    const generateGaussian = require('./box-muller');

    // Complementary error function
    // From Numerical Recipes in C 2e p221
    let erfc = function(x) {
        let z = Math.abs(x);
        let t = 1 / (1 + z / 2);
        let r = t * Math.exp(-z * z - 1.26551223 + t * (1.00002368 +
            t * (0.37409196 + t * (0.09678418 + t * (-0.18628806 +
                t * (0.27886807 + t * (-1.13520398 + t * (1.48851587 +
                    t * (-0.82215223 + t * 0.17087277)))))))))
        return x >= 0 ? r : 2 - r;
    };

    // Inverse complementary error function
    // From Numerical Recipes 3e p265
    let ierfc = function(x) {
        if (x >= 2) { return -100; }
        if (x <= 0) { return 100; }

        let xx = (x < 1) ? x : 2 - x;
        let t = Math.sqrt(-2 * Math.log(xx / 2));

        let r = -0.70711 * ((2.30753 + t * 0.27061) /
            (1 + t * (0.99229 + t * 0.04481)) - t);

        for (let j = 0; j < 2; j++) {
            let err = erfc(r) - xx;
            r += err / (1.12837916709551257 * Math.exp(-(r * r)) - r * err);
        }

        return (x < 1) ? r : -r;
    };

    // Models the normal distribution
    let Gaussian = function(mean, variance) {
        if (variance <= 0) {
            throw new Error('Variance must be > 0 (but was ' + variance + ')');
        }
        this.mean = mean;
        this.variance = variance;
        this.standardDeviation = Math.sqrt(variance);
    }

    // Probability density function
    Gaussian.prototype.pdf = function(x) {
        let m = this.standardDeviation * Math.sqrt(2 * Math.PI);
        let e = Math.exp(-Math.pow(x - this.mean, 2) / (2 * this.variance));
        return e / m;
    };

    // Cumulative density function
    Gaussian.prototype.cdf = function(x) {
        return 0.5 * erfc(-(x - this.mean) / (this.standardDeviation * Math.sqrt(2)));
    };

    // Percent point function
    Gaussian.prototype.ppf = function(x) {
        return this.mean - this.standardDeviation * Math.sqrt(2) * ierfc(2 * x);
    };

    // Product distribution of this and d (scale for constant)
    Gaussian.prototype.mul = function(d) {
        if (typeof(d) === "number") {
            return this.scale(d);
        }
        let precision = 1 / this.variance;
        let dprecision = 1 / d.variance;
        return fromPrecisionMean(
            precision + dprecision,
            precision * this.mean + dprecision * d.mean);
    };

    // Quotient distribution of this and d (scale for constant)
    Gaussian.prototype.div = function(d) {
        if (typeof(d) === "number") {
            return this.scale(1 / d);
        }
        let precision = 1 / this.variance;
        let dprecision = 1 / d.variance;
        return fromPrecisionMean(
            precision - dprecision,
            precision * this.mean - dprecision * d.mean);
    };

    // Addition of this and d
    Gaussian.prototype.add = function(d) {
        return gaussian(this.mean + d.mean, this.variance + d.variance);
    };

    // Subtraction of this and d
    Gaussian.prototype.sub = function(d) {
        return gaussian(this.mean - d.mean, this.variance + d.variance);
    };

    // Scale this by constant c
    Gaussian.prototype.scale = function(c) {
        return gaussian(this.mean * c, this.variance * c * c);
    };


    /**
     * Generate [num] random samples
     * @param {number} num
     * @param randFn - an optional function that returns a float between 0 (inclusive) and 1
     * (exclusive).  Use this if you want to pass in a random number generator other than
     * Math.random().
     * @returns {number[]}
     */
    Gaussian.prototype.random = function(num, randFn = null){
        let mean = this.mean;
        let std = this.standardDeviation;
        return Array(num).fill(0).map(() => {
            return generateGaussian(mean,std, randFn)
        })
    };

    let gaussian = function(mean, variance) {
        return new Gaussian(mean, variance);
    };

    let fromPrecisionMean = function(precision, precisionmean) {
        return gaussian(precisionmean / precision, 1 / precision);
    };

    exports(gaussian);
})
(typeof(exports) !== "undefined"
    ? function(e) { module.exports = e; }
    // istanbul ignore next
    : function(e) { this["gaussian"] = e; });
