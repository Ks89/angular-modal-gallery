import { inject, TestBed, waitForAsync } from '@angular/core/testing';
import { AttachToOverlayService } from './attach-to-overlay.service';
import { ModalGalleryService } from './modal-gallery.service';
import { OverlayModule, OverlayRef } from '@angular/cdk/overlay';
import { Image } from '../../model/image.class';
import { ModalGalleryRef } from './modal-gallery-ref';

const IMAGES: Image[] = [
  new Image(0, {
    // modal
    img: '../assets/images/gallery/img1.jpg',
    extUrl: 'http://www.google.com'
  }),
  new Image(1, {
    // modal
    img: '../assets/images/gallery/img2.png',
    description: 'Description 2'
  }),
  new Image(
    2,
    {
      // modal
      img: '../assets/images/gallery/img3.jpg',
      description: 'Description 3',
      extUrl: 'http://www.google.com'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img3.png',
      title: 'custom title 2',
      alt: 'custom alt 2',
      ariaLabel: 'arial label 2'
    }
  ),
  new Image(3, {
    // modal
    img: '../assets/images/gallery/img4.jpg',
    description: 'Description 4',
    extUrl: 'http://www.google.com'
  }),
  new Image(
    4,
    {
      // modal
      img: '../assets/images/gallery/img5.jpg'
    },
    {
      // plain
      img: '../assets/images/gallery/thumbs/img5.jpg'
    }
  )
];

describe('AttachToOverlayService', () => {
  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [OverlayModule],
      providers: [
        AttachToOverlayService,
        {
          provide: ModalGalleryService,
          useClass: ModalGalleryService
        }
      ]
    });
  }));

  it('should instantiate service when inject service', inject([AttachToOverlayService], (service: AttachToOverlayService) => {
    expect(service instanceof AttachToOverlayService).toEqual(true);
  }));

  describe('#attachToOverlay()', () => {
    describe('---YES---', () => {
      it('should call the attach method on the given overlayRef', inject(
        [ModalGalleryService, AttachToOverlayService],
        (modalGalleryService: ModalGalleryService, attachToOverlayService: AttachToOverlayService) => {
          attachToOverlayService.initialize();
          const ID: number = 1;
          const config = {
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          };
          const ref: ModalGalleryRef | undefined = modalGalleryService.open({
            id: ID,
            images: IMAGES,
            currentImage: IMAGES[0]
          });
          expect(ref).toBeDefined();
          expect(ref instanceof ModalGalleryRef).toBeTrue();
          let attachCalled = false;
          const mockOverlayRef = {
            attach: () => {
              attachCalled = true;
            }
          };

          modalGalleryService.triggerAttachToOverlay.emit({
            config,
            dialogRef: ref as ModalGalleryRef,
            overlayRef: mockOverlayRef as unknown as OverlayRef
          });

          expect(attachCalled).toBeTrue();
        }
      ));
    });
  });
});
