import {Enforcer, newEnforcer} from 'casbin';
import Matcher from './matcher';
import Policy from './policy';
import * as utils from './utils';

export default class CasbinJsServerTool {
    private enforcer!: Enforcer;
    private matcher!: Matcher;
    constructor(e: Enforcer) {
        this.enforcer = e;
        const s = utils.getRawMatcherString(e);
        if (s) {
            this.matcher = new Matcher(`m = ${s}`);
        }
        else {
            throw Error("cannot get matcher string");
        }
    }
    
    // Given the subject, generate the necessary policies
    private async genPolicies(subject: string): Promise<string> {
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
        let requiredPolicies: Policy[] = [];
        for (const subject of subjects) {
            const policies = await this.enforcer.getFilteredPolicy(0, subject);
            for (const policy of policies) {
                requiredPolicies.push(new Policy(policy));
            }
        }
        
        // Anonymize all subject. (replace r.sub with _)
        let retPoliciesStr = "";
        requiredPolicies.forEach((policy) => {
            retPoliciesStr = retPoliciesStr + `p,${policy.getAnonymousString()}\n`; // p,_,data1,read
        });
        return retPoliciesStr.trim();
    }
    
    // Remove the expressions with "r_sub"
    private async genMatcher(): Promise<string> {
        // Remove 
        this.matcher.getExprs().map((exp, idx) => {
            if (exp.indexOf("r_sub") != -1) {
                this.matcher.ban(idx);
            }
        })
        return this.matcher.getReservedMatcherStr().trim();
    }
    
    /* Return
    {
        "r": ... // request def
        "p": ... // policy def
        "e": ... // effect def
        "m": ... // matcher def
        "ps": "p,a,b,c\np,a,c,b\n..."
    }
    */
    async genJsonProfile(subject: string): Promise<Object> {
        let jsonProfile: Record<string, string> = {};
        jsonProfile["r"] = utils.getRawRequestString(this.enforcer);
        jsonProfile["p"] = utils.getRawPolicyString(this.enforcer);
        jsonProfile["e"] = utils.getRawEffectString(this.enforcer);
        jsonProfile["m"] = await this.genMatcher();
        jsonProfile["ps"] = await this.genPolicies(subject);
        return Object(jsonProfile);
    }
}