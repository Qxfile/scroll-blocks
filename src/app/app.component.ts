import { Component, ElementRef, ViewChild, signal, AfterViewInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  standalone: true,
  styleUrl: './app.component.scss'
})
export class AppComponent implements AfterViewInit {
  title = 'podelki';

  test = signal(Array.from({ length: 50 }, (_, i) => (i + 1).toString()));

  currentVisibleBlock = signal<string | null>(null);

  @ViewChild('listContainer') listContainer!: ElementRef<HTMLDivElement>;

  ngAfterViewInit() {
    setTimeout(() => {
      if (!this.listContainer) return;

      const observer = new IntersectionObserver(
        (entries) => {
          let lastVisible = null;
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              lastVisible = entry.target.textContent; // отсюда скорее всего можно вытащить через атрибуты состояние у сообщения
            }
          });
          if (lastVisible) {
            this.currentVisibleBlock.set(lastVisible);
          }
        },
        {
          root: this.listContainer.nativeElement,
          threshold: 0.5, // параметр от 0 до 1 насколько нужно прокрутить видимый элемент шоб он засчитал его просммотренным (стоит 50%)
        }
      );

      document.querySelectorAll('.app__block').forEach(block => observer.observe(block));
    }, 0);
  }
}
