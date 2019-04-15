import * as graphene from "graphene-pk11";

import { Command } from "../../command";
import {get_session} from "../slot/helper";
import {GEN_KEY_LABEL} from "../../const";
import {SlotOption} from "../../options/slot";
import {PinOption} from "../../options/pin";
import {DataOption} from "./options/data";
import {Option} from "../../options";
import {get_module} from "../module/helper";
import {open_session} from "../test/helper";

interface signOptions extends Option{
    lib: string;
    slot: number;
    pin?:string;
    data:string;
}

export class SignCommand extends Command{
    public name = "sign";
    public description = "Signs with an SECP256k1 Key";

    constructor(parent?: Command) {
        super(parent);
        // --slot
        this.options.push(new SlotOption());
        // --pin
        this.options.push(new PinOption());
        // --data
        this.options.push(new DataOption());

    }
    protected async onRun(params:signOptions):Promise<Command> {

        const mod = get_module();
        //try{
        //    mod.initialize();
        //}catch(error){
            //mod.finalize();
        //    console.log('Module already initialized.');
        //}
        if (!params.lib) {
            params.lib = "/home/vagrant/gemalto/libs/64/libCryptoki2.so";
        }
        //const mod = graphene.Module.load(params.lib, 'GemaltoHSM');

        //mod.initialize();



        if (!params.slot) {
            console.log("No slot found. Defaulting to 0.");
            params.slot = 0;
        }

        //const slot = mod.getSlots(params.slot);
        //const session = slot.open(graphene.SessionFlag.SERIAL_SESSION);
        const session = get_session();
        console.log(session)

        let key: graphene.Key | null = null;
        //#region Find signing key
        const objects = session.find({label: GEN_KEY_LABEL});
        for (let i = 0; i < objects.length; i++) {
            const obj = objects.items(i);
            if (obj.class === graphene.ObjectClass.PRIVATE_KEY ||
                obj.class === graphene.ObjectClass.SECRET_KEY
            ) {
                key = obj.toType<graphene.Key>();
                break;
            }
        }
        if (!key) {
            throw new Error("Cannot find signing key");
        }
        var sign = session.createSign("ECDSA_SHA256", key);
        if (!params.data) {
            console.log("No data found. Signing empty string");
            params.data = '';
        }
        sign.update(params.data.toString());
        var signature = sign.final();
        console.log("Signature ECDSA_SHA256:", signature.toString('hex'));
        session.close();
        return this;
    }




}