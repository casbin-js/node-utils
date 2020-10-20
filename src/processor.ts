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
        const s = getRawMatcherString(e);
        if (s) {
            this.matcher = new Matcher(`m = ${getRawMatcherString(e)}`);
        }
        else {
            throw Error("cannot get matcher string");
        }
    }

    // Given a subject,
    // return the simplified conf and necessary anonymous policies 
    async process(subject: string): Promise<string[]> {

        let requiredPolicies: Policy[] = [];
        let retPolicies: string[] = [];
        
        // Find all the role of the current subject, and regard these roles as "subject alias"
        let subjects = [subject];
        const groupPolicies = await this.enforcer.getGroupingPolicy();
        for (const sub of subjects) {
            groupPolicies.forEach((item) => {
                if (item[0] == sub) {
                    subjects.push(item[1]);
                }
            });
        }

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
            if (exp.indexOf("r_sub") != -1) {
                this.matcher.ban(idx);
            }
        })
        const conf = this.matcher.getReservedMatcherStr();
        
        return [conf.trim(), retPoliciesStr.trim()];
    }

}