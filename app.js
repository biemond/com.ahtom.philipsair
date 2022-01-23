'use strict';

const Homey = require('homey');
const philipsair = require('./drivers/philipsair.js');
const AirDevice = require('./drivers/air');

// sleep time expects milliseconds
function sleep (time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

class MyApp extends Homey.App {
	
	onInit() {
		this.log('philipsair is running...');
		const coapDevices = [ 'deviceCoap', 'deviceCoap2']
		const newCoapDevices = [ 'AC4236/10', 'AC2958/10', 'AC2939/10', 'AC3858/10', 'AC3033/10', 'AC3059/10']

        let purifierModeAction = new Homey.FlowCardAction('purifier_mode');
        purifierModeAction.register().registerRunListener(( args, state ) => {
			if(coapDevices.includes( args.device.constructor.name ) ) {
				args.device.setStateCoap("mode", args.mode, args.device.getSettings());
			} else {
				let values = { "mode": args.mode}
				args.device.setState(JSON.stringify(values), args.device.getSettings());
			}
            return Promise.resolve( true );
        })

        let fanSpeedAction = new Homey.FlowCardAction('fan_speed');
        fanSpeedAction.register().registerRunListener(( args, state ) => {
			this.log('---');
            this.log(args.device.constructor.name);
            this.log(args.device.getCapabilityValue('product'));
			this.log('---');
            let model = args.device.getCapabilityValue('product')

			if(coapDevices.includes( args.device.constructor.name ) ) {

	            if (  args.mode == "AUTO") {
	                // auto
	                if ( newCoapDevices.includes( model) ) {
	                  args.device.setStateCoap("mode", "AG", args.device.getSettings());
	                } else { 
	                  args.device.setStateCoap("mode", "P", args.device.getSettings());
	                }
	            } else { 
	                if (  args.mode == "s" ||  args.mode == "t" ) {
	                    // turbo / sleep
	                    if (newCoapDevices.includes( model) ) {
	                      args.device.setStateCoap("mode",  args.mode.toUpperCase(), args.device.getSettings());
	                      sleep(2000).then(() => {
	                         args.device.setStateCoap("om",  args.mode, args.device.getSettings());    
	                      });                         
	                    } else { 
	                      args.device.setStateCoap("mode", "M", args.device.getSettings());
	                      sleep(2000).then(() => {
	                         args.device.setStateCoap("om",  args.mode, args.device.getSettings());    
	                      });                         
	                    }
	                } else {
	                    args.device.setStateCoap("mode", "M", args.device.getSettings());
	                    sleep(2000).then(() => {
	                       args.device.setStateCoap("om",  args.mode, args.device.getSettings());    
	                    });                       
	                }
	            }
			} else {
				let values = { "mode": "M"};
				args.device.setState(JSON.stringify(values), args.device.getSettings());
				sleep(2000).then(() => {
				   let values = { "om": args.mode}
				   args.device.setState(JSON.stringify(values), args.device.getSettings());
				});				
			}
            return Promise.resolve( true );
        })

        let lightIntensityAction = new Homey.FlowCardAction('light_intensity');
        lightIntensityAction.register().registerRunListener(( args, state ) => {
			this.log('---');
            this.log(args.device.constructor.name);
			this.log('---');
			if(coapDevices.includes( args.device.constructor.name ) ) {
				args.device.setStateCoap( "aqil", parseInt(args.mode), args.device.getSettings());
			} else {
				let values = { "aqil": 50};
				args.device.setState(JSON.stringify(values), args.device.getSettings());
				sleep(2000).then(() => {
				   let values = { "aqil": parseInt(args.mode)};
				   args.device.setState(JSON.stringify(values), args.device.getSettings());
				});				
			}
            return Promise.resolve( true );
        })

        let onAction = new Homey.FlowCardAction('on');
        onAction.register().registerRunListener(( args, state ) => {
			if(coapDevices.includes( args.device.constructor.name ) ) {
				args.device.setStateCoap( "pwr", "1", args.device.getSettings());
			} else {
				let values = { "pwr": "1"}
				args.device.setState(JSON.stringify(values), args.device.getSettings());
			}
            return Promise.resolve( true );
        })
        
        let offAction = new Homey.FlowCardAction('off');
        offAction.register().registerRunListener(( args, state ) => {
			if(coapDevices.includes( args.device.constructor.name ) ) {
				args.device.setStateCoap("pwr", "0", args.device.getSettings());
			} else {
				let values = { "pwr": "0"}
				args.device.setState(JSON.stringify(values), args.device.getSettings());
			}
            return Promise.resolve( true );
        })

        let funcModeOnAction = new Homey.FlowCardAction('func_mode_on');
        funcModeOnAction.register().registerRunListener(( args, state ) => {
			if(coapDevices.includes( args.device.constructor.name ) ) {
				args.device.setStateCoap( "func", "PH", args.device.getSettings());
			} else {
				let values = { "func": "PH"}
				args.device.setState(JSON.stringify(values), args.device.getSettings());
			}
            return Promise.resolve( true );
        })
        
        let funcModeOffAction = new Homey.FlowCardAction('func_mode_off');
        funcModeOffAction.register().registerRunListener(( args, state ) => {
			if(coapDevices.includes( args.device.constructor.name ) ) {
				args.device.setStateCoap("func", "P", args.device.getSettings());
			} else {
				let values = { "func": "P"}
				args.device.setState(JSON.stringify(values), args.device.getSettings());
			}
            return Promise.resolve( true );
        })

	}


}

module.exports = MyApp;