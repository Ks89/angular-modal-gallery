import {
  ButtonsStrategy,
  ButtonType,
  Description,
  DescriptionStrategy,
  KS_DEFAULT_BTN_CLOSE,
  KS_DEFAULT_BTN_DELETE,
  KS_DEFAULT_BTN_DOWNLOAD,
  KS_DEFAULT_BTN_EXTURL,
  KS_DEFAULT_BTN_FULL_SCREEN,
  LoadingConfig,
  LoadingType,
  ModalLibConfig,
  Size
} from '@ks89/angular-modal-gallery';

const DEFAULT_SIZE_PREVIEWS: Size = {
  width: '100px',
  height: 'auto'
};

// Examples A
export const LIBCONFIG_406: ModalLibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: true,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_407: ModalLibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_408: ModalLibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

// Examples B
export const LIBCONFIG_500: ModalLibConfig = {
  previewConfig: {
    visible: false
  },
  dotsConfig: {
    visible: false
  }
};

export const LIBCONFIG_501: ModalLibConfig = {
  buttonsConfig: {
    visible: false,
    strategy: ButtonsStrategy.DEFAULT
  },
  previewConfig: {
    visible: false
  },
  dotsConfig: {
    visible: false
  }
};

export const LIBCONFIG_502: ModalLibConfig = {
  buttonsConfig: {
    visible: false,
    strategy: ButtonsStrategy.DEFAULT
  },
  slideConfig: {
    infinite: false,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  },
  previewConfig: {
    visible: false
  },
  dotsConfig: {
    visible: false
  }
};

export const LIBCONFIG_503: ModalLibConfig = {
  previewConfig: {
    visible: true,
    size: {
      width: '90px',
      height: 'auto'
    }
  }
};

export const LIBCONFIG_504: ModalLibConfig = {
  enableCloseOutside: false
};

export const LIBCONFIG_505: ModalLibConfig = {
  currentImageConfig: { downloadable: false },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  }
};

export const LIBCONFIG_506: ModalLibConfig = {
  currentImageConfig: { downloadable: true },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  }
};

export const LIBCONFIG_507: ModalLibConfig = {
  currentImageConfig: { downloadable: true },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  }
};

export const LIBCONFIG_508: ModalLibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: false,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_509: ModalLibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: true,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

export const LIBCONFIG_510: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: false,
      type: LoadingType.STANDARD
    }
  }
};
export const LIBCONFIG_511: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.STANDARD
    }
  }
};
export const LIBCONFIG_512: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.CIRCULAR
    }
  }
};
export const LIBCONFIG_513: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.BARS
    }
  }
};
export const LIBCONFIG_514: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.DOTS
    }
  }
};
export const LIBCONFIG_515: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.CUBE_FLIPPING
    }
  }
};
export const LIBCONFIG_516: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.CIRCLES
    }
  }
};
export const LIBCONFIG_517: ModalLibConfig = {
  currentImageConfig: {
    loadingConfig: {
      enable: true,
      type: LoadingType.EXPLOSING_SQUARES
    }
  }
};

export const LIBCONFIG_518: ModalLibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.DEFAULT
  }
};
export const LIBCONFIG_519: ModalLibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  }
};
export const LIBCONFIG_520: ModalLibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.ADVANCED
  }
};
export const LIBCONFIG_521: ModalLibConfig = {
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.FULL
  }
};

// default buttons but extUrl will open the link in a new tab instead of the current one
// this requires to specify all buttons manually (also if they are not really custom)
export const LIBCONFIG_522: ModalLibConfig = {
  currentImageConfig: { downloadable: true },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'ext-url-image',
        type: ButtonType.EXTURL,
        extUrlInNewTab: true // <--- this is the important thing to understand this example
      },
      {
        className: 'download-image',
        type: ButtonType.DOWNLOAD
      },
      {
        className: 'close-image',
        type: ButtonType.CLOSE
      }
    ]
  }
};

