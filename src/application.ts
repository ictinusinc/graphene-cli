import * as Color from "./color";
import {Command} from "./command";

import {CloseCommand} from "./commands/close";
import {HashCommand} from "./commands/hash/index";
import {ModuleCommand} from "./commands/module";
import {ObjectCommand} from "./commands/object/index";
import {SlotCommand} from "./commands/slot";
import {TestCommand} from "./commands/test/index";
import {VersionCommand} from "./commands/version";

import * as c from "./const";

export class Application extends Command {

    public name = "graphene";
    public description = "The graphene-cli is a cross-platform command line tool for working with PKCS#11 devices";

    constructor() {
        super();

        this.commands.push(new VersionCommand(this));
        this.commands.push(new CloseCommand(this));
        this.commands.push(new ModuleCommand(this));
        this.commands.push(new SlotCommand(this));
        this.commands.push(new ObjectCommand(this));
        this.commands.push(new HashCommand(this));
        this.commands.push(new TestCommand(this));
    }

    public async run(args: string[]): Promise<Command> {
        let repeat = true;
        let dontRun = false;

        while (repeat) {
            var command;
                var args2 = await c.readline.prompt();
                if(args2.length>6 && args2[0]=='module'){

                    var bigArgs = [];
                    bigArgs[0] = [args2[0],args2[1],args2[2],args2[3],args2[4],args2[5]]; //module load -l /home/vagrant/gemalto/libs/64/libCryptoki2.so -n GemaltoHSM
                    if(args2[6]=='slot'){
                        bigArgs[1] = [args2[6], args2[7], args2[8], args2[9], args2[10], args2[11], args2[12]];  //slot open -s 0 -p copassword -rw
                    }if(args2[13]=='object' && args2[14]=='generate'){
                        bigArgs[2] = [args2[13], args2[14], args2[15], args2[16]];  //object generate -token true
                    }else if(args2[13]=='object' && args2[14]=='sign'){
                        bigArgs[2] = [args2[13], args2[14], args2[15], args2[16], args2[17], args2[18],args2[19],args2[20]];  //object sign -s 0 -h handle -d data
                    }
                }
            try {
                if(bigArgs){
                    var i;
                    for(i=0;i<bigArgs.length;i++){
                        command = await super.run(bigArgs[i]);
                    }
                    dontRun = true;
                }else{
                    command = await super.run(args2);
                }
                if (command instanceof CloseCommand || dontRun == true) {
                    repeat = false;
                    if(dontRun){
                        super.run(['exit'])
                    }
                }
            } catch (e) {
                console.error(`\n${Color.FgRed}Error${Color.Reset}`, e.message);
                const command = this.getCommand(args2);
                command.showHelp();
                console.log(e);
            }
        }
        return this;
    }

    protected async onRun(args: string[]): Promise<Command> {
        this.showHelp();
        return this;
    }

}
