import { Expose, Exclude, Transform } from 'class-transformer';
import slug from 'slug';
import { LabeledStep } from './base';
import { BuildImpl, Build } from './trigger/build';
import { Entity } from '../';

@Exclude()
export class TriggerStep extends LabeledStep {
    @Expose()
    @Transform((value: BuildImpl<any>) => (value.hasData() ? value : undefined))
    public readonly build: Build<TriggerStep> = new BuildImpl(this);
    @Expose({ name: 'async' })
    @Transform((value: boolean) => (value ? value : undefined))
    private _async: boolean = false;
    @Expose()
    get trigger() {
        return this._trigger instanceof Entity
            ? slug(this._trigger.name, { lower: true })
            : this._trigger;
    }
    constructor(
        private readonly _trigger: Entity | string,
        label?: string,
        async: boolean = false,
    ) {
        super();
        if (label) {
            this.withLabel(label);
        }
        this._async = async;
    }
    async(async: boolean): this {
        this._async = async;
        return this;
    }
    toString() {
        return this.label || `[trigger ${this.trigger}]`;
    }
}