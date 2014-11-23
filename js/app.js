var app = angular.module('tracker', ['ui.router']);

//ui-router state management

app.config(function($stateProvider, $urlRouterProvider){

	// For any unmatched url, send to 
	$urlRouterProvider.otherwise("/games")

	$stateProvider
		.state('games', {
			url: '/games',
			templateUrl: 'html/games.html',
			controller: 'GamesController',
			data: {
				display: 'Games'
			}
		})
		.state('phase_10', {
			url: '/phase_10',
			templateUrl: 'html/games/phase_10.html',
			controller: 'Phase10Controller',
			data: {
				display: 'Phase 10'
			}
		})
		.state('uno', {
			url: '/uno',
			templateUrl: 'html/games/uno.html',
			controller: 'UnoController',
			data: {
				display: 'UNO'
			}
		})
		.state('munchkin', {
			url: '/munchkin',
			templateUrl: 'html/games/munchkin.html',
			controller: 'MunchkinController',
			data:{
				display: 'Munchkin'
			}
		})
		.state('cribbage', {
			url: '/cribbage',
			templateUrl: 'html/games/cribbage.html',
			controller: 'CribbageController',
			data: {
				display: 'Cribbage'
			}
		})
		.state('players', {
			url: '/players',
			templateUrl: 'html/players.html',
			controller: 'PlayersController',
			data: {
				display: 'Players'
			}
		})
		.state('about', {
			url:'/about',
			templateUrl: 'html/about.html',
			controller: 'AboutController',
			data: {
				display: 'About'
			}
		})
		.state('donate', {
			url:'/donate',
			templateUrl: 'html/donate.html',
			controller: 'DonateController',
			data: {
				display: 'Donate'
			}
		})
		.state('feedback', {
			url:'/feedback',
			templateUrl: 'html/feedback.html',
			controller: 'FeedbackController',
			data: {
				display: 'Feedback'
			}
		});
});

//Pages

app.controller('PrimaryController', ['$scope', '$rootScope', '$state', function(scope, root, state) {

	// VARIABLES
	scope.menu = {
		show: false
	};
	scope.current_page = '';
	root.players = localStorage['players'] ? JSON.parse(localStorage['players']) : [];

	//LISTENERS
	root.$on('$stateChangeStart', function(event, toState) {
		scope.current_page = toState;
		scope.menu.show = false;
	});

	root.$watch('players', function(players) {
		for (var i = 0; i < players.length; i++){
			var player = players[i];
			delete players[i].$$hashKey;
		}
		var players_string = JSON.stringify(players);
		if (localStorage['players'] !== players_string) {
			localStorage['players'] = players_string;
		}

		if (!players.length) {
			setTimeout(function() {
				state.go('players');
			}, 10);
		}
	}, true);
	scope.winning_messages = [
		'$WINNER has won! Bow down to your new ruler!',
		'Everyone here now hates you, $WINNER.',
		'$WINNER clearly cheated.',
		'Congratulations $WINNER! Your mother would be so proud.'
	];

	$(document).click(function(e) {
		var element = $(e.target);
		//menu close
		if (!element.parents('menu').length && !element.hasClass('menu') && element.attr('id') !== 'menu-button' && !element.parents('#menu-button').length) {
			$('menu .close').click();
		}

		//lightbox close
		if (!element.hasClass('lightbox')) {
			return;
		}
		element.find('button.cancel').click();
	});
}]);

app.controller('GamesController', ['$scope', function(scope) {
	scope.games = [
		{
			name: 'Cribbage',
			icon: 'cribbage_icon.png',
			link: 'cribbage'
		},
		{
			name: 'Munchkin', 
			icon: 'munchkin_icon.png',
			link: 'munchkin'
		},
		{
			name: 'Phase 10',
			icon: 'phase_10_icon.png',
			link: 'phase_10'
		},
		{
			name: 'UNO',
			icon: 'uno_icon.png',
			link: 'uno'
		}
	];
}]);

