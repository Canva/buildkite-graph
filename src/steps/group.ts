import type {
  Serializable,
  ToJsonSerializationOptions,
} from '../serialization';
import { toJsonSerializationDefaultOptions } from '../serialization';
import { Pipeline, PotentialStep } from '../index';
import { LabeledStep } from '../base';

export class GroupStep extends LabeledStep implements Serializable {
  public readonly steps: PotentialStep[] = [];

  private readonly pipeline: Pipeline = new Pipeline('');

  constructor(label: string) {
    super();

    this.withLabel(label);
  }

  add(...steps: PotentialStep[]): this {
    this.pipeline.add(...steps);

    return this;
  }

  async toJson(
    opts: ToJsonSerializationOptions = toJsonSerializationDefaultOptions,
  ): Promise<Record<string, unknown>> {
    return {
      group: this.label,
      ...(await super.toJson(opts)),
      steps: (await this.pipeline.toJson()).steps,
    };
  }
}
