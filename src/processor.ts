import {Enforcer} from 'casbin';
import { isExpressionStatement, visitLexicalEnvironment } from 'typescript';
import Matcher from './matcher';
import Policy from './policy';

class Processor {
    enforcer!: Enforcer;
    matcher!: Matcher;
    constructor(e: Enforcer) {
        this.enforcer = e;
        // TODO: Init mathcer
        this.matcher = new Matcher("m = r.sub == p.sub && r.obj == p.obj && r.act == p.act");
    }

    async process(subject: string): Promise<string> {
        // 给定一个subject, 返回一个JSON string,
        // 这个JSON中记录着优化后的model conf与正确的policy
        
        let subjects = [subject];
        let idx = 0;
        let requiredPolicies: Policy[] = [];
        while (idx < subjects.length) {
            for (const expr in this.matcher.getExprs()) {
                if (expr.indexOf("r.sub")) {
                    if (expr.match("^g\\(.*\\)$")) {
                        // r.sub is in the form of "g(r.sub, p.sub)"
                        // 遍历所有group policy, 把符合的g,subjects[idx],xxx中的xxx加入到subjects中
                        throw new Error("Not implemented");
                    } else { 
                        // r.sub is in the form of "r.sub == p.sub"
                        const policies = await this.enforcer.getFilteredPolicy(0, subjects[idx]);
                        for (const sPolicy of policies) {
                            requiredPolicies.push(new Policy(sPolicy));
                        }
                    }
                }
            }
        }
        const ret = {};
        return "";
        // 把所有的policies匿名化。（把subject换成"_"）
        // 构建新的Matcher: 把含有r.sub的部分替换为"_" （或者直接去掉）

    }

}