app.controller('PlayersController', ['$scope', '$rootScope', function(scope, root) {
	//VARIABLES
	root.players = localStorage['players'] ? JSON.parse(localStorage['players']) : [];
	scope.add = false;
	scope.edit = {
		show: false,
		player: {}
	};
	scope.name = '';

	//FUNCTIONS
	scope.add_player = function() {
		var repeated = false;
		$.each(scope.players, function(i, player) {
			if(player.name === scope.name) {
				repeated = true;
			}
		});
		if (repeated) {
			alert('Looks like you already have a player named ' + scope.name + '. Why don\'t you try something like ' + scope.name + '-dawg, or ' + scope.name + '69?');
			return;
		}
		if ($.trim(scope.name) === '') {
			return;
		}
		var new_player = {
			name: scope.name,
			since: new Date()
		};
		root.players.push(new_player);
		scope.name = '';
		scope.add = false;
	};

	scope.save_player = function(player) {
		player.name = scope.name;
		scope.name = '';
		scope.edit.show = false;
		scope.edit.player = {};
		localStorage['players'] = JSON.stringify(root.players);
	};

	scope.delete_player = function(player) {
		var confirm = window.confirm('Are you sure you want to delete ' + player.name + '?');
		if (confirm) {
			$.each(scope.players, function(i, p) {
				if (p.name === player.name) {
					scope.players.splice(i, 1);
					return;
				}
			});
		}
	};

	//LISTENERS
	scope.$watch('add', function(add) {
		if (add === true) {
			$('#input-name').focus();
		}
	});
	scope.$watch('edit.show', function(show) {
		if (show === true) {
			scope.name = scope.edit.player.name;
			$('#input-name').focus();
		}
	});
}]);

app.controller('AboutController', ['$scope', '$rootScope', function(scope, root) {
}]);

app.controller('DonateController', ['$scope', '$rootScope', function(scope, root) {
}]);

app.controller('FeedbackController', ['$scope', '$rootScope', '$http', function(scope, root, http) {
	//VARIABLES
		scope.type="General Comment";

	//FUNCTIONS
		scope.submit = function() {
			scope.sending = true;
			var post_data = {
				name: scope.name,
				from: scope.email,
				subject: '[Game Tracker] ' + scope.name + ' has a ' + scope.type,
				message: scope.comment,
				to: 'spencer@wattydev.com'
			};

			$.ajax({
				url: 'http://wattydev.com/projects/game_tracker/feedback.php',
				method: 'POST',
				data: post_data,
				success: function(data, status, headers, config) {
					scope.sending = false;
					scope.success = true;
					scope.commont = '';
					scope.$apply();
				},
				error: function(data, status, headers, config) {
					scope.sending = false;
					scope.success = false;
					scope.$apply();
				}
			});
		};
}]);

//Games

