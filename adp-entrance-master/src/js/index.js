$(document).ready( () => {
    //global variables
    let score = 0;
    let running_question = 0;
    const delay_before_next = 2000;
    let quiz;

    $('#quiz-page').css('display', 'none');
    $('#result-page').css('display', 'none');
    
    $.get("./quiz.json")
        .then(function (json) {
            
            //initiate the quiz titles
            for([index, quiz] of json.quizzes.entries()){
                ++index;
                const selector = '.quiz'+index;
                $(selector).html(`<span>${quiz.title}</span>`);
            }
            
            //on first quiz
            $('#quiz1').on('click', () => {
                quiz = 0;
                $('#score').html(updateScore(score));
                renderingQuestion(quiz, json, running_question);
            });

            //on second quiz
            $('#quiz2').on('click', () => {
                quiz = 1;
                $('#score').html(updateScore(score));
                renderingQuestion(quiz, json, running_question);
            });

            //listen and update the answer on user click
            $(document).on('click', '.ans', (e) => {
                let selectedAnswer = e.target.id;
                validateQuestion(quiz, json, running_question);
                if(selectedAnswer == 'true'){
                    score += 33.33; 
                }
                $('#score').html(updateScore(score));
                setTimeout( function(){  //set the timeout to 2second
                    running_question++;
                    if(running_question < 3){
                        renderingQuestion(quiz, json, running_question);
                    }else{
                        $('#start-page').css('display', 'none');
                        $('#quiz-page').css('display', 'none');
                        $('#result-page').css('display', 'block');
                        RenderingResult(score);
                    }
                }, delay_before_next);
            })
        }, error => {
            alert('Sorry, we couldn\'t load you json file');
        });



    //handle question display
    function renderingQuestion(quiz, data, rq) {
        $('#start-page').css('display', 'none');
        $('#quiz-page').css('display', 'block');
        const q = data.quizzes[quiz].questions[rq];
        let a = ""; //for answers
        for (element of q.answers) {
            a += `<div id="ans" class="ans col-md-6 col-sm-12 mb-5">
                        <div id="${element.value}" class="answer">${element.content}</div>
                    </div>`;
        }
        const question = `
                <div class="card text-center mt-5">
                <div class="card-header">
                    <div class="text-center sub-title">${q.question}</div>
                </div>
                <div class="card-body p-5">
                    <div id="answers" class="row">
                    ${a}
                    </div>
                </div>
            </div>
            `;
        $('#questions').html(question);
    }

    //check and validate a question
    function validateQuestion(quiz, data, rq){
        const q = data.quizzes[quiz].questions[rq];
        $('#questions').html(""); //we empty the place holder and rerender it accordingly base on user answer
        let a = ""; //for conpiling the answer
        for (element of q.answers) {
            if(element.value){
                a += `<div id="ans" class="ans col-md-6 col-sm-12 mb-5">
                        <div class="answer bg-success text-white">${element.content}</div>
                    </div>`;
            }else{
                a += `<div id="ans" class="ans col-md-6 col-sm-12 mb-5">
                        <div class="answer bg-danger text-white">${element.content}</div>
                    </div>`;
            }
        }
        const question = `
                <div class="card text-center mt-5">
                <div class="card-header">
                    <div class="text-center sub-title">${q.question}</div>
                </div>
                <div class="card-body p-5">
                    <div id="answers" class="row">
                    ${a}
                    </div>
                </div>
            </div>
            `;
        $('#questions').html(question);
    }

    //updage score
    function updateScore(s){
        return `<div class="text-right mt-5">
                    <h1>Score: ${s}%</h1>
                </div>`;
    }

    //display quiz result
    function RenderingResult(finalScore){
        if(finalScore > 50){
           $('#result').html(`<a href="#" class="btn btn-block btn-success btn-quiz-start mr-5">Congratulation! you pass with: ${finalScore}</a>`);
        }else{
            $('#result').html(`<a href="#" class="btn btn-block btn-danger btn-quiz-start">Oooops! You failed with a score of: ${finalScore}</a>`);
        }
    }

})


