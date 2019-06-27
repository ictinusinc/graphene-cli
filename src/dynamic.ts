import * as Color from "./color";
import { Command } from "./command";

import { HashCommand } from "./commands/hash";
import { ModuleCommand } from "./commands/module";
import { ObjectCommand } from "./commands/object";
import { SlotCommand } from "./commands/slot";
import { VersionCommand } from "./commands/version";
import { TestCommand } from "./commands/test";
import { CloseCommand } from "./commands/close";

import * as c from "./const";
import {COMMAND_POINTER} from "./const";

export class Dynamic extends Command {

    public name = "graphene";
    public description = "The graphene-cli is a cross-platform command line tool for working with PKCS#11 devices";

    constructor() {
        super();

        this.commands.push(new TestCommand(this));
        this.commands.push(new CloseCommand(this));
        this.commands.push(new VersionCommand(this));
        this.commands.push(new ModuleCommand(this));
        this.commands.push(new SlotCommand(this));
        this.commands.push(new ObjectCommand(this));
        this.commands.push(new HashCommand(this));
    }

    public async run(args: string[]): Promise<Command> {
            var parsedArgs = args.slice(2);
            var commandArrays = [];
            var indexes = [];
            try {
                for(let i=0;i<parsedArgs.length;i++){
                    for(var cmd in COMMAND_POINTER){
                        if(parsedArgs[i] === COMMAND_POINTER[cmd]){
                            indexes.push(i)
                        }
                    }
                }
                for(let i=0;i<indexes.length;i++){
                    if(indexes.length-1==i){
                        commandArrays[i] = parsedArgs.slice(indexes[i])
                    }else{
                        commandArrays[i] = parsedArgs.slice(indexes[i],indexes[i+1])
                    }
                }
                for(let i=0;i<commandArrays.length;i++){
                    await super.run(commandArrays[i]);
                }
                c.readline.close();
            } catch (e) {
                c.readline.close();
                console.error(`\n${Color.FgRed}Error${Color.Reset}`, e.message);
            }
        return this;
    }

    protected async onRun(args: string[]): Promise<Command> {
        return this;
    }

}