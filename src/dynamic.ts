import * as Color from "./color";
import { Command } from "./command";

import { HashCommand } from "./commands/hash/index";
import { ModuleCommand } from "./commands/module";
import { ObjectCommand } from "./commands/object/index";
import { SlotCommand } from "./commands/slot";
import { VersionCommand } from "./commands/version";
import { TestCommand } from "./commands/test/index";
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
            var args2 = args.slice(2);
            var bigArgs = [];
            var indexes = [];
            try {
                for(let i=0;i<args2.length;i++){
                    for(var cmd in COMMAND_POINTER){
                        if(args2[i] === COMMAND_POINTER[cmd]){
                            indexes.push(i)
                        }
                    }
                }
                for(let i=0;i<indexes.length;i++){
                    if(indexes.length-1==i){
                        bigArgs[i] = args2.slice(indexes[i])
                    }else{
                        bigArgs[i] = args2.slice(indexes[i],indexes[i+1])
                    }
                }
                for(let i=0;i<bigArgs.length;i++){
                    await super.run(bigArgs[i]);
                }
                c.readline.close();
            } catch (e) {
                c.readline.close()
                console.error(`\n${Color.FgRed}Error${Color.Reset}`, e.message);
            }
        return this;
    }

    protected async onRun(args: string[]): Promise<Command> {
        return this;
    }

}