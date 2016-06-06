window.aphVRBetGame = (function () {
    "use strict";
    var alphabets = {
        en: ["a","b","c","d","e","f","g","h","i","j","k","l","m","n","o","p","q","r","s","t","u","v","w","x","y","z"],
        cz: []
    };
    var randomWords = [];
    var wordsAPI = "https://wordsapiv1.p.mashape.com/words/?random=true";
    var wordCount = 10;
    var aphVRBetGame = function (options) {
        var that = this;
        
        this.speak = function(text, callback){
            //say a message
            var u = new SpeechSynthesisUtterance();
             u.text = text;
             u.lang = 'en-US';

             u.onend = function () {
                 if (callback) {
                     callback();
                 }
             };

             u.onerror = function (e) {
                 if (callback) {
                     callback(e);
                 }
             };

             speechSynthesis.speak(u);
        };
        /*
         * Language support currently Czech and English
         */
        (options.language ? null : options.language = "en");
        
        /*
         * Difficulty levels:
         *  1 - word length 5, time per word: 30secs
         *  2 - word length 6, time per word: 25sec
         *  3 - word length 7, time per word: 20sec
         */
        (options.difficulty ? null : options.difficulty = 1);
        
        this.options = options;
        
        this.letters = [];
        
        this.canvas = $("#aphVRBet_canvas");
        
        this.chosenWord = $("#chosenWord");
        
        this.sayIt = $("#speak");
        this.sayIt
        .on("click", function(){
            that.speak(that.chosenWord.text());
        });
    }
    
    aphVRBetGame.prototype.start_game = function(){
        var that = this;
        //get our random words
        for(var r=0; r<wordCount; r++){
            get_word();
        }
        function get_word(){
            $.ajax({
                url: wordsAPI,
                type: 'GET', // The HTTP Method
                data: {}, // Additional parameters here
                datatype: 'json',
                success: RandomWordComplete,
                error: function(err) { console.error(err); },
                beforeSend: function(xhr) {
                    xhr.setRequestHeader("X-Mashape-Authorization", "5PQfN19auxmshl4WRBCZTrX8XmMZp1XhO73jsnzuo4y8pD9LH0"); // Enter here your Mashape key
                }
            });
        }
        function RandomWordComplete(data){
            randomWords.push(data.word);
            console.log(data);
            if(randomWords.length === wordCount){
                //$("#aphVRBet_canvas").text(randomWords.toString());
                renderAlphabet();
                chooseWord();
            }
        }
        function renderAlphabet(){
            for(var x=0; x<alphabets[that.options.language].length; x++){
                var letter = alphabets[that.options.language][x];
                that.letters.push(renderLetter(letter));
            }
            that.canvas.html(that.letters);
        };
        function renderLetter(letter){
            var $letter = $("<div class='letter'>"+letter+"</div>");
            
            $letter
            .on("mouseover", function(){
                $(this).addClass("over");
            })
            .on("mouseout", function(){
                $(this).removeClass("over");
            })
            .on("click", function(){
                var letter = $(this).text();
                that.speak(letter);
                check_letter_in_word(letter);
            });
            
            $letter.letter = letter;
            
            return $letter;
        };
        function chooseWord(){
            var index = Math.floor(Math.random() * randomWords.length) + 1;
            that.word = randomWords[index];
            randomWords.pop(index);
            that.chosenWord.html(that.word);
            that.speak(that.word);
        };
        function check_letter_in_word(letter){
            if(that.word.indexOf(letter) > -1){
                that.chosenWord.addClass("right");
                
                var to = setTimeout(function(){
                    that.chosenWord.removeClass("right");
                }, 2000);
            }else{
                that.chosenWord.addClass("wrong");
                
                var to = setTimeout(function(){
                    that.chosenWord.removeClass("wrong");
                }, 2000);
            }
        };
    };
    aphVRBetGame.prototype.end_game = function(){
        
    };
    
    return aphVRBetGame;
})();