app.controller('Phase10Controller', ['$scope', '$rootScope', function(scope, root) {
	//VARIABLES
	scope.current_game = localStorage['phase_10_current'] ? JSON.parse(localStorage['phase_10_current']) : {};
	scope.game_history = localStorage['phase_10_history'] ? JSON.parse(localStorage['phase_10_history']) : [];
	//limit game_history to 20
	if (scope.game_history.length > 20) {
		scope.game_history.splice(20, 1);
	}
	scope.new = false;
	scope.phase_rules = 'true';
	scope.track_dealer = 'true';
	scope.mixed_game = 'false';
	scope.stock_phases = [
		'2 sets of 3',
		'1 set of 3 + 1 run of 4',
		'1 set of 4 + 1 run of 4',
		'1 run of 7',
		'1 run of 8',
		'1 run of 9',
		'2 sets of 4',
		'7 cards of 1 color',
		'1 set of 5 + 1 set of 2',
		'1 set of 5 + 1 set of 3'
	];
	scope.random_phases = [
		'2 sets of 3',
		'Full House (1 set of 3 + 1 pair)',
		'Royal Flush (12 + 11 + 10 + 9 + 8)',
		'1 set of 3 + 1 skip',
		'1 set of 3 + 1 run of 3',
		'1 set of 3 + 1 run of 4',
		'1 set of 4 + 1 run of 4',
		'4 pairs',
		'5 pairs',
		'2 runs of 3',
		'2 runs of 4',
		'2 runs of 5',
		'1 run of 4 of one color',
		'1 run of 5 of one color',
		'1 run of 7',
		'1 run of 8',
		'1 run of 9',
		'1 run of 10',
		'2 sets of 4',
		'2 sets of 4 + 1 set of 2',
		'7 cards of 1 color',
		'8 cards of 1 color',
		'9 cards of 1 color',
		'10 cards of 1 color',
		'11 cards of 1 color',
		'2 cards of each color',
		'1 set of 5 + 1 set of 2',
		'1 set of 5 + 1 set of 3',
		'1 set of 5 + 1 set of 4',
		'2 sets of 5',
		'7 cards of 1 color + 3 cards of different colors',
		'1 run of 6 odd numbers of one color + 1 set of 3',
		'1 run of 5 even numbers of one color + 1 set of 3',
		'3 sets of 3',
		'1 run of 3 of same color + 1 set of 3',
		'1 run of 4 of same color + 1 set of 4',
		'4 sets of 2 with no wilds',
		'1 run of 5 + 1 set of 5',
		'8 of one color with no wilds',
		'1 set of 7 + 1 set of 2',
		'2 runs of 4 with no wilds',
		'3 sets of 3 using 3 colors',
		'5 sets of 2 in same color',
		'1 run of 9 in 2 alternating colors'
	];
	scope.new_round = false;

	//FUNCTIONS
	scope.start = function() {
		var settings = {
			track_dealer: scope.track_dealer,
			phase_rules: scope.phase_rules,
			mixed: scope.mixed_game,
			players: []
		};
		var phases;
		if (settings.mixed === 'false') {
			phases = scope.stock_phases;
		} else {
			phases = [];
			get_random_phases();
			function get_random_phases() {
				var i = Math.floor(Math.random() * (scope.random_phases.length - 1));
				if (phases.indexOf(scope.random_phases[i]) > -1) {
					get_random_phases();
					return;
				}
				phases.push(scope.random_phases[i]);
				if (phases.length < 10) {
					get_random_phases();
				}
				return;
			}
		}
		$('.select-player').each(function(){
			if ($(this).is(':checked')){
				var person = JSON.parse($(this).val());
				settings.players.push(person);
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = true;
					}
				});
			} else {
				var person = JSON.parse($(this).val());
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = false;
					}
				});
			}
		});
		scope.current_game = {
			settings: settings,
			scores: [],
			phases: phases
		};
		$.each(scope.current_game.settings.players, function(i, player) {
			var person = {};
			person.player = player;
			person.score = 0;
			person.phase = 1;
			person.dealer = false;
			scope.current_game.scores.push(person);
		});

		//set dealer
		var random = Math.random() * (scope.current_game.scores.length - 1);
		random = Math.floor(random);
		scope.current_game.scores[random].dealer = true;
		scope.current_game.started = true;
		scope.new = false;
	};

	scope.end_round = function() {
		$.each(scope.current_game.scores, function(i, player) {
			player.phase_score = 0;
			player.pass_phase = 'false';
		});
		scope.new_round = true;
	};

	scope.save_round = function() {
		var current_dealer;
		var winners = [];
		$.each(scope.current_game.scores, function(i, player) {
			var round = {
				passed: player.pass_phase,
				score: player.phase_score
			};
			if (!player.rounds) {
				player.rounds = [];
			}
			player.rounds.push(round);
			player.score += player.phase_score;
			if (player.pass_phase === 'true') {
				player.phase++;
			}
			if (player.phase === 11) {
				player.phase = 10;
				winners.push(player);
			}
			if (player.dealer) {
				current_dealer = i;
				player.dealer = false;
			}
		});

		var next_dealer = current_dealer + 1;
		if (next_dealer === scope.current_game.scores.length) {
			next_dealer = 0;
		}
		if (winners.length) {
			if (winners.length > 1) {
				winners.sort(function(a,b) {
					return a.score - b.score;
				});
			}
			scope.end_game(winners[0]);
		}
		scope.current_game.scores[next_dealer].dealer = true;
		scope.new_round = false;
	};

	scope.end_game = function(winner) {
		scope.winner_name = winner.player.name;
		scope.message = scope.winning_messages[Math.floor(Math.random() * (scope.winning_messages.length - 1))];
		scope.message = scope.message.replace('$WINNER', scope.winner_name);
		scope.current_game.winner = winner;
		if (!scope.game_history) {
			scope.game_history = [];
		}
		scope.current_game.date = new Date();
		scope.game_history.push(scope.current_game);
		scope.new_round = false;
		scope.game_over = true;
	};

	scope.stop_game = function() {
		var players = JSON.parse(JSON.stringify(scope.current_game.scores));
		var tie = false;
		players.sort(function(a,b) {
			if (a.phase === b.phase) {
				if (a.score === b.score) {
					tie = true;
				}
				return a.score - b.score;

			}
			return b.phase - a.phase;
		});

		if (tie) {
			tie = {
				player:{
					name: 'Tie Game'
				}
			};
			scope.end_game(tie);
			return;
		}
		scope.end_game(players[0]);
	};

	scope.undo_round = function() {
		if (!scope.current_game.scores[0].rounds || !scope.current_game.scores[0].rounds.length) {
			return;
		}
		//revert scores
		var dealer;
		$.each(scope.current_game.scores, function(i, person) {
			last = person.rounds[person.rounds.length - 1];
			person.score = person.score - last.score;
			if (last.passed === 'true') {
				person.phase = person.phase - 1;
			}
			if (person.dealer) {
				dealer = i;
				person.dealer = false;
			}
			person.rounds.splice(person.rounds.length - 1, 1);
		});
		//revert dealer
		dealer = dealer - 1;
		if (dealer < 0) {
			dealer = scope.current_game.scores.length -1;
		}
		scope.current_game.scores[dealer].dealer = true;
	};

	//LISTENERS
	scope.$watch('current_game', function(current) {
		if (JSON.stringify(current) !== localStorage['phase_10_current']) {
			localStorage['phase_10_current'] = JSON.stringify(current);
		}
	}, true);

	scope.$watch('game_history', function(history) {
		if (JSON.stringify(history) !== localStorage['phase_10_history']) {
			for (var i = 0; i < history.length; i++){
				delete history[i].$$hashKey;
			}
			history.sort(function(a, b) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
			localStorage['phase_10_history'] = JSON.stringify(history);
		}
	}, true);
}]);

