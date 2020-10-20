import {Enforcer} from 'casbin';
import {strict as assert} from 'assert';
import Matcher from './matcher';
import Policy from './policy';
import {getRawMatcherString} from './utils';

export default class Processor {
    enforcer!: Enforcer;
    matcher!: Matcher;
    constructor(e: Enforcer) {
        this.enforcer = e;
        this.matcher = new Matcher(`m = ${getRawMatcherString(e)}`);
    }

    // Given a subject,
    // return the simplified conf and necessary anonymous policies 
    async process(subject: string): Promise<string[]> {

        let requiredPolicies: Policy[] = [];
        let retPolicies: string[] = [];
        
        // TODO: 遍历所有的"g"，把符合的g, subject[idx],xxx中的xxx加入到subject中
        let subjects = [subject];

        for (const subject of subjects) {
            const policies = await this.enforcer.getFilteredPolicy(0, subject);
            for (const policy of policies) {
                requiredPolicies.push(new Policy(policy));
            }
        }

        // Anonymize all subject. (replace r.sub with _)
        let retPoliciesStr = "";
        requiredPolicies.forEach((policy) => {
            let s = policy.getAnonymousString();
            retPoliciesStr = retPoliciesStr + `p,${s}\n`; // p,_,data1,read
        });

        // Build new matcher: remove all bool expressions with r_sub
        this.matcher.getExprs().map((exp, idx) => {
            console.log(idx, exp);
            if (exp.indexOf("r_sub") != -1) {
                this.matcher.ban(idx);
            }
        })
        const conf = this.matcher.getReservedMatcherStr();

        return [conf, retPoliciesStr];
    }

}