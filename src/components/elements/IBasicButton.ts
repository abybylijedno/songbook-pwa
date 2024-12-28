export interface IBasicButton {
  title: string;
  icon: string;
  color?: string;
  main?: boolean,
  disabled?: boolean;
  action?: Function;
}