export const LIBCONFIG_523: ModalLibConfig = {
  currentImageConfig: {
    downloadable: true
  },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      // KS_DEFAULT_BTN_ROTATE,
      KS_DEFAULT_BTN_FULL_SCREEN,
      KS_DEFAULT_BTN_DELETE,
      KS_DEFAULT_BTN_EXTURL,
      KS_DEFAULT_BTN_DOWNLOAD,
      KS_DEFAULT_BTN_CLOSE
    ]
  }
};

export const LIBCONFIG_524: ModalLibConfig = {
  currentImageConfig: {
    downloadable: true
  },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.CUSTOM,
    buttons: [
      {
        className: 'fas fa-plus white',
        type: ButtonType.CUSTOM,
        ariaLabel: 'custom plus aria label',
        title: 'custom plus title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-times white',
        type: ButtonType.CLOSE,
        ariaLabel: 'custom close aria label',
        title: 'custom close title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-download white',
        type: ButtonType.DOWNLOAD,
        ariaLabel: 'custom download aria label',
        title: 'custom download title',
        fontSize: '20px'
      },
      {
        className: 'fas fa-external-link-alt white',
        type: ButtonType.EXTURL,
        ariaLabel: 'custom exturl aria label',
        title: 'custom exturl title',
        fontSize: '20px'
      }
    ]
  }
};

export const LIBCONFIG_525: ModalLibConfig = {
  previewConfig: {
    visible: true,
    mobileVisible: true
  }
};

// Examples C
export const LIBCONFIG_600: ModalLibConfig = {
  keyboardConfig: {
    esc: 'KeyQ',
    left: 'ArrowDown',
    right: 'ArrowUp'
  }
};

export const LIBCONFIG_601: ModalLibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    }
  }
};

export const LIBCONFIG_602: ModalLibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.HIDE_IF_EMPTY,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    }
  }
};

export const LIBCONFIG_603: ModalLibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_HIDDEN,
      // you should build this value programmatically with the result of (show)="..()" event
      customFullDescription: 'Custom description of the current visible image'
      // if customFullDescription !== undefined, all other fields will be ignored
      // imageText: '',
      // numberSeparator: '',
      // beforeTextDescription: '',
    }
  }
};

export const LIBCONFIG_604: ModalLibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      // you should build this value programmatically with the result of (show)="..()" event
      customFullDescription: 'Custom description of the current visible image'
      // if customFullDescription !== undefined, all other fields will be ignored
      // imageText: '',
      // numberSeparator: '',
      // beforeTextDescription: '',
    }
  }
};

export const LIBCONFIG_605: ModalLibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => '
    }
  }
};

export const LIBCONFIG_606: ModalLibConfig = {
  currentImageConfig: {
    description: {
      strategy: DescriptionStrategy.ALWAYS_VISIBLE,
      imageText: 'Look this image ',
      numberSeparator: ' of ',
      beforeTextDescription: ' => ',
      style: {
        bgColor: 'rgba(255,0,0,.5)',
        textColor: 'blue',
        marginTop: '3px',
        marginBottom: '0px',
        marginLeft: '5px',
        marginRight: '5px',
        position: 'absolute',
        top: '0px',
        height: '25px'
        // be careful to use width, in particular with % values
      }
    }
  }
};

export const LIBCONFIG_607: ModalLibConfig = {
  previewConfig: {
    visible: true,
    number: 1
  }
};

export const LIBCONFIG_608: ModalLibConfig = {
  previewConfig: {
    visible: true,
    number: 5
  }
};

export const LIBCONFIG_609: ModalLibConfig = {
  previewConfig: {
    visible: true,
    arrows: false
  }
};

export const LIBCONFIG_610: ModalLibConfig = {
  previewConfig: {
    visible: true,
    clickable: false
  }
};

export const LIBCONFIG_611: ModalLibConfig = {
  previewConfig: {
    visible: true,
    size: { width: '30px', height: '30px' }
  }
};

