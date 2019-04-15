import * as graphene from "graphene-pk11";

import { Command } from "../../command";
import {get_session} from "../slot/helper";
import {GEN_KEY_LABEL, TEST_KEY_ID} from "../../const";


export class GenerateCommand extends Command{
    public name = "generate";
    public description = "Generates an SECP256k1 Key";


    protected async onRun():Promise<Command>{
        const session = get_session();

        var keys = gen_ECDSA_secp256k1(session)
        if(keys){
            console.log('Key generation successful!')
        }else{
            console.log('Key generation failed!')
        }
        return this;
    }




}
function gen_ECDSA(session: graphene.Session, name: string, hexOid: string, token = false) {
    return session.generateKeyPair(
        graphene.KeyGenMechanism.ECDSA,
        {
            keyType: graphene.KeyType.ECDSA,
            id: TEST_KEY_ID,
            label: GEN_KEY_LABEL,
            token,
            verify: true,
            paramsEC: new Buffer(hexOid, "hex"),
        },
        {
            id: TEST_KEY_ID,
            label: GEN_KEY_LABEL,
            token,
            private: true,
            sign: true,
        },
    );
}


function gen_ECDSA_secp256k1(session: graphene.Session, token = false) {
    return gen_ECDSA(session, "ECDSA-secp256k1", "06052B8104000A", token);
}