import * as graphene from "graphene-pk11";

import { Command } from "../../command";
import {readline} from "../../const";
import { get_session } from "../slot/helper";
import { ObjectIdOption } from "./options/obj_id";

interface DeleteOptions {
    oid?: string;
}

export class DeleteCommand extends Command {
    public name = "delete";
    public description = "Deletes an object from a slot";

    constructor(parent?: Command) {
        super(parent);

        this.options.push(new ObjectIdOption());
    }

    protected async onRun(params: DeleteOptions): Promise<Command> {
        const session = get_session();
        if (params.oid === undefined) {
            const answer = (await readline.question("Do you really want to remove ALL objects (Y/N)? ")).toLowerCase();
            if (answer && (answer === "yes" || answer === "y")) {
                session.destroy();
                console.log();
                console.log("All Objects were successfully removed");
                console.log();
            }
        } else {

            const objects = session.find({id:Buffer.from(params.oid,'hex')});
            session.destroy(objects.items(0)!);
            session.destroy(objects.items(1)!);
            console.log('Object deleted.');
        }
        return this;
    }

}