requirejs.config({
	paths: {
		'static': '../static/exercise4_thermostat/',
		'mathjs': 'math.min',
		'THREE': 'three.min',
		'jquery': 'jquery.min',
		'THREE/TrackballControls': 'three/TrackballControls',
		'THREE/ColladaLoader': 'three/ColladaLoader',
		'Skulpt': 'visnav_edx_skulpt.min',
		'Skulpt/Stdlib': 'visnav_edx_skulpt-stdlib',
		'd3': 'd3',
		'Rickshaw': 'rickshaw.min',
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
		'Rickshaw': {
			deps: ['d3/global'],
			exports: 'Rickshaw',
		}
	}
});

// see https://github.com/mbostock/d3/issues/1693
// only works with d3 and not d3.min
define("d3/global", ["d3"], function(_) {
  d3 = _;
});

require(['require', 'domReady', 'jquery', 'Skulpt', 'init/edx_state', 'init/editor', 'init/grapher', 'python/vm', 'python/internal_code', 'text!static/default.py'], function(require, domready) {
	domready(function() {
		$ = require('jquery');
		Sk = require('Skulpt');
		
		var editor = require('init/editor')($('#editor').get(0));
		editor.getSession().setValue(require('text!static/default.py'))
		var grapher = require('init/grapher')($('#grapher').get(0), {
			'values_per_second': 100,
			'subsampling': 4,
			'seconds': 30,
			'dummy_name': 'click run...'
		});

		// TODO: replace with some better mvc code
		var logview = $('#log-view');
		var vm = require('python/vm')(logview.get(0));
		var augment_user_code = require('python/internal_code');
		
		require('init/edx_state')({
			'set_state': function(state) {
				if(state['code']) {
					editor.getSession().setValue(state['code'])
				}
			},
			'get_state': function() {
				return { 'code': editor.getSession().getValue() };
			},
			'get_grade': function() {
				return { 'success': run() }
			},
			'tries': 5,
		});
		
		function run() {
			var code = augment_user_code(editor.getSession().getValue());
			logview.empty();
			
			try {
				editor.getSession().setAnnotations([]);

				vm.run(code);
				grapher.reset();
				if(Sk.interop.plot && Sk.interop.plot.data.scalar) {
					var grapher_input = [];
					$.each(Sk.interop.plot.data.scalar, function(name, values) {
						$.each(values, function(idx, value) {
							grapher_input[idx] = grapher_input[idx] || {};
							grapher_input[idx][name] = [value];
						});
					});
					
					$.each(grapher_input, function(idx, input) {
						grapher.refreshGraph(idx * 0.01, input);
					});
					grapher.render();
					Sk.interop.plot.clear();
				}
			} catch(e) {
				if(e.args) {
					editor.getSession().setAnnotations([{
						text: vm.toNativeArray(e.args)[0],
						type: 'error',
						row: e.lineno - 1,
					}]);
				} else {
					console.log('Non-Python exception thrown from call to python function!');
					console.log(e)
					editor.getSession().setAnnotations([{
						text: e.message,
						type: 'error',
						row: 0,
					}]);
				}
			}
			
			return false;
		};
		$('#run').click(function() { 
			run(); 
		});
	})
});
