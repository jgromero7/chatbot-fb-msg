searchWords = {};
const fuzz = require('fuzzball');

searchWords.isContain = (sentence, word) => {
    return sentence.indexOf(word) > -1;
}

searchWords.compareWord = (word) => {
    options = {scorer: fuzz.token_set_ratio};
    choices = ['hola', 'gato', "info"];

    result = fuzz.extract(word, choices, options);

    newResult = result.map((element) => {
        let object = {}
        object['word'] = element[0]
        object['score'] = element[1]
        return object;
    });

    return newResult;
}

module.exports = searchWords;