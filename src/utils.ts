import {Enforcer} from 'casbin';

export function getRawMatcherString(e: Enforcer): string | undefined {
    return e.getModel().model.get('m')?.get('m')?.value;
}