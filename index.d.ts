export interface ProcessVersions {
    node: () => string;
    chrome: () => string;
}

declare global {
    interface Window {
      versions: ProcessVersions;
    }
  }
   