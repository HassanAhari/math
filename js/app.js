Vue.component('score',{
	props: ['currentScore','total'],
	template: `
		<div id="score">
			امتیاز: {{currentScore}} / {{total}}
		</div>
	`
});

Vue.component('question',{
	props: ['no1','no2','operator'],
	template: `
		<div id="question-wrapper" dir="ltr">
			<h2>{{no1}} {{operator}} {{no2}} = ?</h2>
		</div>
	`
});

Vue.component('answers',{
	props: ['options','isActive','addActiveClass'],
	template: `
		<div>
			<div id="options-wrapper" dir="ltr">
				<div class="option option-1" :class="{ active: isActive[0] }" @click="addActiveClass(0)">{{options[0]}}</div>
				<div class="option option-2" :class="{ active: isActive[1] }" @click="addActiveClass(1)">{{options[1]}}</div>
			</div>
			<div id="options-wrapper" dir="ltr">
				<div class="option option-3" :class="{ active: isActive[2] }" @click="addActiveClass(2)">{{options[2]}}</div>
				<div class="option option-4" :class="{ active: isActive[3] }" @click="addActiveClass(3)">{{options[3]}}</div>
			</div>
		<div>
	`
});

new Vue({
	el: '#app',
	data: {
		currentScore: 0,
		total: 0,
		no1: 0,
		no2: 0,
		text: 'Submit',
		operator: '+',
		selectedAnswer: 0,
		correctAnswer: 0,
		options: [],
		isActive: [false,false,false,false]
	},
	created: function(){
		this.startQuiz();
		document.getElementById("my_audio").play();
	},
	methods: {
		randomNumber: function(min,max) {
			return Math.floor(Math.random() * (max - min) + min);
		},
		twoDigit: function(x) {
			return ("00"+x).slice(-2);
		},
		shuffle: function(array) {
		  var i = 0, j = 0, temp = null;
		  for (i = array.length - 1; i > 0; i -= 1) {
		    j = Math.floor(Math.random() * (i + 1));
		    temp = array[i];
		    array[i] = array[j];
		    array[j] = temp;
		  }
		  return array;
		},
		startQuiz: function () {
			this.generateQuestion();
			this.generateOptions();
			this.resetActiveClass();
		},
		resetActiveClass: function () {
			this.isActive = [false,false,false,false];
		},
		addActiveClass: function (index) {
			this.resetActiveClass();
			this.isActive[index] = true;
			this.selectedAnswer = this.options[index];
		},
		calculateMath: function(no1, no2, operator) {
			switch (operator) {
				case '*':
					return no1 * no2
				case '-':
					return no1 - no2;
				default:
					return no1 + no2;
			}
		},
		generateQuestion: function() {
			this.no1 = this.randomNumber(1,20);
			this.no2 = this.randomNumber(1,20);
		},
		generateOptions: function() {
			var operators = ['+','-', '*'];
			var options = [];
			this.operator = operators[this.randomNumber(0,3)];
			this.correctAnswer = this.calculateMath(+this.no1,+this.no2,this.operator);
			options.push(+this.correctAnswer);
			while(options.length != 4) {
				var option = this.calculateMath(+this.correctAnswer,this.randomNumber(1,10),operators[this.randomNumber(0,2)]);
				if(options.indexOf(option) == '-1')
					options.push(option);
			}
			this.options = this.shuffle(options);
		},
		checkSolution: function() {
			if(this.isActive.indexOf(true) == -1) {
			  notie.alert({ type: 4, text: 'یکی از گزینه‌ها را انتخاب کنید.', time: 3 });
			  return;
			}
			if(this.text == 'Submit') {
				this.checkCorrectAnswer(this.selectedAnswer);
				this.text = 'Next';
			}
			else {
				this.text = 'Submit';
				this.startQuiz();
			}
		},
		checkCorrectAnswer: function(ans) {
			this.total++;
			if(ans == this.correctAnswer)
				{
					notie.alert({ type: 1, text: 'آفرین! پاسخ صحیح است.', time: 3 });
					this.currentScore++;
				}
			else notie.alert({ type: 3, text: ' پاسخ اشتباه است.', time: 3 });
		}
	}
});