export const LIBCONFIG_612: ModalLibConfig = {
  accessibilityConfig: {
    backgroundAriaLabel: 'CUSTOM Modal gallery full screen background',
    backgroundTitle: 'CUSTOM background title',

    plainGalleryContentAriaLabel: 'CUSTOM Plain gallery content',
    plainGalleryContentTitle: 'CUSTOM plain gallery content title',

    modalGalleryContentAriaLabel: 'CUSTOM Modal gallery content',
    modalGalleryContentTitle: 'CUSTOM modal gallery content title',

    loadingSpinnerAriaLabel: 'CUSTOM The current image is loading. Please be patient.',
    loadingSpinnerTitle: 'CUSTOM The current image is loading. Please be patient.',

    mainContainerAriaLabel: 'CUSTOM Current image and navigation',
    mainContainerTitle: 'CUSTOM main container title',
    mainPrevImageAriaLabel: 'CUSTOM Previous image',
    mainPrevImageTitle: 'CUSTOM Previous image',
    mainNextImageAriaLabel: 'CUSTOM Next image',
    mainNextImageTitle: 'CUSTOM Next image',

    dotsContainerAriaLabel: 'CUSTOM Image navigation dots',
    dotsContainerTitle: 'CUSTOM dots container title',
    dotAriaLabel: 'CUSTOM Navigate to image number',

    previewsContainerAriaLabel: 'CUSTOM Image previews',
    previewsContainerTitle: 'CUSTOM previews title',
    previewScrollPrevAriaLabel: 'CUSTOM Scroll previous previews',
    previewScrollPrevTitle: 'CUSTOM Scroll previous previews',
    previewScrollNextAriaLabel: 'CUSTOM Scroll next previews',
    previewScrollNextTitle: 'CUSTOM Scroll next previews',

    carouselContainerAriaLabel: 'Current image and navigation',
    carouselContainerTitle: '',
    carouselPrevImageAriaLabel: 'Previous image',
    carouselPrevImageTitle: 'Previous image',
    carouselNextImageAriaLabel: 'Next image',
    carouselNextImageTitle: 'Next image',
    carouselPreviewsContainerAriaLabel: 'Image previews',
    carouselPreviewsContainerTitle: '',
    carouselPreviewScrollPrevAriaLabel: 'Scroll previous previews',
    carouselPreviewScrollPrevTitle: 'Scroll previous previews',
    carouselPreviewScrollNextAriaLabel: 'Scroll next previews',
    carouselPreviewScrollNextTitle: 'Scroll next previews'
  }
};

export const LIBCONFIG_613: ModalLibConfig = {
  currentImageConfig: {
    navigateOnClick: false
  }
};

// Examples D
export const LIBCONFIG_701: ModalLibConfig = {
  currentImageConfig: {
    downloadable: true
  },
  buttonsConfig: {
    visible: true,
    strategy: ButtonsStrategy.SIMPLE
  }
};

export const LIBCONFIG_702: ModalLibConfig = {
  currentImageConfig: {
    invertSwipe: true
  }
};

export const LIBCONFIG_703: ModalLibConfig = {
  slideConfig: {
    infinite: true,
    sidePreviews: {
      show: true,
      size: DEFAULT_SIZE_PREVIEWS
    }
  }
};

// Examples E
export const LIBCONFIG_800: ModalLibConfig = {
  slideConfig: {
    playConfig: {
      autoPlay: true,
      interval: 5000,
      pauseOnHover: true
    }
  }
};

export const LIBCONFIG_801: ModalLibConfig = {
  slideConfig: {
    infinite: true,
    playConfig: {
      autoPlay: true,
      interval: 5000,
      pauseOnHover: false
    }
  }
};

export const LIBCONFIG_802: ModalLibConfig = {
  slideConfig: {
    playConfig: {
      autoPlay: true,
      interval: 1000,
      pauseOnHover: false
    }
  }
};

// Examples F
export const LIBCONFIG_900: ModalLibConfig = {
  slideConfig: {
    infinite: false
  },
  currentImageConfig: {
    loadingConfig: { enable: true, type: LoadingType.STANDARD } as LoadingConfig,
    description: { strategy: DescriptionStrategy.ALWAYS_VISIBLE } as Description
  }
};
