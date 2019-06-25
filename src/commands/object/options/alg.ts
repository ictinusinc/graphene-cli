import { AlgorithmOption as AlgorithmBaseOption } from "../../../options/alg";

export class AlgorithmOption extends AlgorithmBaseOption {
    public description = "Optional. Algorithm name. Default 'ecdsa-secp256k1'";
    public isRequired = false;
    public defaultValue = "ecdsa-secp256k1";
}
