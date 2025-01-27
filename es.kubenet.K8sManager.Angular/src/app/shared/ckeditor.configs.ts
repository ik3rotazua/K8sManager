import { SetData } from '@efordevelops/ax-toolbox';

// eslint-disable-next-line max-len
// PLUGINS - https://ckeditor.com/docs/ckeditor5/latest/builds/guides/integration/frameworks/angular.html#using-the-editor-with-collaboration-plugins
// import Image from '@ckeditor/ckeditor5-image/src/image';
// ----


/**
 *
 * @param baseConfig Optional configuration to expand
 */
export function getCKEditorConfigDefault(baseConfig?: Partial<CkEditorConfig>) {
  return new CkEditorConfig()
    .setData(baseConfig)
    .setData({
      toolar: [
        'undo', 'redo',
        '|',
        'selectAll',
        '|',
        'heading',
        '|',
        'bold', 'italic',
        'link', 'numberedList', 'bulletedList',
        '|',
        'blockQuote', 'indent', 'outdent',
        '|',
        'insertTable', 'tableColumn', 'tableRow', 'mergeTableCells',
      ]
    });
}

/**
 * Used for simple text formatting:
 * ```typescript
 * toolbar = ['undo', 'redo', '|',
 * 'selectAll', '|',
 * 'heading', '|',
 * 'bold', 'italic', 'link']
 * ```
 * @param baseConfig Optional configuration to expand
 */
export function getCKEditorConfigDefault_SimpleText(baseConfig: Partial<CkEditorConfig>) {
  const conf = new CkEditorConfig()
    .setData(baseConfig)
    .setData({
      toolbar: [
        'undo', 'redo',
        '|',
        'selectAll',
        '|',
        'heading',
        '|',
        'bold', 'italic',
        'link',
        '|',
        'indent', 'outdent',
      ]
    });
  return conf;
}


export class CkEditorConfig extends SetData {
  /** Language the CKEditorConfig will use. Languages must be loaded at app.module.ts */
  language = 'es';
  toolar: CkEditorConfigToolbarComponent[] = [];
}
/**
 * `'|'` can be used multiple times. It's a separator.
 */
export type CkEditorConfigToolbarComponent =
    '|' |
    'undo' | 'redo' |
    'selectAll' |
    'heading' |
    'bold' | 'italic' |
    'link' |
    'numberedList' | 'bulletedList' |
    'blockQuote' | 'indent' | 'outdent' |
    'insertTable' | 'tableColumn' | 'tableRow' | 'mergeTableCells' |
    'ckfinder' |
    'imageTextAlternative' | 'imageUpload' | 'imageStyle:full' | 'imageStyle:side' |
    'mediaEmbed';