app.controller('UnoController', ['$scope', '$rootScope', function(scope, root) {

	//VARIABLES
	scope.current_game = scope.current_game = localStorage['uno_current'] ? JSON.parse(localStorage['uno_current']) : {};
	scope.game_history = localStorage['uno_history'] ? JSON.parse(localStorage['uno_history']) : [];
	//limit game_history to 20
	if (scope.game_history.length > 20) {
		scope.game_history.splice(20, 1);
	}
	scope.new = false;
	scope.track_dealer = 'true';
	scope.goal = 250;
	scope.new_round = false;

	window.current = scope.current_game;
	//FUNCTIONS
	scope.start = function() {
		var settings = {
			track_dealer: scope.track_dealer,
			goal: scope.goal,
			players: []
		};
		$('.select-player').each(function(){
			if ($(this).is(':checked')){
				var person = JSON.parse($(this).val());
				settings.players.push(person);
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = true;
					}
				});
			} else {
				var person = JSON.parse($(this).val());
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = false;
					}
				});
			}
		});
		scope.current_game = {
			settings: settings,
			scores: []
		};
		$.each(scope.current_game.settings.players, function(i, player) {
			var person = {};
			person.player = player;
			person.score = 0;
			person.dealer = false;
			scope.current_game.scores.push(person);
		});

		//set dealer
		var random = Math.random() * (scope.current_game.scores.length - 1);
		random = Math.floor(random);
		scope.current_game.scores[random].dealer = true;
		scope.current_game.started = true;
		scope.new = false;
	};

	scope.end_round = function() {
		$.each(scope.current_game.scores, function(i, player) {
			player.round_score = 0;
		});
		scope.new_round = true;
	};

	scope.save_round = function() {
		var current_dealer;
		var winners = [];
		$.each(scope.current_game.scores, function(i, player) {
			var round = {
				score: player.round_score
			};
			if (round.score === '') {
				round.score = 0;
			}
			if (!player.rounds) {
				player.rounds = [];
			}
			player.rounds.push(round);
			player.score += player.round_score;
			if (player.score >= scope.current_game.settings.goal) {
				var players = JSON.parse(JSON.stringify(scope.current_game.scores));
				players.sort(function(a, b) {
					return a.score - b.score;
				});
				winners.push(players[0]);
			}
			if (player.dealer) {
				current_dealer = i;
				player.dealer = false;
			}
		});

		//pick next dealer
		var next_dealer = current_dealer + 1;
		if (next_dealer === scope.current_game.scores.length) {
			next_dealer = 0;
		}
		if (winners.length) {
			if (winners.length > 1) {
				winners.sort(function(a,b) {
					return a.score - b.score;
				});
			}
			scope.end_game(winners[0]);
		}
		scope.current_game.scores[next_dealer].dealer = true;
		scope.new_round = false;
	};

	scope.end_game = function(winner) {
		scope.winner_name = winner.player.name;
		scope.message = scope.winning_messages[Math.floor(Math.random() * (scope.winning_messages.length - 1))];
		scope.message = scope.message.replace('$WINNER', scope.winner_name);
		scope.current_game.winner = winner;
		if (!scope.game_history) {
			scope.game_history = [];
		}
		scope.current_game.date = new Date();
		scope.game_history.push(scope.current_game);
		scope.new_round = false;
		scope.game_over = true;
	};

	scope.stop_game = function() {
		var players = JSON.parse(JSON.stringify(scope.current_game.scores));
		var tie = false;
		players.sort(function(a,b) {
			if (a.score === b.score) {
				tie = true;
			}
			return b.score - a.score;
		});

		if (tie) {
			tie = {
				player:{
					name: 'Tie Game'
				}
			};
			scope.end_game(tie);
			return;
		}
		scope.end_game(players[0]);
	};

	scope.undo_round = function() {
		if (!scope.current_game.scores[0].rounds || !scope.current_game.scores[0].rounds.length) {
			return;
		}
		//revert scores
		var dealer;
		$.each(scope.current_game.scores, function(i, person) {
			last = person.rounds[person.rounds.length - 1];
			person.score = parseInt(person.score) - parseInt(last.score);
			if (person.dealer) {
				dealer = i;
				person.dealer = false;
			}
			person.rounds.splice(person.rounds.length - 1, 1);
		});
		//revert dealer
		dealer = dealer - 1;
		if (dealer < 0) {
			dealer = scope.current_game.scores.length -1;
		}
		scope.current_game.scores[dealer].dealer = true;
	};

	//LISTENERS
	scope.$watch('current_game', function(current) {
		if (JSON.stringify(current) !== localStorage['uno_current']) {
			localStorage['uno_current'] = JSON.stringify(current);
		}
	}, true);

	scope.$watch('game_history', function(history) {
		if (JSON.stringify(history) !== localStorage['uno_history']) {
			for (var i = 0; i < history.length; i++){
				delete history[i].$$hashKey;
			}
			history.sort(function(a, b) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
			localStorage['uno_history'] = JSON.stringify(history);
		}
	}, true);
}]);

