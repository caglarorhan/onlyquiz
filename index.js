import QUESTIONS from './questions.js';

const OQ={
    name:'OnlyQuestions',
    questions:QUESTIONS,
    userAnswers:[],
    timer:15000,
    targetQuizPanel: document.querySelector('#quiz'),
    init(){
        this.createQuestionPanel();
        this.placeAQuestion(this.fetchAQuestion({question_index:0}));
    },
    createQuestionPanel(){
        //
        const questionPanel = document.createElement('div');
        questionPanel.id = 'question';
        this.targetQuizPanel.appendChild(questionPanel);
        //
        const progressBar = document.createElement('progress');
        progressBar.classList.add('progress');
        questionPanel.appendChild(progressBar);
        //
        const questionText = document.createElement('h2');
        questionPanel.appendChild(questionText);
        //
        const answersList = document.createElement('ul');
        answersList.id = 'answers';
        questionPanel.appendChild(answersList);

    },
    moveToTheNextQuestion(){
        let currentQuestionIndex = this.userAnswers.length;
        if(currentQuestionIndex<this.questions.length){
            this.placeAQuestion(this.fetchAQuestion({question_index:currentQuestionIndex}));
        }else{
            this.showResults();
        }
    },
    fetchAQuestion(dataObj={question_index:0}){
        let questionObj = this.questions[dataObj.question_index];
        let questionText = questionObj.text;
        let answerOptions = questionObj.answers.sort(()=>Math.random()-0.5);
        return {questionText,answerOptions};
    },
    placeAQuestion(questionObject={questionText:String, answerOptions:Array}){
        const progressBar = this.targetQuizPanel.querySelector('progress');
        const questionText = this.targetQuizPanel.querySelector('h2');
        questionText.textContent = questionObject.questionText;
        const answersList = this.targetQuizPanel.querySelector('ul');
        answersList.innerHTML = '';
        progressBar.value=this.timer;
        progressBar.max=this.timer;
        let timerSet = setInterval(()=>{
            progressBar.value-=100;
            if(progressBar.value===0){
                clearInterval(timerSet);
                this.userAnswers.push(null);
                this.moveToTheNextQuestion();
            }
        },100)
        questionObject.answerOptions.forEach((answer)=>{
            const answerListItem = document.createElement('li');
            answerListItem.classList.add('answer');
            const answerButton = document.createElement('button');
            answerButton.textContent = answer;
            answerButton.addEventListener('click',(event)=>{
                clearInterval(timerSet);
                this.answerAcceptingProgress(event,answer);
            })
            answerListItem.appendChild(answerButton);
            answersList.appendChild(answerListItem);
        })

    },
    answerAcceptingProgress(event,answer){
        const srcButton = event.target;
        srcButton.classList.add('answered');
        //this.targetQuizPanel.querySelector('ul li button').forEach(btn=>btn.disabled=true);
        setTimeout(()=>{
            if(answer===this.questions[this.userAnswers.length].answers[0]){
                srcButton.classList.remove('answered');
                srcButton.classList.add('correct');
            }else{
                srcButton.classList.remove('answered');
                srcButton.classList.add('wrong');
            }
            setTimeout(()=>{
                this.userAnswers.push(answer);
                this.moveToTheNextQuestion();
            },2000)
        },1000)

    },
    showResults(){
        if(this.questions.length===this.userAnswers.length){

            let correctAnswerCount=0;
            this.questions.forEach((question,index)=>{
                if(question.answers[0]===this.userAnswers[index]){
                    correctAnswerCount++;
                }
            })
            this.targetQuizPanel.innerHTML = `
            <div id='question'>
                <h2>Quiz Completed</h2>
                <img src='./assets/quiz-complete.png' alt='Quiz Completed' />
                <h3>You have answered ${correctAnswerCount} out of ${this.questions.length} questions correctly.</h3>
            </div>
        `;}

    }


}

window.addEventListener('DOMContentLoaded',()=>{
    OQ.init();
})
