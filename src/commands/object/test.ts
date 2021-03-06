import * as graphene from "graphene-pk11";

import { Command } from "../../command";
import { get_session } from "../slot/helper";

export class TestCommand extends Command {
    public name = "test";
    public description = "Generates test objects";

    protected async onRun(options: Assoc<any>): Promise<Command> {
        const session = get_session();

        // create secret key
        session.generateKey(graphene.KeyGenMechanism.AES, {
            encrypt: true,
            decrypt: true,
            valueLen: 128 >> 3,
            label: "test AES key",
            token: true,
        });

        // create certificate
        const certDer = Buffer.from("308202C0308201A8A003020102020101300D06092A864886F70D01010B0500301B311930170603550403131054657374206365727469666963617465301E170D3137313031313230353932315A170D3138313031313230353932315A301B31193017060355040313105465737420636572746966696361746530820122300D06092A864886F70D01010105000382010F003082010A0282010100CE4ADBD2A5FEEE08E03F94C466EC688BC887B5B9DC0F97B09B2D368E91114154236A9D1D70C27EE699B56C921F0BC27421B421304346B8C7CC81A5E37BD64ADE66F0A7DF3CE6B9EB9B6203EBC4A7D06BBB8CCA7E18E42C2CC0951220F1FECEFE925A25F64F4424B57285E762CE8B863FA075F60618D4BC53C4FBBFEF49E73BE34178767299D9CBCDF1C90545900B73559B1E44B0180F74E0F22EC20C3668D8B150009F544223AF3E3C8AE5CC91F373D11CA353B7C67F59EAD0090FDE51BDB49486F49DDCB0F6C305ED6A1B3A6809E7629E52305376D59A79F9D69BE9E04F88A62F00F4AA400CF9CEA4E19A263C7B56490DDB466D8B9AC26A70208A9585E5BDE10203010001A30F300D300B0603551D0F040403020080300D06092A864886F70D01010B050003820101007EC4B2F066463102078C92E5B0D8F7F5D047F60272372BB7AB689410ACC0C476FEC0713E2761A32F40CAD347BFCB179884692B4DDE3C7669A46B6597BFF22F04068A289AC7CB10890AA670CC4C76E4BF1ACCE302624E3F4DB25FB74FE54B41A68BEE50047C84248922B914DBB284874EDD22A78F07F2EF6E3ADA875623C8C12D6BA2F3EC0194DE9EAD2DBB9133CED02DD948DD6F322979983E6D5AACD1DFA4EDA214846D8E6B3B1ADC1D1341A56474F7A39AE7508487189BF15C0D2F9A88FE31D6950F7D7B96D8803D2F9501E1DEE59CF37BC6CCFFFA5A888849558125806D9C2649E9582F1007982724DBB9551E2052B19C219A8158D76F30609F9C04E7C305", "hex");
        session.create({
            class: graphene.ObjectClass.CERTIFICATE,
            certType: graphene.CertificateType.X_509,
            token: true,
            private: false,
            value: certDer,
            label: "Test certificate",
        });

        return this;
    }

}