app.controller('MunchkinController', ['$scope', '$rootScope', function(scope, root) {

	//VARIABLES

	scope.current_game = scope.current_game = localStorage['munchkin_current'] ? JSON.parse(localStorage['munchkin_current']) : {};
	scope.game_history = localStorage['munchkin_history'] ? JSON.parse(localStorage['munchkin_history']) : [];
	//limit game_history to 20
	if (scope.game_history.length > 20) {
		scope.game_history.splice(20, 1);
	}
	scope.show_die = false;
	scope.new = false;

	window.current = scope.current_game;

	//FUNCTIONS

	scope.start = function() {
		var settings = {
			players: []
		};
		$('.select-player').each(function(){
			if ($(this).is(':checked')){
				var person = JSON.parse($(this).val());
				settings.players.push(person);
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = true;
					}
				});
			} else {
				var person = JSON.parse($(this).val());
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = false;
					}
				});
			}
		});
		scope.current_game = {
			settings: settings,
			scores: []
		};
		$.each(scope.current_game.settings.players, function(i, player) {
			var person = {};
			person.player = player;
			person.level = 1;
			person.bonus = 0;
			scope.current_game.scores.push(person);
		});

		//set dealer
		scope.current_game.started = true;
		scope.new = false;
	};

	scope.end_game = function(winner) {
		scope.winner_name = winner.player.name;
		scope.message = scope.winning_messages[Math.floor(Math.random() * (scope.winning_messages.length - 1))];
		scope.message = scope.message.replace('$WINNER', scope.winner_name);
		scope.current_game.winner = winner;
		if (!scope.game_history) {
			scope.game_history = [];
		}
		scope.current_game.date = new Date();
		scope.game_history.push(scope.current_game);
		scope.game_over = true;
	};

	scope.stop_game = function() {
		var players = JSON.parse(JSON.stringify(scope.current_game.scores));
		var tie = false;
		players.sort(function(a,b) {
			if (a.level === b.level) {
				tie = true;
			}
			return b.level - a.level;
		});

		if (tie) {
			tie = {
				player:{
					name: 'Tie Game'
				}
			};
			scope.end_game(tie);
			return;
		}
		scope.end_game(players[0]);
	};

	scope.subtract = function(person, property) {
		if (property !== 'level' && person[property] > 0) {
			person[property]--;
		}else if (person[property] > 1){
			person[property]--;
		}
	};

	scope.add = function(person,property) {
		person[property]++;
		//check if game is over;
		if (property === 'level' && person.level === 11) {
			scope.end_game(person);
		}
	};

	scope.roll_die = function() {
		var last = scope.die;
		scope.die = Math.floor(Math.random()*6+1);
		if (scope.die === last) {
			var container = $('#cube').parents('.container')
			container.addClass('spin');
			setTimeout(function() {
				container.removeClass('spin');
			}, 1000);
		}
		scope.show_die = true;
	};

	//LISTENERS
	scope.$watch('current_game', function(current) {
		if (JSON.stringify(current) !== localStorage['munchkin_current']) {
			localStorage['munchkin_current'] = JSON.stringify(current);
		}
	}, true);

	scope.$watch('game_history', function(history) {
		if (JSON.stringify(history) !== localStorage['munchkin_history']) {
			for (var i = 0; i < history.length; i++){
				delete history[i].$$hashKey;
			}
			history.sort(function(a, b) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
			localStorage['munchkin_history'] = JSON.stringify(history);
		}
	}, true);
}]);

