import * as graphene from "graphene-pk11";

import { Command } from "../../command";

import {get_session} from "../slot/helper";
import {SlotOption} from "../../options/slot";
import {DataOption} from "./options/data";
import {Option} from "../../options";
import {HandleOption} from "./options/handle";


interface signOptions extends Option{
    lib: string;
    slot?: number;
    handle:string;
    data:string;
}

export class SignCommand extends Command{
    public name = "sign";
    public description = "Signs with an SECP256k1 Key";

    constructor(parent?: Command) {
        super(parent);
        // --slot
        this.options.push(new SlotOption());
        // --handle
        this.options.push(new HandleOption());
        // --data
        this.options.push(new DataOption());

    }
    protected async onRun(params:signOptions):Promise<Command>{
        const mod = graphene.Module.load(params.lib);
        mod.initialize();

        if(!params.slot){
            console.log("No slot found. Defaulting to 0.");
            params.slot = 0;
        }

        const slot = mod.getSlots(params.slot, true);
        const session = slot.open(graphene.SessionFlag.SERIAL_SESSION);

        

        //#region Find signing key

        const privObj = session.getObject(Buffer.from(params.handle,'hex')).toType<graphene.Key>();

        if (!privObj) {
            throw new Error("Cannot find signing key");
        }

        if (!params.data) {
            console.log("No data found. Signing 'test' string");
            params.data = 'test';
        }

        var sign = session.createSign(alg,privObj);
        sign.update(Buffer.from(params.data,'hex'))
        var signature = sign.final();
        console.log(signature.toString('hex'));
        return this;
    }




}