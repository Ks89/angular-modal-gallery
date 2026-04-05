import { ButtonConfig, ButtonType } from '../../model/buttons-config.interface';
import { Size } from '../../model/size.interface';

/**
 * Default button size object
 */
export const KS_DEFAULT_SIZE: Size = { height: 'auto', width: '30px' };

/**
 * Default close button object
 */
export const KS_DEFAULT_BTN_CLOSE: ButtonConfig = {
  className: 'close-image',
  size: KS_DEFAULT_SIZE,
  type: ButtonType.CLOSE,
  title: 'Close this modal image gallery',
  ariaLabel: 'Close this modal image gallery'
};

/**
 * Default download button object
 */
export const KS_DEFAULT_BTN_DOWNLOAD: ButtonConfig = {
  className: 'download-image',
  size: KS_DEFAULT_SIZE,
  type: ButtonType.DOWNLOAD,
  title: 'Download the current image',
  ariaLabel: 'Download the current image'
};

/**
 * Default exturl button object
 */
export const KS_DEFAULT_BTN_EXTURL: ButtonConfig = {
  className: 'ext-url-image',
  size: KS_DEFAULT_SIZE,
  type: ButtonType.EXTURL,
  title: 'Navigate the current image',
  ariaLabel: 'Navigate the current image'
};
// /**
//  * Default refresh button object
//  */
// export const KS_DEFAULT_BTN_REFRESH: ButtonConfig = {
//   className: 'refresh-image',
//   size: KS_DEFAULT_SIZE,
//   type: ButtonType.REFRESH,
//   title: 'Refresh all images',
//   ariaLabel: 'Refresh all images'
// };

/**
 * Default delete button object
 */
export const KS_DEFAULT_BTN_DELETE: ButtonConfig = {
  className: 'delete-image',
  size: KS_DEFAULT_SIZE,
  type: ButtonType.DELETE,
  title: 'Delete the current image',
  ariaLabel: 'Delete the current image'
};

/**
 * Default full-screen button object
 */
export const KS_DEFAULT_BTN_FULL_SCREEN: ButtonConfig = {
  className: 'fullscreen-image',
  size: KS_DEFAULT_SIZE,
  type: ButtonType.FULLSCREEN,
  title: 'Switch to full-screen',
  ariaLabel: 'Switch to full-screen'
};
/**
 * Default rotate button object
 */
// export const KS_DEFAULT_BTN_ROTATE: ButtonConfig = {
//   className: 'rotate-image',
//   size: KS_DEFAULT_SIZE,
//   type: ButtonType.ROTATE,
//   title: 'Rotate the current image clockwise 90 degrees',
//   ariaLabel: 'Rotate the current image clockwise 90 degrees'
// };
