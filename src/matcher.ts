import {strict as assert} from 'assert';

enum BooleanOp {
    And = 1,
    Or
}

export default class Matcher {
    exprs: string[] = [];
    boolops: BooleanOp[] = [];
    reserved: boolean[] = [];
    
    constructor(sMatcher: string) {
        assert(sMatcher.startsWith("m ="));
        sMatcher = sMatcher.slice(3);
        this.boolops.push(BooleanOp.Or); // For convenience
        for (let orExprs of sMatcher.split("||")) {
            for (let exp of orExprs.split("&&")) {
                this.exprs.push(exp.trim());
                this.boolops.push(BooleanOp.And);
                this.reserved.push(true);
            }
            this.boolops.pop(); // Remove the last "And"
            this.boolops.push(BooleanOp.Or);
        }
    }

    getExprs(): string[] {
        return this.exprs;
    }

    ban(idx: number) {
        this.reserved[idx] = false;
    }

    getReservedMatcherStr(): string {
        let ret = "";
        let prev = this.boolops[0];
        for (let i = 0; i < this.exprs.length; ++i) {
            if (!this.reserved[i]) { 
                // Removed the ith exprs
                prev = this.boolops[i] == BooleanOp.Or ? BooleanOp.Or : this.boolops[i+1];
            } else {
                ret += prev == BooleanOp.And ? "&&" : "||";
                prev = this.boolops[i+1];
                ret += ` ${this.exprs[i]} `;
            }
        }
        ret = "m =" + ret.slice(2);
        return ret;
    }
    
}