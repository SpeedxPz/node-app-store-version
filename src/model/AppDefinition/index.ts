
export interface IAppDefinition {
  id: string;
  type: 'playstore' | 'appstore' | string;
}

export class AppDefinition implements IAppDefinition {
  id: IAppDefinition['id'];
  type: IAppDefinition['type'];

  constructor(appDefinition: IAppDefinition) {
    Object.assign(this, appDefinition);
  }
}