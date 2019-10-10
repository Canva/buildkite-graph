import { PotentialStep, Step } from './index';
import { Conditional } from './conditional';

export async function unwrapSteps(
    steps: PotentialStep[],
    cache: Map<Conditional<Step>, Step>,
): Promise<Step[]> {
    const ret: Step[] = [];
    for (const s of steps) {
        if (s instanceof Conditional) {
            const accepted = s.accept();
            if (accepted === true || (await accepted)) {
                let cond: Step;
                if (cache.has(s)) {
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    cond = cache.get(s)!;
                } else {
                    cond = s.get();
                    cache.set(s, cond);
                }
                ret.push(cond);
            }
        } else {
            ret.push(s);
        }
    }
    return ret;
}
