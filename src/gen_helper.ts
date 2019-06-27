import * as graphene from "graphene-pk11";
import {TEST_KEY_ID, TEST_KEY_LABEL} from "./const";


function gen_AES(session: graphene.Session, name: string, len: number, token = false, test:boolean) {
    return session.generateKey(
        graphene.KeyGenMechanism.AES,
        {
            keyType: graphene.KeyType.AES,
            id: TEST_KEY_ID,
            label: test?TEST_KEY_LABEL:name+'-Key',
            token: token,
            modifiable: true,
            valueLen: (len || 128) >> 3,
            sign: true,
            verify: true,
            encrypt: true,
            decrypt: true,
            wrap: true,
            unwrap: true,
        },
    );
}

function gen_RSA(session: graphene.Session, name: string, size: number, exp: Buffer = Buffer.from([3]), token = false, test:boolean) {
    return session.generateKeyPair(
        graphene.KeyGenMechanism.RSA,
        {
            id: TEST_KEY_ID,
            label:  test?TEST_KEY_LABEL:name+'-pubKey',
            token:token,
            modulusBits: size,
            publicExponent: exp,
            wrap: true,
            encrypt: true,
            verify: true,
        },
        {
            id: TEST_KEY_ID,
            label: test?TEST_KEY_LABEL:name+'-privKey',
            token,
            private: true,
            sign: true,
            decrypt: true,
            unwrap: true,
        },
    );
}

function gen_ECDSA(session: graphene.Session, name: string, hexOid: string, token = false, test:boolean) {
    return session.generateKeyPair(
        graphene.KeyGenMechanism.ECDSA,
        {
            keyType: graphene.KeyType.ECDSA,
            id: TEST_KEY_ID,
            label: test?TEST_KEY_LABEL:name+'-pubKey',
            token:token,
            verify: true,
            paramsEC: Buffer.from(hexOid, "hex"),
        },
        {
            id: TEST_KEY_ID,
            label: test?TEST_KEY_LABEL:name+'-privKey',
            token:token,
            private: true,
            sign: true,
        },
    );
}

export const gen: { [alg: string]: { [spec: string]: (session: graphene.Session, token?: boolean, test?: boolean) => graphene.IKeyPair | graphene.SecretKey } } = {
    rsa: {
        "1024": gen_RSA_1024,
        "2048": gen_RSA_2048,
        "4096": gen_RSA_4096,
    },
    ecdsa: {
        "secp160r1": gen_ECDSA_secp160r1,
        "secp192r1": gen_ECDSA_secp192r1,
        "secp256r1": gen_ECDSA_secp256r1,
        "secp384r1": gen_ECDSA_secp384r1,
        "secp256k1": gen_ECDSA_secp256k1,
        "brainpoolP192r1": gen_ECDSA_brainpoolP192r1,
        "brainpoolP224r1": gen_ECDSA_brainpoolP224r1,
        "brainpoolP256r1": gen_ECDSA_brainpoolP256r1,
        "brainpoolP320r1": gen_ECDSA_brainpoolP320r1,
    },
    aes: {
        "128": gen_AES_128,
        "192": gen_AES_192,
        "256": gen_AES_256,
        "cbc128": gen_AES_128,
        "cbc192": gen_AES_192,
        "cbc256": gen_AES_256,
        "gcm128": gen_AES_128,
        "gcm192": gen_AES_192,
        "gcm256": gen_AES_256,
    },
};

function gen_RSA_1024(session: graphene.Session, token = false, test = false) {
    return gen_RSA(session,test?"test RSA-1024":"RSA-1024", 1024, Buffer.from([1, 0, 1]), token, test);
}

function gen_RSA_2048(session: graphene.Session, token = false, test = false) {
    return gen_RSA(session,test?"test RSA-2048":"RSA-2048", 2048, Buffer.from([1, 0, 1]), token, test);
}

function gen_RSA_4096(session: graphene.Session, token = false, test = false) {
    return gen_RSA(session,test?"test RSA-4096":"RSA-4096", 4096, Buffer.from([1, 0, 1]), token, test);
}

function gen_ECDSA_secp160r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-secp160r1":"ECDSA-secp160r1", "06052b81040008", token, test);
}

function gen_ECDSA_secp192r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-secp192r1":"ECDSA-secp192r1", "06082A8648CE3D030101", token, test);
}

function gen_ECDSA_secp256r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-secp256r1":"ECDSA-secp256r1", "06082A8648CE3D030107", token, test);
}

function gen_ECDSA_secp384r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-secp384r1":"ECDSA-secp384r1", "06052B81040022", token, test);
}

function gen_ECDSA_secp256k1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-secp256k1":"ECDSA-secp256k1", "06052B8104000A", token, test);
}

function gen_ECDSA_brainpoolP192r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-brainpoolP192r1":"ECDSA-brainpoolP192r1", "06052B8104000A", token, test);
}

function gen_ECDSA_brainpoolP224r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-brainpoolP224r1":"ECDSA-brainpoolP224r1", "06092B2403030208010105", token, test);
}

function gen_ECDSA_brainpoolP256r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-brainpoolP256r1":"ECDSA-brainpoolP256r1", "06092B2403030208010107", token, test);
}

function gen_ECDSA_brainpoolP320r1(session: graphene.Session, token = false, test = false) {
    return gen_ECDSA(session, test?"test ECDSA-brainpoolP320r1":"ECDSA-brainpoolP320r1", "06092B2403030208010109", token, test);
}

function gen_AES_128(session: graphene.Session, token = false, test = false) {
    return gen_AES(session, test?"test AES-128":"AES-128", 128, token, test);
}
function gen_AES_192(session: graphene.Session, token = false, test = false) {
    return gen_AES(session, test?"test AES-192":"AES-192", 192, token, test);
}
function gen_AES_256(session: graphene.Session, token = false, test = false) {
    return gen_AES(session, test?"test AES-256":"AES-256", 256, token, test);
}