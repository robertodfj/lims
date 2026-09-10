import { ChangeDetectionStrategy, Component, input } from '@angular/core';

export type IconName =
  | 'grid'
  | 'clipboard'
  | 'layers'
  | 'sliders'
  | 'cog'
  | 'file-text'
  | 'chevron-down'
  | 'search'
  | 'plus'
  | 'pencil'
  | 'trash'
  | 'filter'
  | 'x'
  | 'more-horizontal'
  | 'arrow-up-down'
  | 'check'
  | 'user'
  | 'inbox'
  | 'sparkle'
  | 'send';

/** Set mínimo de iconos de línea (20x20, trazo 1.6) usado en toda la app. */
@Component({
  selector: 'app-icon',
  changeDetection: ChangeDetectionStrategy.OnPush,
  template: `
    <svg
      [attr.width]="size()"
      [attr.height]="size()"
      viewBox="0 0 20 20"
      fill="none"
      stroke="currentColor"
      stroke-width="1.6"
      stroke-linecap="round"
      stroke-linejoin="round"
    >
      @switch (name()) {
        @case ('grid') {
          <rect x="3" y="3" width="6" height="6" rx="1.2" />
          <rect x="11" y="3" width="6" height="6" rx="1.2" />
          <rect x="3" y="11" width="6" height="6" rx="1.2" />
          <rect x="11" y="11" width="6" height="6" rx="1.2" />
        }
        @case ('clipboard') {
          <rect x="4.5" y="4" width="11" height="13" rx="1.5" />
          <path d="M7.5 4a2.5 2.5 0 0 1 5 0" />
          <path d="M7 9.5h6M7 12.5h6M7 15.5h3.5" />
        }
        @case ('layers') {
          <path d="M10 3l7 3.6-7 3.6-7-3.6L10 3z" />
          <path d="M3 10.4l7 3.6 7-3.6" />
          <path d="M3 13.8l7 3.6 7-3.6" />
        }
        @case ('sliders') {
          <path d="M4 5.5h12M4 10h12M4 14.5h12" />
          <circle cx="8" cy="5.5" r="1.6" fill="var(--surface, #fff)" />
          <circle cx="14" cy="10" r="1.6" fill="var(--surface, #fff)" />
          <circle cx="7" cy="14.5" r="1.6" fill="var(--surface, #fff)" />
        }
        @case ('cog') {
          <circle cx="10" cy="10" r="2.6" />
          <path
            d="M10 3.5v1.6M10 14.9v1.6M16.5 10h-1.6M5.1 10H3.5M14.6 5.4l-1.1 1.1M6.5 13.5l-1.1 1.1M14.6 14.6l-1.1-1.1M6.5 6.5 5.4 5.4"
          />
        }
        @case ('file-text') {
          <path d="M6 3h5.5L15 6.5V17H6V3z" />
          <path d="M11.5 3v3.5H15" />
          <path d="M8 10.5h4M8 13h4" />
        }
        @case ('chevron-down') {
          <path d="M5 7.5l5 5 5-5" />
        }
        @case ('search') {
          <circle cx="8.7" cy="8.7" r="5.2" />
          <path d="M16 16l-3.6-3.6" />
        }
        @case ('plus') {
          <path d="M10 4.5v11M4.5 10h11" />
        }
        @case ('pencil') {
          <path d="M13 3.5l3.5 3.5L7 16.5H3.5V13L13 3.5z" />
        }
        @case ('trash') {
          <path d="M4.5 6h11M8 6V4.3a1 1 0 0 1 1-1h2a1 1 0 0 1 1 1V6" />
          <path d="M6 6v9.5a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V6" />
          <path d="M8.5 9v4.5M11.5 9v4.5" />
        }
        @case ('filter') {
          <path d="M3.5 4.5h13L11.5 10.8V16l-3-1.5v-3.7L3.5 4.5z" />
        }
        @case ('x') {
          <path d="M5 5l10 10M15 5L5 15" />
        }
        @case ('more-horizontal') {
          <circle cx="5" cy="10" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="10" cy="10" r="1.2" fill="currentColor" stroke="none" />
          <circle cx="15" cy="10" r="1.2" fill="currentColor" stroke="none" />
        }
        @case ('arrow-up-down') {
          <path d="M7 3.5v13M7 3.5L4 6.5M7 3.5l3 3M13 16.5v-13M13 16.5l3-3M13 16.5l-3-3" />
        }
        @case ('check') {
          <path d="M4.5 10.5l3.5 3.5 7.5-8" />
        }
        @case ('user') {
          <circle cx="10" cy="7" r="3" />
          <path d="M4 17c0-3 2.7-5 6-5s6 2 6 5" />
        }
        @case ('inbox') {
          <path d="M3.5 11.5h4l1.3 2h2.4l1.3-2h4" />
          <path d="M3.5 11.5 5 4.8A1 1 0 0 1 6 4h8a1 1 0 0 1 1 .96l1.5 6.54" />
          <path d="M3.5 11.5V15a1 1 0 0 0 1 1h11a1 1 0 0 0 1-1v-3.5" />
        }
        @case ('sparkle') {
          <path
            d="M10 2.5c.4 2.6 1 4.1 2 5.1s2.5 1.6 5.1 2c-2.6.4-4.1 1-5.1 2s-1.6 2.5-2 5.1c-.4-2.6-1-4.1-2-5.1s-2.5-1.6-5.1-2c2.6-.4 4.1-1 5.1-2s1.6-2.5 2-5.1z"
            fill="currentColor"
            stroke="none"
          />
        }
        @case ('send') {
          <path d="M17 3L3 9.2l5.3 2 2 5.3L17 3z" />
          <path d="M8.3 11.2 17 3" />
        }
      }
    </svg>
  `,
})
export class Icon {
  readonly name = input.required<IconName>();
  readonly size = input(18);
}
