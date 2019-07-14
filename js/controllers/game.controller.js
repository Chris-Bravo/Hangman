angular
    .module('HangmanApp')
    .controller('GameController', ['$scope','wordService','gifService', '$timeout', function($scope, wordService, gifService, $timeout) {

        this.input = {};
        this.choseLetter = choseLetter;
        this.closeModal = closeModal;
        this.reload = reload;

        //Get Word from Wordnik API

        wordService
            .then(function(word) {
                this.word = word;
                
                //Get Gif from Giphy API
                
                gifService.getGif(word)
                    .then(function(img) {

                        //Giphy API returns array without data :/
                        if(img.data.data.length === 0){
                            this.word = '';
                            newModal();

                        } else {
                            this.gif = img.data.data[0].images.fixed_width.url; 
                            newGame();
                        }

                    }).catch(function (err) {
                        console.log(err)
                    })
            })
            .catch(function(err){
                console.error(err);
            })

        function newGame() {

            this.incorrectLettersChosen = [];
            this.correctLettersChosen = [];
            this.guesses = 6;
            this.tempWord = this.word
                .split('')
                .map(function (letter){
                    return letter = 'x';
                })
                .join('');

        }

        function choseLetter() {

            if(this.tempWord.indexOf(this.input.letter) >= 0){
                this.error = true;
                this.errorType = 'Enter a new letter';
                this.input.letter = '';

                
                $timeout(function(){
                    this.error = false;
                }, 2000)

                return;
            }

            if(this.input.letter.trim() === ''){
                
                this.error = true;
                this.errorType = 'Enter a letter';
                this.input.letter = '';

                $timeout(function(){
                    this.error = false;
                }, 2000)

                return;
            }

            this.input.letter = this.input.letter.toLowerCase();

            if(this.word.toLowerCase().indexOf(this.input.letter) >= 0) {

                this.correctLettersChosen.push(this.input.letter);

                var index = this.word.toLowerCase().indexOf(this.input.letter);

                this.tempWord = this.tempWord.split('')
                this.tempWord.splice(index, 1, this.input.letter)
                this.tempWord = this.tempWord.join('')
                
                while (index !== -1) {

                    index = this.word.toLowerCase().indexOf(this.input.letter, index + 1);

                    if (index >= 0){
                        this.tempWord = this.tempWord.split('')
                        this.tempWord.splice(index, 1, this.input.letter)
                        this.tempWord = this.tempWord.join('')
                    }
                    if(this.tempWord.indexOf('x') === -1){
                        newModal('win');
                    }
                
                }

                
            }
            else if(this.word.toLowerCase().indexOf(this.input.letter) < 0) {
                this.incorrectLettersChosen.push(this.input.letter);
                this.guesses--;

                if(this.guesses === 0){
                    newModal('lose')
                }
            }
            this.input.letter = '';
        }

        function closeModal() {
            this.modal = false;
        }

        function newModal(type){
            this.modal = true;

            if(type === 'win'){
                this.modalText = '🏆 You Win! 🏆'
            } else if(type === 'lose'){
                this.modalText = '😔 You Lose! 😔'
            } else {
                this.modalText = '😅 something bad happened 😅'
            }

        }

        function reload(){
            location.reload();
        }




}]);