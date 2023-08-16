declare module 'marked-mangle' {
  interface MangleOptions {
    // The default is false
    gfm?: boolean;
    default?: boolean;
  }

  function mangle(text: string, options?: MangleOptions): string;

  export = mangle;
}
