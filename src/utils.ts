import {Enforcer} from "casbin";

function getModelAttr(e: Enforcer, key: string): string {
    const s = e.getModel().model.get(key)?.get(key)?.value;
    return s ? s : "";
}

export function getRawRequestString(e: Enforcer): string {
    return getModelAttr(e, "r");
}

export function getRawPolicyString(e: Enforcer): string {
    return getModelAttr(e, "p");
}

export function getRawEffectString(e: Enforcer): string {
    return getModelAttr(e, "e");
}

export function getRawMatcherString(e: Enforcer): string {
    return getModelAttr(e, "m");
}

export function getRawGroupString(e: Enforcer): string {
    return getModelAttr(e, "g");
}
