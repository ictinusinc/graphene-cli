import * as graphene from "graphene-pk11";

import { Command } from "../../command";

import {SlotOption} from "../../options/slot";
import {DataOption} from "./options/data";
import {Option} from "../../options";
import {HandleOption} from "./options/handle";
import {get_session} from "../slot/helper";
import {MechOption} from "./options/mech";


interface signOptions extends Option{
    slot: number;
    handle:string;
    data:string;
    mech:string;
}

export class SignCommand extends Command{
    public name = "sign";
    public description = [
        "Signs with a key",
        "",
        "Supported mechanisms:",
        "  rsa",
        "  ecdsa",
        "  aes",
    ];

    constructor(parent?: Command) {
        super(parent);

        this.options.push(new SlotOption());
        this.options.push(new HandleOption());
        this.options.push(new DataOption());
        this.options.push(new MechOption());

    }
    protected async onRun(params:signOptions):Promise<Command>{
        const session = get_session();

        let alg: graphene.MechanismType;

        let foundIndex = 0;
        for(let i=268;i<Object.keys(graphene.MechanismEnum).length;i++){
            if(Object.keys(graphene.MechanismEnum)[i].toString()==params.mech.toUpperCase()){
                foundIndex = i;
            }
        }
        if(foundIndex==0){
            throw new Error("No mechanism found")
        }
        alg = Object.keys(graphene.MechanismEnum)[foundIndex]

        if (!params.data) {
            console.log("No data found. Signing 'test' string");
            params.data = 'test';
        }

        // @ts-ignore
        if(params.data.length!=64 && (alg == graphene.MechanismEnum.ECDSA||alg=='ECDSA')){                                             //
            params.data = session.createDigest("sha256").once(Buffer.from(params.data,'hex')).toString('hex'); //Potentially remove
        }                                                                                                                             //
        if (!session.getObject(Buffer.from(params.handle,'hex'))) {
            throw new Error("Cannot find signing key");
        }
        const privObj = session.getObject(Buffer.from(params.handle,'hex')).toType<graphene.Key>();

        var signature = session.createSign(alg,privObj).once(Buffer.from(params.data,'hex'));
        console.log(signature.toString('hex'));

        return this;
    }
}
