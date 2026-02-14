export type PageSize = {
  width: number;
  height: number;
};

export type PageMargins = Partial<{
  top: number;
  bottom: number;
  left: number;
  right: number;
}>;

export type SmartPagesOptions = {
  beforeRender?: () => void | Promise<void>;
  afterRender?: () => void | Promise<void>;
  throttle?: number;
};
