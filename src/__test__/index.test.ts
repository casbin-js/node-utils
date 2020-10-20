import {newEnforcer} from 'casbin';
import Processor from '../processor';

const examplesPath = "src/__test__/examples/";

test('basic', async() => {
    const e = await newEnforcer(`${examplesPath}/basic_model.conf`, `${examplesPath}/basic_policy.csv`);
    let oProcessor = new Processor(e);
    const [conf, policiesStr] = await oProcessor.process("alice");
    const policies = policiesStr.split("\n");
    expect(policies[0]).toBe("p,_,data1,read");
    expect(policies[1]).toBe("p,_,data1,write");
    console.log(conf);
    expect(conf.trim()).toBe("m = r_obj == p_obj && r_act == p_act");
})