/**
 * Jquery password strength meter.
 * Author: Fabio Kreusch fabio@lelak.com.br, fabio@kreusch.com.br
 */
(function($){

    var methods = {
        //Original score calculation from http://www.geekwisdom.com/js/passwordmeter.js
        checkScore : function(password) {
            var intScore   = 0

            // PASSWORD LENGTH
            if (password.length<5) {
                intScore = (intScore+3);
            }
            else if (password.length>4 && password.length<8) {
                intScore = (intScore+6);
            }
            else if (password.length>7 && password.length<16) {
                intScore = (intScore+12);
            }
            else if (password.length>15) {
                intScore = (intScore+18);
            }

            // LETTERS
            if (password.match(/[a-z]/)) {
                intScore = (intScore+1);
            }

            if (password.match(/[A-Z]/)) {
                intScore = (intScore+5);
            }

            // NUMBERS
            if (password.match(/\d+/)) {
                intScore = (intScore+5);
            }

            if (password.match(/(.*[0-9].*[0-9].*[0-9])/)) {
                intScore = (intScore+5);
            }

            // SPECIAL CHAR
            if (password.match(/.[!,@,#,$,%,^,&,*,?,_,~]/)) {
                intScore = (intScore+5);
            }

            // [verified] at least two special characters
            if (password.match(/(.*[!,@,#,$,%,^,&,*,?,_,~].*[!,@,#,$,%,^,&,*,?,_,~])/)) {
                intScore = (intScore+5);
            }

            // COMBOS
            if (password.match(/([a-z].*[A-Z])|([A-Z].*[a-z])/)) {
                intScore = (intScore+2);
            }

            if (password.match(/([a-zA-Z])/) && password.match(/([0-9])/)) {
                intScore = (intScore+2);
            }

            // [verified] letters, numbers, and special characters
            if (password.match(/([a-zA-Z0-9].*[!,@,#,$,%,^,&,*,?,_,~])|([!,@,#,$,%,^,&,*,?,_,~].*[a-zA-Z0-9])/)) {
                intScore = (intScore+2);
            }

            return intScore;
        },
        evaluate : function(e, elem, settings) {
            var el = $(elem);
            var score = methods.checkScore.apply(this, [$(elem).val()]);

            if(score < 16) {
               score = 0;
            } else if (score > 15 && score < 25) {
               score = 1;
            } else if (score > 24 && score < 35) {
               score = 2;
            } else if (score > 34 && score < 45) {
               score = 3;
            } else {
               score = 4;
            }

            el.removeClass(settings.classes.join(' ')).addClass(settings.classes[score]).attr('score', score);
            settings.onScore.apply(this, [e, elem, score]);
        }
    };

    $.fn.passwordStrength = function(options) {
        var settings = {
            classes: ['veryWeakPassword', 'weakPassword', 'goodPassword', 'strongPassword', 'veryStrongPassword'],
            labels: ['Very Weak', 'Weak', 'Good', 'Strong', 'Very strong'],
            onScore: function(e, elem, score) {
              var el = $(elem);
              el.next('label').detach();
              el.after('<label for="'+el.attr('id')+'" class="'+settings.classes[score]+'"">'+settings.labels[score]+'</label>');  
            }
        };

        if(options) {
            $.extend(settings, options);
        }
    
        this.keyup(function(e){
            methods.evaluate.apply(this, [e, this, settings]);
        });
    };

})( jQuery );

