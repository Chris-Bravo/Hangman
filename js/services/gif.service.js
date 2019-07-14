angular
    .module('HangmanApp')
    .service('gifService', ['$http', function($http) {
    
        const giphyAPI = 'https://api.giphy.com/v1/gifs/search?api_key=pGs3SO2N2cH8DpERbadlEBwSUH2uZERB&limit=5&q=';

        this.getGif = function(word){

            return $http({
                method: 'GET',
                url: `${giphyAPI}${word}`
            })

        }

}])