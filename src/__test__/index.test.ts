import {newEnforcer} from 'casbin';
import CasbinJsServerTool from '../CasbinJsServerTool';

const examplesPath = "src/__test__/examples/";

test('basic', async() => {
    const e = await newEnforcer(`${examplesPath}/basic_model.conf`, `${examplesPath}/basic_policy.csv`);
    let svrTool = new CasbinJsServerTool(e);

    const policiesStr = await svrTool.genPolicies("alice");
    const policies = policiesStr.split("\n");
    expect(policies.length).toBe(2);
    expect(policies).toContain("p,_,data1,read");
    expect(policies).toContain("p,_,data1,write");

    const conf = await svrTool.genMatcher();
    expect(conf.trim()).toBe("m = r_obj == p_obj && r_act == p_act");
});

test('rbac', async() => {
    const e = await newEnforcer(`${examplesPath}/rbac_model.conf`, `${examplesPath}/rbac_policy.csv`);
    let svrTool = new CasbinJsServerTool(e);

    const policiesStr = await svrTool.genPolicies("alice");
    const policies = policiesStr.split("\n");
    expect(policies.length).toBe(3);
    expect(policies).toContain("p,_,data1,read");
    expect(policies).toContain("p,_,data2,read");
    expect(policies).toContain("p,_,data2,write");

    const conf = await svrTool.genMatcher();
    expect(conf).toBe("m = r_obj == p_obj && r_act == p_act");

    console.log(await svrTool.genJsonProfile("alice"));
});