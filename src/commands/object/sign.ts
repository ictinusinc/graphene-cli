import * as graphene from "graphene-pk11";

import { Command } from "../../command";

import {SlotOption} from "../../options/slot";
import {DataOption} from "./options/data";
import {Option} from "../../options";
import {HandleOption} from "./options/handle";
import {get_session} from "../slot/helper";


interface signOptions extends Option{
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
        let alg: graphene.MechanismType;
        alg = graphene.MechanismEnum.ECDSA;


        if(!params.slot){
            console.log("No slot found. Defaulting to 0.");
            params.slot = 0;
        }

        if (!params.data) {
            console.log("No data found. Signing 'test' string");
            params.data = 'test';
        }
        const session = get_session();


        const hash = session.createDigest("sha256").once(Buffer.from(params.data,'hex'))



        //#region Find signing key

        const privObj = session.getObject(Buffer.from(params.handle,'hex')).toType<graphene.Key>();

        if (!privObj) {
            throw new Error("Cannot find signing key");
        }


        var sign = session.createSign(alg,privObj).once(hash);
        console.log(sign.toString('hex'));

        return this;
    }




}