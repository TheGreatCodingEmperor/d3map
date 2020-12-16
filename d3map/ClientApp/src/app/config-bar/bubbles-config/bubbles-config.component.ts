import { AfterViewInit, Component, Input, OnInit, ViewChild } from '@angular/core';
import { IBubbles } from '../config';

@Component({
  selector: 'bubbles-config',
  templateUrl: './bubbles-config.component.html',
  styleUrls: ['./bubbles-config.component.css']
})
export class BubblesConfigComponent implements AfterViewInit {
  @ViewChild('editor') editor;
  @Input() bubblesConfig: IBubbles;
  constructor() { }

  ngAfterViewInit(): void {
    this.editor.getEditor().setOptions({
      showLineNumbers: true,
      tabSize: 2
    });

    this.editor.mode = 'javascript';
  }

}
