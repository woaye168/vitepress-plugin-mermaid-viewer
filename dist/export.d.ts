export declare function serializeSvg(svg: SVGSVGElement, fontFamily?: string): {
    xml: string;
    width: number;
    height: number;
};
export declare function triggerDownload(blob: Blob, filename: string): void;
export type MermaidExportFormat = 'png' | 'svg' | 'jpeg';
export declare function downloadMermaid(svg: SVGSVGElement, format?: MermaidExportFormat): Promise<void>;
