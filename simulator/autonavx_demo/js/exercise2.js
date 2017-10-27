requirejs.config({
	paths: {
		'static': '../static/exercise2/',
		'mathjs': 'math.min',
		'THREE': 'three.min',
		'jquery': 'jquery.min',
		'THREE/TrackballControls': 'three/TrackballControls',
		'THREE/ColladaLoader': 'three/ColladaLoader',
		'Skulpt': 'visnav_edx_skulpt.min',
		'Skulpt/Stdlib': 'visnav_edx_skulpt-stdlib',
	},
	shim: {
		'Skulpt': {
			exports: 'Sk'
		},
		'Skulpt/Stdlib': {
			deps: ['Skulpt'],
			exports: 'Sk.builtinFiles',
		},
		'THREE': {
			exports: 'THREE'
		},
		'THREE/TrackballControls': {
			deps: ['THREE'],
			exports: 'THREE.TrackballControls'
		},
		'THREE/ColladaLoader': {
			deps: ['THREE'],
			exports: 'THREE.ColladaLoader'
		},
	}
});

require(['require', 'domReady', 'jquery', 'init/editor', 'init/viewer', 'python/vm', 'python/simulation_proxy', 'text!static/default.py', 'text!static/internal.py'], function(require, domready) {
	domready(function() {
		$ = require('jquery');

		editor = require('init/editor')($('#editor').get(0));
		editor.getSession().setValue(require('text!static/default.py'))
		viewer = require('init/viewer')($('#viewport').get(0));

		var logview = $('#log-view');
		vm = require('python/vm')(logview.get(0));
		var simulation = require('python/simulation_proxy')(vm);

		var update_simulation_buttons = function(running) {
			$('#run-simulation').prop('disabled', running);
			$('#stop-simulation').prop('disabled', !running);
		};
		update_simulation_buttons(false);

		plot_fcns = {
			'pose': function(time, poses) {
				viewer.setOverlayText(time.toPrecision(3) + "s");

				if(poses['ardrone'] !== undefined) {
					viewer.setDronePose(poses['ardrone'][0]);
				}
			},
			'motor_command': function(time, commands) {
				if(commands['ardrone'] !== undefined) {
					viewer.setDroneMotorCommands(commands['ardrone'][0]);
				}
			},
			'trajectory': function(time, trajectories) {
				$.each(trajectories, function(name, points) {
					viewer.updateTrajectory(name, points);
				});
			},
		};

		var beacons = [];
		beacons.push(viewer.createBeacon([2, 0, 0]));
		beacons.push(viewer.createBeacon([4, 0, 0]));
		beacons.push(viewer.createBeacon([6, 0, 0]));

		$('#run-simulation').click(function() {
			update_simulation_buttons(true);
			viewer.focus();

			var code = editor.getSession().getValue();
			var code_prefix = false;
			if(!code_prefix) {
				code_prefix = require('text!static/internal.py')
			}

			code = code_prefix + code

			logview.empty();
			viewer.reset();
			$.each(beacons, function(idx, beacon) {
				beacon.setInactive();
			});
			
			editor.getSession().setAnnotations([]);

			simulation.initialize();
			
			var success = simulation.run(code, function(time, data) {
				$.each(data, function(type, value) {
					if(plot_fcns[type] !== undefined) {
						plot_fcns[type](time, value);
					}
				});
				
				$.each(beacons, function(idx, beacon) {
					if(beacon.distanceToDrone() < 0.5) {
						beacon.setActive();
					}
				});
			}, function() {
				update_simulation_buttons(false);
			}, function(error) {
			    if(error.filename == '<stdin>.py') {
					editor.getSession().setAnnotations([{
						text: error.message,
						type: 'error',
						row: error.lineno - 1
					}]);
				} else {
					console.log(error);
				}
			}, {
				'async': true,
				'duration': Infinity,
			});
			
			if(!success) {
				update_simulation_buttons(false);
			}
		});

		$('#stop-simulation').click(function() {
			simulation.stop();
		});
	})
});
