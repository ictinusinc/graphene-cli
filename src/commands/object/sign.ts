import * as graphene from "graphene-pk11";

import { Command } from "../../command";
import {get_session} from "../slot/helper";
import {GEN_KEY_LABEL} from "../../const";
import {SlotOption} from "../../options/slot";
import {DataOption} from "./options/data";
import {Option} from "../../options";
import {HandleOption} from "./options/handle";
import {Handle} from "../../helper";
import {prepare_data} from "../test/sign_helper";
var pkcs11 = require("pkcs11js");



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
    protected async onRun(params:signOptions):Promise<Command> {
        let alg: graphene.MechanismType;
        alg = graphene.MechanismEnum.ECDSA;
        const session = get_session();

        let key: graphene.Key | null = null;
        //#region Find signing key
        const objects = session.find({label: GEN_KEY_LABEL});
        for (let i = 0; i < objects.length; i++) {
            const obj = objects.items(i);
            if ((obj.class === graphene.ObjectClass.PRIVATE_KEY ||
                obj.class === graphene.ObjectClass.SECRET_KEY) &&
                obj.handle.toString('hex') == params.handle
            ) {
                key = obj.toType<graphene.Key>();
                break;
            }
        }
        if (!key) {
            throw new Error("Cannot find signing key");
        }
        if (!params.data) {
            console.log("No data found. Signing 'test' string");
            params.data = 'test';
        }
        var sign = session.createSign(alg,key);

        //sign.update(params.data);
        //var signature = sign.final();

        var signature = sign.once(params.data);
        //var verify = session.createVerify(alg,key)



        console.log(signature.toString('hex'));
        return this;
    }




}