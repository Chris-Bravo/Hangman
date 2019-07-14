angular
    .module('HangmanApp')
    .factory('wordService', ['$http', function($http) {

        const wordAPI = 'https://api.wordnik.com/v4/words.json/randomWord?hasDictionaryDef=true&maxCorpusCount=-1&minDictionaryCount=1&maxDictionaryCount=-1&minLength=5&maxLength=-1';
        const wordAPI_KEY = '&api_key=09f92f4b1c190483034320ea5100bfe5068b46b9f9a8702dd';
            
        return $http({
            method: 'GET',
            url: `${wordAPI}${wordAPI_KEY}`
        })
        .then(function(data) {
            return data.data.word;
        })
        .catch(function(err) {
            handlingError(err)
        })

        function handlingError(err) {
            if (err.status === -1){
                throw new Error('Bad Request');
            }
            else if (err.status === 429){
                throw new Error('API rate limit exceeded');
            }
        }

}])