import {newEnforcer} from "casbin";
import CasbinJsServerTool from "../CasbinJsServerTool";

const examplesPath = "src/__test__/examples/";

test("basic", async () => {
    const e = await newEnforcer(`${examplesPath}/basic_model.conf`, `${examplesPath}/basic_policy.csv`);
    const svrTool = new CasbinJsServerTool(e);

    const profile = await svrTool.genJsonProfile("alice");
    expect(profile.hasOwnProperty("ps")).toBe(true);

    const policies = profile["ps"].split("\n");
    expect(policies.length).toBe(2);
    expect(policies).toContain("p,_,data1,read");
    expect(policies).toContain("p,_,data1,write");

    expect(profile.hasOwnProperty("m")).toBe(true);
    const conf = profile["m"];
    expect(conf.trim()).toBe("m = r_obj == p_obj && r_act == p_act");
});

test("rbac", async () => {
    const e = await newEnforcer(`${examplesPath}/rbac_model.conf`, `${examplesPath}/rbac_policy.csv`);
    const svrTool = new CasbinJsServerTool(e);

    const profile = await svrTool.genJsonProfile("alice");
    const policies = profile["ps"].split("\n");
    expect(profile.hasOwnProperty("ps")).toBe(true);
    expect(policies.length).toBe(3);
    expect(policies).toContain("p,_,data1,read");
    expect(policies).toContain("p,_,data2,read");
    expect(policies).toContain("p,_,data2,write");

    expect(profile.hasOwnProperty("m")).toBe(true);
    const conf = profile["m"];
    expect(conf).toBe("m = r_obj == p_obj && r_act == p_act");

    console.log(await svrTool.genJsonProfile("alice"));
});