app.controller('CribbageController', ['$scope', '$rootScope', function(scope, root) {
	//VARIABLES

	scope.current_game = scope.current_game = localStorage['cribbage_current'] ? JSON.parse(localStorage['cribbage_current']) : {};
	scope.game_history = localStorage['cribbage_history'] ? JSON.parse(localStorage['cribbage_history']) : [];
	//limit game_history to 20
	if (scope.game_history.length > 20) {
		scope.game_history.splice(20, 1);
	}
	scope.track_dealer = 'true';
	scope.new = false;
	scope.add_score = false;
	scope.add_score_value = 0;

	window.current = scope.current_game;

	//FUNCTIONS

	scope.start = function() {
		var settings = {
			players: [],
			track_dealer: scope.track_dealer
		};
		$('.select-player').each(function(){
			if ($(this).is(':checked')){
				var person = JSON.parse($(this).val());
				settings.players.push(person);
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = true;
					}
				});
			} else {
				var person = JSON.parse($(this).val());
				$.each(root.players, function(i, player) {
					if (player.name === person.name) {
						player.prev = false;
					}
				});
			}
		});
		scope.current_game = {
			settings: settings,
			scores: []
		};
		$.each(scope.current_game.settings.players, function(i, player) {
			var person = {};
			person.player = player;
			person.points = 0;
			person.dealer = false;
			person.scored_hand = false;
			person.scored_crib = false;
			scope.current_game.scores.push(person);
		});

		//set dealer
		//set dealer
		var random = Math.random() * (scope.current_game.scores.length - 1);
		random = Math.floor(random);
		scope.current_game.scores[random].dealer = true;
		scope.current_game.started = true;
		scope.new = false;
	};

	scope.end_game = function(winner) {
		scope.winner_name = winner.player.name;
		scope.message = scope.winning_messages[Math.floor(Math.random() * (scope.winning_messages.length - 1))];
		scope.message = scope.message.replace('$WINNER', scope.winner_name);
		scope.current_game.winner = winner;
		if (!scope.game_history) {
			scope.game_history = [];
		}
		scope.current_game.date = new Date();
		scope.game_history.push(scope.current_game);
		scope.game_over = true;
	};

	scope.stop_game = function() {
		var players = JSON.parse(JSON.stringify(scope.current_game.scores));
		var tie = false;
		players.sort(function(a,b) {
			if (a.points === b.points) {
				tie = true;
			}
			return b.points - a.points;
		});

		if (tie) {
			tie = {
				player:{
					name: 'Tie Game'
				}
			};
			scope.end_game(tie);
			return;
		}
		scope.end_game(players[0]);
	};

	scope.subtract = function(person) {
		if (person.points > 0) {
			person.points--;
		}
	};

	scope.add = function(person) {
		person.points++;
		//check if game is over;
		if (person.points === 121) {
			scope.end_game(person);
		}
	};

	scope.add_hand = function(person, scoring) {
		scope.add_score = person;
		scope.scoring = 'scored_' + scoring;
	};

	scope.save = function() {
		if (scope.add_score.points + scope.add_score_value > 121) {
			scope.add_score.points = 121;
			scope.end_game(scope.add_score);
		} else {
			scope.add_score.points += scope.add_score_value;
		}
		scope.add_score[scope.scoring] = true;
		scope.add_score = false;
		scope.add_score_value = 0;

		var end_round = true;
		$.each(scope.current_game.scores, function(i, person) {
			if (!person.scored_hand) {
				end_round = false;
				return;
			}
			if (person.dealer && !person.scored_crib) {
				end_round = false;
				return;
			}
		});

		if (end_round) {
			scope.end_round();
		}
	};

	scope.end_round = function() {
		var current_dealer;
		$.each(scope.current_game.scores, function(i, person) {
			if (person.dealer === true) {
				current_dealer = i;
			}
			person.dealer = false;
			person.scored_hand = false;
			person.scored_crib = false;
		});

		var next_dealer = current_dealer + 1;
		if (next_dealer === scope.current_game.scores.length) {
			next_dealer = 0;
		}
		scope.current_game.scores[next_dealer].dealer = true;
	};

	//LISTENERS
	scope.$watch('current_game', function(current) {
		if (JSON.stringify(current) !== localStorage['cribbage_current']) {
			localStorage['cribbage_current'] = JSON.stringify(current);
		}
	}, true);

	scope.$watch('game_history', function(history) {
		if (JSON.stringify(history) !== localStorage['cribbage_history']) {
			for (var i = 0; i < history.length; i++){
				delete history[i].$$hashKey;
			}
			history.sort(function(a, b) {
				return new Date(b.date).getTime() - new Date(a.date).getTime();
			});
			localStorage['cribbage_history'] = JSON.stringify(history);
		}
	}, true);
}]);

//Directives

app.directive('menu', function() {
	function link(scope, element, attrs) {

	}
	return {
		restrict: 'E',
		templateUrl: 'html/menu.html',
		link: link
	};
});

app.directive('selectPlayers', function() {
	function link(scope, element, attrs) {
		scope.players = JSON.parse(localStorage['players']);

	}
	return {
		restrict: 'E',
		templateUrl: 'html/select_players.html',
		link: link
	};
});