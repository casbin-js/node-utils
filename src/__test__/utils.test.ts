import {newEnforcer} from 'casbin';
import * as utils from '../utils';

const examplesPath = "src/__test__/examples/";

test('utils', async () => {
    let e = await newEnforcer(`${examplesPath}/basic_model.conf`, `${examplesPath}/basic_policy.csv`);
    expect(utils.getRawMatcherString(e)).toEqual("r_sub == p_sub && r_obj == p_obj && r_act == p_act");
    
    
    e = await newEnforcer(`${examplesPath}/rbac_model.conf`, `${examplesPath}/rbac_policy.csv`);
    expect(utils.getRawGroupString(e)).toEqual("_, _");
})