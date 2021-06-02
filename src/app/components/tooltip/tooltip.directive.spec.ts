import { OverlayConfig, OverlayRef } from '@angular/cdk/overlay';
import { DebugElement } from '@angular/core';
import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

import { DummyComponent } from '../../mocks/components/dummy.component.mock';
import { DnbhubMaterialModule } from '../../modules/material/custom-material.module';
import { DnbhubTooltipDirective } from './tooltip.directive';

describe('DnbhubTooltipDirective', () => {
  let fixture: ComponentFixture<DummyComponent>;
  let debugElement: DebugElement;
  let directive: DnbhubTooltipDirective;

  beforeEach(
    waitForAsync(() => {
      void TestBed.configureTestingModule({
        imports: [DnbhubMaterialModule.forRoot()],
        declarations: [DummyComponent, DnbhubTooltipDirective],
        providers: [
          {
            provide: OverlayConfig,
            useFactory: () => new OverlayConfig(),
          },
        ],
      })
        .compileComponents()
        .then(() => {
          fixture = TestBed.createComponent(DummyComponent);
          debugElement = fixture.debugElement.query(By.directive(DnbhubTooltipDirective));

          directive = debugElement.injector.get(DnbhubTooltipDirective);

          fixture.detectChanges();
        });
    }),
  );

  it('should be defined', () => {
    expect(directive).toBeDefined();
  });

  it('should not show popover', () => {
    directive.dnbhubTooltip = void 0;
    const event = new Event('mouseenter');
    (debugElement.nativeElement as HTMLDivElement).dispatchEvent(event);
    expect((directive as unknown as { overlayRef: OverlayRef | null }).overlayRef).toBeNull();
  });

  it('should show popover', () => {
    directive.dnbhubTooltip = 'test';
    const event = new Event('mouseenter');
    (debugElement.nativeElement as HTMLDivElement).dispatchEvent(event);
    expect((directive as unknown as { overlayRef: OverlayRef | null }).overlayRef).not.toBeNull();
  });

  it('should dispose popover', () => {
    directive.dnbhubTooltip = 'test';
    const mouseenter = new Event('mouseenter');
    (debugElement.nativeElement as HTMLDivElement).dispatchEvent(mouseenter);
    expect((directive as unknown as { overlayRef: OverlayRef | null }).overlayRef).not.toBeNull();
    const mouseleave = new Event('mouseleave');
    (debugElement.nativeElement as HTMLDivElement).dispatchEvent(mouseleave);
    expect((directive as unknown as { overlayRef: OverlayRef | null }).overlayRef).toBeNull();
  });
});
