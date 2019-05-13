app.controller('GameController', ['$scope','wordService','gifService', '$timeout', function($scope, wordService, gifService, $timeout) {

    $scope.input = {};
    $scope.choseLetter = choseLetter;
    $scope.closeModal = closeModal;
    $scope.reload = reload;

    //Get Word from Wordnik API

    wordService
        .then(function(word) {
            $scope.word = word;
            
            //Get Gif from Giphy API
            
            gifService.getGif(word)
                .then(function(img) {

                    //Giphy API returns array without data :/
                    if(img.data.data.length === 0){
                        $scope.word = '';
                        newModal();

                    } else {
                        $scope.gif = img.data.data[0].images.fixed_width.url; 
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

        $scope.incorrectLettersChosen = [];
        $scope.correctLettersChosen = [];
        $scope.guesses = 6;
        $scope.tempWord = $scope.word
            .split('')
            .map(function (letter){
                return letter = 'x';
            })
            .join('');

    }

    function choseLetter() {

        if($scope.tempWord.indexOf($scope.input.letter) >= 0){
            $scope.error = true;
            $scope.errorType = 'Enter a new letter';
            $scope.input.letter = '';

            
            $timeout(function(){
                $scope.error = false;
            }, 2000)

            return;
        }

        if($scope.input.letter.trim() === ''){
            
            $scope.error = true;
            $scope.errorType = 'Enter a letter';
            $scope.input.letter = '';

            $timeout(function(){
                $scope.error = false;
            }, 2000)

            return;
        }

        $scope.input.letter = $scope.input.letter.toLowerCase();

        if($scope.word.toLowerCase().indexOf($scope.input.letter) >= 0) {

            $scope.correctLettersChosen.push($scope.input.letter);

            var index = $scope.word.toLowerCase().indexOf($scope.input.letter);

            $scope.tempWord = $scope.tempWord.split('')
            $scope.tempWord.splice(index, 1, $scope.input.letter)
            $scope.tempWord = $scope.tempWord.join('')
            
            while (index !== -1) {

                index = $scope.word.toLowerCase().indexOf($scope.input.letter, index + 1);

                if (index >= 0){
                    $scope.tempWord = $scope.tempWord.split('')
                    $scope.tempWord.splice(index, 1, $scope.input.letter)
                    $scope.tempWord = $scope.tempWord.join('')
                }
                if($scope.tempWord.indexOf('x') === -1){
                    newModal('win');
                }
            
            }

            
        }
        else if($scope.word.toLowerCase().indexOf($scope.input.letter) < 0) {
            $scope.incorrectLettersChosen.push($scope.input.letter);
            $scope.guesses--;

            if($scope.guesses === 0){
                newModal('lose')
            }
        }
        $scope.input.letter = '';
    }

    function closeModal() {
        $scope.modal = false;
    }

    function newModal(type){
        $scope.modal = true;

        if(type === 'win'){
            $scope.modalText = '🏆 You Win! 🏆'
        } else if(type === 'lose'){
            $scope.modalText = '😔 You Lose! 😔'
        } else {
            $scope.modalText = '😅 something bad happened 😅'
        }

    }

    function reload(){
        location.reload();
    }




}]);