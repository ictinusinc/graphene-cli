import * as graphene from "graphene-pk11";
import {Command} from "../../command";
import {get_session} from "../slot/helper";
import {GEN_PRIV_KEY_LABEL, GEN_PUB_KEY_LABEL, TEST_KEY_ID} from "../../const";
import {TokenOption} from "../test/options/token";
import {Option} from "../../options";
import Key = GraphenePkcs11.Key;

interface GenerateOptions extends Option{
    token: boolean;
}
export class GenerateCommand extends Command{
    public name = "generate";
    public description = "Generates an SECP256k1 Key";

    constructor(parent?: Command) {
        super(parent);
        // --token
        this.options.push(new TokenOption());
    }

    protected async onRun(params:GenerateOptions):Promise<Command>{
        const session = get_session();
        var keys = gen_ECDSA_secp256k1(session,params.token)



        keys.privateKey.setAttribute('id',keys.privateKey.handle)
        keys.publicKey.setAttribute('id',keys.privateKey.handle)

        if(keys){
            console.log(keys.publicKey.getAttribute('pointEC').toString('hex').slice(6)+keys.privateKey.handle.toString('hex'));
        }else{
            console.log('error')
        }
        return this;
    }
}

function gen_ECDSA(session: graphene.Session, name: string, token = false) {
    return session.generateKeyPair(graphene.KeyGenMechanism.ECDSA, {
            keyType: graphene.KeyType.ECDSA,
            id: TEST_KEY_ID,
            label: GEN_PUB_KEY_LABEL,
            token:token,
            verify: true,
            paramsEC: Buffer.from("06052B8104000A", "hex"),
            //verifyRecover: true,
        },
        {
            keyType: graphene.KeyType.ECDSA,
            id: TEST_KEY_ID,
            label: GEN_PRIV_KEY_LABEL,
            token: token,
            private: true,
            sign: true,
            //signRecover: true,
        },
    );
}
function gen_ECDSA_secp256k1(session: graphene.Session, token = false) {
    return gen_ECDSA(session, "ECDSA-secp256k1",token );
}